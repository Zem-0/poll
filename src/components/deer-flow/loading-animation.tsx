// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { cn } from "~/lib/utils";
import styles from "./loading-animation.module.css";

export function LoadingAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className={styles.loading}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </div>
    </div>
  );
} 