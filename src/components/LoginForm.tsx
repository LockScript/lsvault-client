"use client";

import { VaultItem } from "@/app/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { toast } from "sonner";
import { useMutation } from "react-query";
import { loginUser } from "@/api";
import { decryptVault, generateVaultKey, hashPassword } from "@/crypto";

const FormSchema = z.object({
  email: z.string().email().min(4, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function LoginForm({
  setVault,
  setVaultKey,
  setStep,
}: {
  setVault: Dispatch<SetStateAction<VaultItem[]>>;
  setVaultKey: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<"login" | "register" | "vault">>;
}) {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<{ email: string; password: string; hashedPassword: string }>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation(loginUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues("hashedPassword");
      const email = getValues("email");
      const vaultKey = generateVaultKey({
        hashedPassword,
        email,
        salt,
      });

      window.sessionStorage.setItem("vk", vaultKey);

      const decryptedVault = decryptVault({ vault, vaultKey });

      setVaultKey(vaultKey);
      setVault(decryptedVault);

      window.sessionStorage.setItem("vault", JSON.stringify(decryptedVault));

      setStep("vault");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred. Please try again later.";
      setErrorMessage(errorMessage);
    },
  });

  const handleRegistrationClick = () => {
    setStep("register");
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Logging you in...");
    const email = data.email;
    const hashedPassword = hashPassword(data.password);

    setValue("hashedPassword", hashedPassword);

    mutation.mutate({
      email,
      hashedPassword,
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="font-extrabold text-center text-5xl mt-6">Login</h1>
          <div className="flex flex-col mt-10 items-center">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-10">
              Login
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex justify-center">
        <Button className="text-center mt-10" onClick={handleRegistrationClick}>
          Register
        </Button>
      </div>
    </>
  );
}

export default LoginForm;
