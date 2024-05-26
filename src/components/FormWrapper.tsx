import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

/**
 * A wrapper component for forms with Chakra UI styling.
 * @param {Object} props - The properties for the FormWrapper component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by FormWrapper.
 * @param {BoxProps} props - Additional BoxProps from Chakra UI.
 * @returns {React.ReactNode} - The FormWrapper component with Chakra UI styling.
 */
function FormWrapper({
  children,
  ...props
}: { children: React.ReactNode } & BoxProps) {
  return (
    <Box
      boxShadow="lg"
      p={{ base: 4, md: 8 }}
      rounded="md"
      as="form"
      className="w-[1000px]"
      {...props}
    >
      {children}
    </Box>
  );
}

export default FormWrapper;
