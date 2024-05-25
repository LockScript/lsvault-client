"use client";

import { Montserrat } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ChakraProvider } from "@chakra-ui/react";

const inter = Montserrat({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className={inter.className}>
          <ChakraProvider>
            <main>{children}</main>
          </ChakraProvider>
          <Toaster />
        </body>
      </html>
    </QueryClientProvider>
  );
}
