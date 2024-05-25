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

const inter = Montserrat({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLocked, setIsLocked] = useState(false);
  const autoLockSetting = useAutoLockSetting(getUserId() ?? "");

  const handleOnIdle = () => {
    setIsLocked(true);
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  useIdleTimer({
    timeout: 1000 * 20,
    onIdle: handleOnIdle,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className={inter.className}>
          <ChakraProvider>
            {isLocked && autoLockSetting ? (
              <LockScreen vaultKey="yourVaultKey" onUnlock={handleUnlock} />
            ) : (
              <main>{children}</main>
            )}
          </ChakraProvider>
          <Toaster />
        </body>
      </html>
    </QueryClientProvider>
  );
}
