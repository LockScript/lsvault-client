"use client";

import LockScreen from "@/components/LockScreen";
import { Toaster } from "@/components/ui/sonner";
import { getUserId } from "@/lib/jwtUtils";
import { useAutoLockSetting } from "@/lib/utils";
import { ChakraProvider } from "@chakra-ui/react";
import { Montserrat } from "next/font/google";
import { useState } from "react";
import { useIdleTimer } from 'react-idle-timer';
import { QueryClient, QueryClientProvider } from "react-query";
import "./globals.css";
import { LockStateProvider, useLockState } from "@/components/LockStateProvider";

const inter = Montserrat({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LockStateProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body className={inter.className}>
            <ChakraProvider>
              <LockScreenWrapper>{children}</LockScreenWrapper>
            </ChakraProvider>
            <Toaster />
          </body>
        </html>
      </QueryClientProvider>
    </LockStateProvider>
  );
}

function LockScreenWrapper({ children }: { children: React.ReactNode }) {
  const { isLocked, setIsLocked } = useLockState();
  const autoLockSetting = useAutoLockSetting(getUserId() ?? "");

  return isLocked && autoLockSetting ? (
    <LockScreen vaultKey="yourVaultKey" onUnlock={() => setIsLocked(false)} />
  ) : (
    <main>{children}</main>
  );
}