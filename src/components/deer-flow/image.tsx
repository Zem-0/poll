// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { cn } from "~/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  imageTransition?: boolean;
}

export default function Image({
  src,
  alt,
  className,
  imageClassName,
  imageTransition,
}: ImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover",
          imageTransition && "transition-transform duration-300",
          imageClassName,
        )}
      />
    </div>
  );
} 