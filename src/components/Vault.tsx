/* eslint-disable @next/next/no-img-element */
"use client";

import { saveVault } from "@/api";
import { VaultItem } from "@/app/page";
import { encryptVault } from "@/crypto";
import {
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
  BriefcaseIcon,
  CopyIcon,
  ExternalLink,
  Eye,
  EyeOff,
  HomeIcon,
  Lock,
  MailIcon,
  Plus,
  RefreshCw,
  Save,
  SettingsIcon,
  UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import zxcvbn from "zxcvbn";
import Favicon from "./Favicon";
import FormWrapper from "./FormWrapper";
import { useLockState } from "./LockStateProvider";
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
      <div className="flex h-screen dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 p-4 flex flex-col items-center justify-center gap-4 shadow-md">
          <Link
            href="#"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            prefetch={false}
          >
            <HomeIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
          <Link
            href="#"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            prefetch={false}
          >
            <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
          <Link
            href="#"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            prefetch={false}
          >
            <BriefcaseIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
          <Link
            href="#"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            prefetch={false}
          >
            <MailIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
          <Link
            href="#"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            prefetch={false}
          >
            <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
        </nav>
        <div className="bg-black min-h-screen w-full">
          <div className="flex justify-center pt-10">
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
              <div className="flex justify-center">
                <Box className="bg-accent p-4 shadow-md inline-flex justify-center items-center space-x-5 rounded-xl">
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
                        onChange={(e) =>
                          setIncludeSpecialChars(e.target.checked)
                        }
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
              <div
                style={{ maxHeight: "600px", overflowY: "auto" }}
                className="border border-neutral-900 p-4 rounded-lg mt-2"
              >
                {fields.map((field, index) => {
                  return (
                    <Box className="mt-4 mb-4 flex flex-end" key={field.id}>
                      <FormControl>
                        <FormLabel
                          className="text-white"
                          htmlFor={`website-${index}`}
                        >
                          Website
                        </FormLabel>
                        <Flex className="pl-2">
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
                        <FormLabel
                          className="text-white"
                          htmlFor={`username-${index}`}
                        >
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
                        <FormLabel
                          className="text-white"
                          htmlFor={`password-${index}`}
                        >
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
              </div>
            </FormWrapper>
          </div>
        </div>
      </div>
    </>
  );
}

export default Vault;
