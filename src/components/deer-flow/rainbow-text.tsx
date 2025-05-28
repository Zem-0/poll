import { cn } from "~/lib/utils";
import styles from "./rainbow-text.module.css";

interface RainbowTextProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export function RainbowText({
  children,
  className,
  animated = false,
}: RainbowTextProps) {
  return (
    <span
      className={cn(
        styles.rainbowText,
        animated && styles.animated,
        className,
      )}
    >
      {children}
    </span>
  );
} 