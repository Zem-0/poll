import { cn } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  scrollShadowColor?: string;
  autoScrollToBottom?: boolean;
}

export function ScrollContainer({
  children,
  className,
  scrollShadowColor = "var(--background)",
  autoScrollToBottom = false,
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowTopShadow(scrollTop > 0);
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (autoScrollToBottom) {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [autoScrollToBottom, children]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        {children}
      </div>
      {showTopShadow && (
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-8 bg-gradient-to-b"
          style={{
            background: `linear-gradient(to bottom, ${scrollShadowColor} 0%, transparent 100%)`,
          }}
        />
      )}
      {showBottomShadow && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t"
          style={{
            background: `linear-gradient(to top, ${scrollShadowColor} 0%, transparent 100%)`,
          }}
        />
      )}
    </div>
  );
} 