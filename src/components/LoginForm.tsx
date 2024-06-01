"use client";

import { loginUser } from "@/api";
import { VaultItem } from "@/app/page";
import { decryptVault, generateVaultKey, hashPassword } from "@/crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";

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
  const router = useRouter();

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
      router.push("/");
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
    <div className="bg-black flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="flex justify-center py-6">
          <MountainIcon className="h-8 w-8" />
        </div>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h1 className="font-extrabold text-center text-7xl py-10 bg-gradient-to-r from-sky-500 via-purple-300 to-purple-500 text-transparent bg-clip-text">
                Login
              </h1>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Email"
                        {...field}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : ""}
                      />
                    </FormControl>
                    {errors.email && (
                      <div id="email-error" role="alert">
                        {errors.email.message}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        {...field}
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby={
                          errors.password ? "password-error" : ""
                        }
                      />
                    </FormControl>
                    {errors.password && (
                      <div id="password-error" role="alert">
                        {errors.password.message}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-10 w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

interface MountainIconProps {
  className?: string;
  style?: React.CSSProperties;
}

function MountainIcon(props: MountainIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export default LoginForm;
