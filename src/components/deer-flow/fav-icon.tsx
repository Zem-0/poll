// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { cn } from "~/lib/utils";

interface FavIconProps {
  url: string;
  title?: string;
  className?: string;
}

export function FavIcon({ url, title, className }: FavIconProps) {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;
  return (
    <img
      src={faviconUrl}
      alt={title ?? "Favicon"}
      className={cn("h-4 w-4", className)}
    />
  );
} 