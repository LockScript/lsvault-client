/* eslint-disable @next/next/no-img-element */
"use client";

import { saveVault } from "@/api";
import { VaultItem } from "@/app/page";
import { encryptVault } from "@/crypto";
import {
  AvatarBadge,
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import {
  CopyIcon,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  Plus,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import zxcvbn from "zxcvbn";
import FormWrapper from "./FormWrapper";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import VaultSidebar from "./VaultSidebar";
import { toast } from "sonner";
import { Avatar } from "./ui/avatar";
import Image from "next/image";
import { getFavicon } from "@/lib/utils";
import Favicon from "./Favicon";
import { set } from "date-fns";
import { useLockState } from "./LockStateProvider";

function Vault({
  vault = [],
  vaultKey = "",
}: {
  vault: VaultItem[];
  vaultKey: string;
}) {
  const { control, register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      vault,
    },
  });
  const [showPassword, setShowPassword] = useState<boolean[]>(
    vault.map(() => false)
  );
  const { fields, append, remove } = useFieldArray({ control, name: "vault" });
  const mutation = useMutation(saveVault);
  const [passwordLength, setPasswordLength] = useState(8);
  const [password, setPassword] = useState("");
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [avoidSimilarCharacters, setAvoidSimilarCharacters] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);
  const { setIsLocked } = useLockState();

  const handlePasswordChange = (password: string) => {
    const { score } = zxcvbn(password);
    setPasswordStrength(score);
  };

  const handlePasswordVisibilityToggle = (index: number) => {
    setShowPassword((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleGeneratedPasswordVisibility = () =>
    setShowGeneratedPassword(!showGeneratedPassword);

  const generatePassword = (
    includeSpecialChars: boolean,
    includeNumbers: boolean,
    avoidSimilarCharacters: boolean
  ) => {
    const numbers = "0123456789";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "!@#$%^&*()_-+=[]{};:,.<>?";
    const similarCharacters = "Il1O0";

    let allowedChars = lowerCaseLetters + upperCaseLetters;
    if (includeSpecialChars) {
      allowedChars += specialChars;
    }
    if (includeNumbers) {
      allowedChars += numbers;
    }
    if (avoidSimilarCharacters) {
      allowedChars = allowedChars
        .split("")
        .filter((char) => !similarCharacters.includes(char))
        .join("");
    }

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const index = Math.floor(Math.random() * allowedChars.length);
      password += allowedChars[index];
    }

    setPassword(password);
    handlePasswordChange(password);
  };

  const handleVisitWebsiteClick = (website: string) => {
    window.open(website, "_blank");
  };

  return (
    <>
      <div>
        <div className="flex justify-center mt-10">
          <VaultSidebar />
          <FormWrapper
            onSubmit={handleSubmit(({ vault }) => {
              console.log({ vault });
              const encryptedVault = encryptVault({
                vault: JSON.stringify({ vault }),
                vaultKey,
              });
              window.sessionStorage.setItem("vault", JSON.stringify(vault));
              mutation.mutate({ encryptedVault });
            })}
          >
            <h1 className="text-center font-extrabold text-5xl">LockScript</h1>
            <div className="flex justify-center mt-10">
              <Box className="bg-accent p-4 shadow-md inline-flex justify-center items-center space-x-5">
                <Button
                  onClick={() =>
                    append({ website: "", username: "", password: "" })
                  }
                  aria-label="Add new entry"
                  size={"icon"}
                >
                  <Plus />
                </Button>
                <Button type="submit" size={"icon"}>
                  <Save />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size={"icon"}>
                      <RefreshCw />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Password Generator</DialogTitle>
                      <DialogDescription>
                        Generate your secure passwords here and copy them.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center">
                      <Slider
                        aria-label="slider-ex-1"
                        defaultValue={passwordLength}
                        min={8}
                        max={32}
                        onChange={(val) => setPasswordLength(val)}
                        className="mt-10"
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <p className="ml-4 mt-10">{passwordLength}</p>
                    </div>
                    <Checkbox
                      className="mt-4"
                      isChecked={includeSpecialChars}
                      onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                    >
                      Include special characters
                    </Checkbox>
                    <Checkbox
                      className="mt-4"
                      isChecked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                    >
                      Include numbers
                    </Checkbox>

                    <Checkbox
                      className="mt-4"
                      isChecked={avoidSimilarCharacters}
                      onChange={(e) =>
                        setAvoidSimilarCharacters(e.target.checked)
                      }
                    >
                      Avoid similar characters
                    </Checkbox>
                    <Button
                      onClick={() =>
                        generatePassword(
                          includeSpecialChars,
                          includeNumbers,
                          avoidSimilarCharacters
                        )
                      }
                    >
                      Generate
                    </Button>
                    <div className="flex items-center">
                      <InputGroup size="md">
                        <Input
                          value={password}
                          type={showGeneratedPassword ? "text" : "password"}
                          readOnly
                        />
                      </InputGroup>
                      <Button
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(password);
                          toast("Copied!");
                        }}
                        className="p-2 ml-2"
                      >
                        <CopyIcon size={20} />
                      </Button>
                      <Button
                        size="icon"
                        onClick={handleGeneratedPasswordVisibility}
                        className="p-2 ml-2"
                      >
                        {showGeneratedPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                    <div>
                      <Progress
                        value={passwordStrength * 25}
                        max={100}
                        colorScheme={
                          passwordStrength === 0
                            ? "red"
                            : passwordStrength < 3
                            ? "orange"
                            : passwordStrength === 3
                            ? "yellow"
                            : "green"
                        }
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="icon" onClick={() => setIsLocked(true)}>
                  <Lock />
                </Button>
              </Box>
            </div>

            {fields.map((field, index) => {
              return (
                <Box className="mt-4 mb-4 flex flex-end" key={field.id}>
                  <FormControl>
                    <FormLabel htmlFor={`website-${index}`}>Website</FormLabel>
                    <Flex>
                      <Favicon website={field.website} />
                      <Input
                        type="url"
                        id={`website-${index}`}
                        placeholder="Website"
                        {...register(`vault.${index}.website`, {
                          required: "Website is required.",
                        })}
                      />
                    </Flex>
                  </FormControl>
                  <FormControl ml="2">
                    <FormLabel htmlFor={`username-${index}`}>
                      Username
                    </FormLabel>
                    <Input
                      id={`username-${index}`}
                      placeholder="Username"
                      {...register(`vault.${index}.username`, {
                        required: "Username is required.",
                      })}
                    />
                  </FormControl>
                  <FormControl ml="2">
                    <FormLabel htmlFor={`password-${index}`}>
                      Password
                    </FormLabel>
                    <Input
                      type={showPassword[index] ? "text" : "password"}
                      id={`password-${index}`}
                      placeholder="Password"
                      {...register(`vault.${index}.password`, {
                        required: "Password is required.",
                      })}
                    />
                  </FormControl>
                  <FormControl ml="2">
                    <Button
                      size={"icon"}
                      className="mt-8"
                      onClick={() => remove(index)}
                      aria-label="Remove entry"
                    >
                      <X />
                    </Button>
                    <Button
                      className="ml-2"
                      onClick={() => handlePasswordVisibilityToggle(index)}
                      size={"icon"}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword[index] ? <Eye /> : <EyeOff />}
                    </Button>
                    <Button
                      className="ml-2"
                      onClick={() => handleVisitWebsiteClick(field.website)}
                      size={"icon"}
                      aria-label="Visit website"
                    >
                      <ExternalLink />
                    </Button>
                  </FormControl>
                </Box>
              );
            })}
          </FormWrapper>
        </div>
      </div>
    </>
  );
}

export default Vault;
