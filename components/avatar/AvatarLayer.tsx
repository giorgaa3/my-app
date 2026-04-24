import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AvatarLayerProps = {
  children: ReactNode;
  className?: string;
};

export function AvatarLayer({ children, className }: AvatarLayerProps) {
  return (
    <div className={cn("avatar-layer absolute inset-0", className)}>
      {children}
    </div>
  );
}
