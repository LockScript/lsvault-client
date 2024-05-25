"use client";

import { getEmailFromToken, getUserId } from "@/lib/jwtUtils";
import { Checkbox, Tooltip, useClipboard } from "@chakra-ui/react";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { getUserSettings, uploadUserSettings } from "@/api";

const VaultSidebar = () => {
  const { hasCopied, onCopy } = useClipboard(getEmailFromToken() || "");
  const [autoLock, setAutoLock] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      const userId = getUserId() ?? "";
      if (userId) {
        const settings = await getUserSettings(userId);
        setAutoLock(settings.autoLock === "true");
      }
    };

    fetchUserSettings();
  }, []);

  function handleLogout(): void {
    sessionStorage.removeItem("vk");
    sessionStorage.removeItem("vault");
    window.location.reload();
  }
  return (
    <div
      className="flex h-[calc(100vh-20rem)] w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5 sticky top-0"
      role="navigation"
      aria-label="Vault Sidebar"
    >
      <div className="p-4 mb-2">
        <h5
          className="block font-extrabold text-2xl antialiased leading-snug tracking-normal text-blue-gray-900"
          role="heading"
          aria-level={1}
        >
          LockScript
        </h5>
      </div>
      <nav
        className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700"
        role="menu"
      >
        <div
          role="menuitem"
          className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <div className="grid mr-4 place-items-center">
            <LayoutDashboard />
          </div>
          Dashboard
        </div>
        <Dialog>
          <DialogTrigger>
            <div
              role="menuitem"
              className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            >
              <div className="grid mr-4 place-items-center">
                <Settings />
              </div>
              Settings
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w[425px]">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Make changes to your settomgs here. Click save when you&apos;re
              done editing them.
            </DialogDescription>
            <Checkbox
              isChecked={autoLock}
              onChange={(e) => setAutoLock(e.target.checked)}
            >
              Auto Lock
            </Checkbox>
            <Button
              onClick={() =>
                uploadUserSettings(getUserId() ?? "", {
                  autoLock: autoLock.toString(),
                })
              }
            >
              Save
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <div
              role="menuitem"
              className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            >
              <div className="grid mr-4 place-items-center">
                <User />
              </div>
              Account
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Account</DialogTitle>

              <DialogDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  placeholder={getEmailFromToken() || ""}
                  id="email"
                  defaultValue={getEmailFromToken() || ""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  defaultValue=""
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div
          role="menuitem"
          className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
          onClick={handleLogout}
        >
          <div className="grid mr-4 place-items-center">
            <LogOut />
          </div>
          Log Out
        </div>

        <Separator />
        <h1 className="text-center font-semibold">Categories</h1>
      </nav>

      <Tooltip label={hasCopied ? "Copied!" : "Click to copy"}>
        <div
          className="mt-auto text-center text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          onClick={onCopy}
          role="button"
          tabIndex={0}
        >
          {getEmailFromToken()}
        </div>
      </Tooltip>
    </div>
  );
};

export default VaultSidebar;
