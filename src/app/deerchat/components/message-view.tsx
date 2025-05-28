import { useCallback } from "react";

import { Card } from "~/components/ui/card";
import type { Option } from "~/core/api/types";
import { useStore } from "~/core/store";
import { cn } from "~/lib/utils";

interface MessageViewProps {
  messageId: string;
  onFeedback?: (feedback: { option: Option }) => void;
  onSendMessage?: (message: string) => void;
}

export function MessageView({
  messageId,
  onFeedback,
  onSendMessage,
}: MessageViewProps) {
  const message = useStore((state) => state.messages.get(messageId));

  const handleFeedback = useCallback(
    (feedback: { option: Option }) => {
      onFeedback?.(feedback);
    },
    [onFeedback],
  );

  if (!message) return null;

  return (
    <Card
      className={cn(
        "w-full",
        message.role === "user" ? "bg-primary text-primary-foreground" : "",
      )}
    >
      <div className="p-4">
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
      </div>
    </Card>
  );
} 