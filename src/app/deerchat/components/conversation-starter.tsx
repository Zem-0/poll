import { cn } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";

interface ConversationStarterProps {
  className?: string;
  onSend: (message: string) => void;
}

const STARTERS = [
  "What's the latest news about AI?",
  "Tell me about quantum computing",
  "What are the best practices for React development?",
  "Explain the concept of blockchain",
];

export function ConversationStarter({
  className,
  onSend,
}: ConversationStarterProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {STARTERS.map((starter) => (
            <button
              key={starter}
              className="rounded-lg border p-3 text-left text-sm hover:bg-accent"
              onClick={() => onSend(starter)}
            >
              {starter}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 