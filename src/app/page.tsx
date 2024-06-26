"use client"

import React, { useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import Vault from "@/components/Vault";

export interface VaultItem {
  website: string;
  username: string;
  password: string;
}

const Home = () => {
  const [step, setStep] = useState<"login" | "register" | "vault">("login");
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [vaultKey, setVaultKey] = useState("");

  useEffect(() => {
    // Retrieve stored vault data and vault key from sessionStorage on component mount
    const storedVault = window.sessionStorage.getItem("vault");
    const storedVaultKey = window.sessionStorage.getItem("vk");

    // Parse and set the vault data if it exists
    if (storedVault) {
      try {
        const parsedVault = JSON.parse(storedVault);
        setVault(parsedVault);
      } catch (error) {
        // Handle parsing errors
        console.error("Error parsing vault data:", error);
      }
    }

    console.log(storedVaultKey);

    // Set the vault key and switch to the 'vault' step if the vault key exists
    if (storedVaultKey) {
      setVaultKey(storedVaultKey);
      setStep("vault");
    }
  }, []);

  return (
    <main>
      {/* Render different components based on the current step */}
      {step === "register" && (
        <RegisterForm setStep={setStep} setVaultKey={setVaultKey} />
      )}
      {step === "login" && (
        <LoginForm
          setVault={setVault}
          setStep={setStep}
          setVaultKey={setVaultKey}
        />
      )}
      {step === "vault" && <Vault vault={vault} vaultKey={vaultKey} />}
    </main>
  );
};

export default Home;
