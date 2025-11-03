
'use client';

import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .loader {
          display: inline-block;
          border-radius: 50%;
          border-top: 3px solid hsl(var(--primary));
          border-right: 3px solid transparent;
          animation: spin 0.7s linear infinite;
        }
      `}</style>
      <div className={cn("loader h-6 w-6", className)} />
    </>
  );
}
