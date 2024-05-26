import { getUserSettings } from "@/api";
import { type ClassValue, clsx } from "clsx"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"
import axios from 'axios';
import cheerio from 'cheerio';

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

export async function getFavicon(url: string): Promise<string> {
  return `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
}