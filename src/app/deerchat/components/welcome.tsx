import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { RainbowText } from "~/components/deer-flow/rainbow-text";

export function Welcome() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <RainbowText>Welcome to DeerFlow</RainbowText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          DeerFlow is an AI-powered research assistant that helps you explore and
          understand complex topics. Start by asking a question or choosing one of
          the conversation starters below.
        </p>
      </CardContent>
    </Card>
  );
} 