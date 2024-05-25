import { getUserSettings } from "@/api";
import { type ClassValue, clsx } from "clsx"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useAutoLockSetting(userId: string) {
  const [autoLockSetting, setAutoLockSetting] = useState(false);

  useEffect(() => {
    async function fetchAutoLockSetting() {
      const settings = await getUserSettings(userId);
      setAutoLockSetting(settings.autoLock === 'true');
    }

    fetchAutoLockSetting();
  }, [userId]);

  return autoLockSetting;
}