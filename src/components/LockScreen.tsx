"use client";

import { validateUser } from "@/api";
import { hashPassword } from "@/crypto";
import { getUserId } from "@/lib/jwtUtils";
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { Lock } from "lucide-react";
import React, { useState } from "react";

interface LockScreenProps {
  vaultKey: string;
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ vaultKey, onUnlock }) => {
  const [enteredKey, setEnteredKey] = useState("");

  const handleUnlock = async () => {
    const response = await validateUser(
      getUserId() ?? "",
      hashPassword(enteredKey)
    );
    if (response.status === 200) {
      onUnlock();
    }
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Box p={5} shadow="md" borderWidth="1px">
        <div className="flex justify-center mb-10">
          <Lock size={80} className="animate-shake" />
        </div>

        <Input
          type="password"
          placeholder="Your password"
          value={enteredKey}
          onChange={(e) => setEnteredKey(e.target.value)}
          mb={4}
        />

        <div className="flex justify-center">
          <Button colorScheme="teal" onClick={handleUnlock}>
            Unlock
          </Button>
        </div>
      </Box>
    </Flex>
  );
};

export default LockScreen;
