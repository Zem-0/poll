import { Send, X } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "~/components/ui/button";
import type { Option } from "~/core/api/types";
import { cn } from "~/lib/utils";

interface InputBoxProps {
  className?: string;
  responding: boolean;
  feedback?: { option: Option } | null;
  onSend: (message: string, options?: { interruptFeedback?: string }) => void;
  onCancel: () => void;
  onRemoveFeedback: () => void;
}

export function InputBox({
  className,
  responding,
  feedback,
  onSend,
  onCancel,
  onRemoveFeedback,
}: InputBoxProps) {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  }, [message, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {feedback && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted p-2">
          <span className="text-sm">{feedback.option.text}</span>
          <Button
            className="ml-auto h-6 w-6 p-0"
            variant="ghost"
            onClick={onRemoveFeedback}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          className="flex-1 resize-none rounded-lg border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Type your message..."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={responding}
        />
        {responding ? (
          <Button
            className="self-end"
            variant="destructive"
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : (
          <Button
            className="self-end"
            disabled={!message.trim()}
            onClick={handleSend}
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        )}
      </div>
    </div>
  );
} 