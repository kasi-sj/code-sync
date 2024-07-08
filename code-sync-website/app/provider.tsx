"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { useFileStore } from "@/store";

export default function Providers({ children }: any) {
  const router = useRouter();
  const setUserId = useFileStore((state: any) => state.setUserId);
  React.useEffect(() => {
    const load = async () => {
      setUserId(localStorage.getItem("userId"));
    };
    load();
  }, []);

  return <NextUIProvider>{children}</NextUIProvider>;
}
