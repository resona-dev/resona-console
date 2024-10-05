"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { client } from "@/client";
import { Toaster } from "sonner";

client.setConfig({ baseUrl: "http://127.0.0.1:8000/" });
const baseQueryClient = new QueryClient();

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={baseQueryClient}>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
