import { useCallback } from "react";

import { ScrollContainer } from "~/components/deer-flow/scroll-container";
import type { Option } from "~/core/api/types";
import { useMessageIds, useStore } from "~/core/store";
import { cn } from "~/lib/utils";

import { MessageView } from "./message-view";

interface MessageListViewProps {
  className?: string;
  onFeedback?: (feedback: { option: Option }) => void;
  onSendMessage?: (message: string) => void;
}

export function MessageListView({
  className,
  onFeedback,
  onSendMessage,
}: MessageListViewProps) {
  const messageIds = useMessageIds();
  const responding = useStore((state) => state.responding);

  const handleFeedback = useCallback(
    (feedback: { option: Option }) => {
      onFeedback?.(feedback);
    },
    [onFeedback],
  );

  return (
    <ScrollContainer
      className={cn("h-full w-full", className)}
      scrollShadowColor="var(--background)"
      autoScrollToBottom={responding}
    >
      <div className="flex flex-col gap-4 p-4">
        {messageIds.map((id) => (
          <MessageView
            key={id}
            messageId={id}
            onFeedback={handleFeedback}
            onSendMessage={onSendMessage}
          />
        ))}
      </div>
    </ScrollContainer>
  );
} 