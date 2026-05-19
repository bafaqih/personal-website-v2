"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/src/lib/query-client";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Initialize QueryClient inside useState to prevent sharing it across different request/sessions
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
