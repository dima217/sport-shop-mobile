import { useProductUpdates } from "@/hooks/data/useProductUpdates";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useProductUpdates(accessToken || "", undefined, undefined, !!accessToken);

  return <>{children}</>;
}
