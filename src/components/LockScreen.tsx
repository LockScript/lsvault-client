"use client";

import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "./ui/use-toast";
import { Lock } from "lucide-react";
import { validateUser } from "@/api";
import { getUserId } from "@/lib/jwtUtils";
import { hashPassword } from "@/crypto";

interface LockScreenProps {
  vaultKey: string;
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ vaultKey, onUnlock }) => {
  const [enteredKey, setEnteredKey] = useState("");

  const handleUnlock = async () => {
    const response = await validateUser(getUserId() ?? "", hashPassword(enteredKey));
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
