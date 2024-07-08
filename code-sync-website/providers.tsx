"use client";
import * as React from "react";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import {NextUIProvider} from "@nextui-org/react";

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({children}: ProviderProps) {
  return (
          <ClerkProvider>
            {children}
      </ClerkProvider>
  );
}

export default Provider;