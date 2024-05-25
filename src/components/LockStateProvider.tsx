import React, { createContext, useState, useContext } from "react";
import { useAutoLockSetting } from "@/lib/utils";
import { getUserId } from "@/lib/jwtUtils";
import { useIdleTimer } from "react-idle-timer";

interface LockStateContextProps {
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const LockStateContext = createContext<LockStateContextProps | undefined>(
  undefined
);

export const LockStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const autoLockSetting = useAutoLockSetting(getUserId() ?? "");

  const handleOnIdle = () => {
    setIsLocked(true);
  };

  useIdleTimer({
    timeout: 1000 * 20,
    onIdle: handleOnIdle,
  });

  return (
    <LockStateContext.Provider value={{ isLocked, setIsLocked }}>
      {children}
    </LockStateContext.Provider>
  );
};

export const useLockState = (): LockStateContextProps => {
  const context = useContext(LockStateContext);
  if (!context) {
    throw new Error("useLockState must be used within a LockStateProvider");
  }
  return context;
};
