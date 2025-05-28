// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";
import { FastForward, Play } from "lucide-react";
import { useCallback, useRef, useState, useMemo, useEffect } from "react";

import { RainbowText } from "~/components/deer-flow/rainbow-text";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { fastForwardReplay } from "~/core/api/chat";
import type { Option } from "~/core/api/types";
import { useReplayMetadata } from "~/core/api/hooks";
import { useReplay } from "~/core/replay";
import { sendMessage, useMessageIds, useStore } from "~/core/store";
import { env } from "~/env";
import { cn } from "~/lib/utils";

import { ConversationStarter } from "./conversation-starter";
import { InputBox } from "./input-box";
import { MessageListView } from "./message-list-view";
import { Welcome } from "./welcome";
import { Markdown } from "~/components/deer-flow/markdown";

export function MessagesBlock({ className }: { className?: string }) {
  const messageIds = useMessageIds();
  const latestMessageId = messageIds[messageIds.length - 1];
  const latestMessage = useStore((state) => state.messages.get(latestMessageId));
  const messageCount = messageIds.length;
  const responding = useStore((state) => state.responding);
  const ongoingResearchId = useStore((state) => state.ongoingResearchId);
  const { isReplay } = useReplay();
  const { title: replayTitle, hasError: replayHasError } = useReplayMetadata();
  const [replayStarted, setReplayStarted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [feedback, setFeedback] = useState<{ option: Option } | null>(null);

  const [showResearchPlan, setShowResearchPlan] = useState(false);

  // Effect to show the research plan when a new planner message arrives
  useEffect(() => {
    if (latestMessage?.agent === "planner" && !ongoingResearchId && !showResearchPlan) {
      setShowResearchPlan(true);
    }
  }, [latestMessage, ongoingResearchId, showResearchPlan]);

  const handleSend = useCallback(
    async (message: string, options?: { interruptFeedback?: string }) => {
      // Hide research plan if sending a new message that is not the 'accepted' signal
      if (showResearchPlan && options?.interruptFeedback !== "accepted") {
         setShowResearchPlan(false);
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      try {
        await sendMessage(
          message,
          {
            interruptFeedback:
              options?.interruptFeedback ?? feedback?.option.value,
          },
          {
            abortSignal: abortController.signal,
          },
        );
      } catch {}
    },
    [feedback, showResearchPlan],
  );

  const handleStartResearch = useCallback(() => {
    if (latestMessage?.agent === "planner") {
      // Assuming 'accepted' feedback triggers the research execution in the backend
      void handleSend(latestMessage.content, { interruptFeedback: "accepted" });
      setShowResearchPlan(false); // Hide the plan once research starts
    }
  }, [handleSend, latestMessage]);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);
  const handleFeedback = useCallback(
    (feedback: { option: Option }) => {
      setFeedback(feedback);
    },
    [setFeedback],
  );
  const handleRemoveFeedback = useCallback(() => {
    setFeedback(null);
  }, [setFeedback]);
  const handleStartReplay = useCallback(() => {
    setReplayStarted(true);
    void sendMessage();
  }, [setReplayStarted]);
  const [fastForwarding, setFastForwarding] = useState(false);
  const handleFastForwardReplay = useCallback(() => {
    setFastForwarding(!fastForwarding);
    void fastForwardReplay(!fastForwarding);
  }, [fastForwarding]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <MessageListView
        className="flex flex-grow"
        onFeedback={handleFeedback}
        onSendMessage={handleSend}
      />
      {!isReplay ? (
        showResearchPlan ? (
          <div className="relative flex flex-col items-center justify-center h-42 shrink-0 pb-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Research Plan</CardTitle>
                <CardDescription>
                  <Markdown>{latestMessage?.content ?? ''}</Markdown>
                </CardDescription>
              </CardHeader>
              <div className="flex justify-end gap-2 p-4">
                <Button variant="outline" onClick={() => { /* TODO: Implement Edit Plan */ }}>Edit plan</Button>
                <Button onClick={handleStartResearch}>Start research</Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="relative flex h-42 shrink-0 pb-4">
            {!responding && messageCount === 0 && (
              <ConversationStarter
                className="absolute top-[-218px] left-0"
                onSend={handleSend}
              />
            )}
            <InputBox
              className="h-full w-full"
              responding={responding}
              feedback={feedback}
              onSend={handleSend}
              onCancel={handleCancel}
              onRemoveFeedback={handleRemoveFeedback}
            />
          </div>
        )
      ) : (
        <>
          <div
            className={cn(
              "fixed bottom-[calc(50vh+80px)] left-0 transition-all duration-500 ease-out",
              replayStarted && "pointer-events-none scale-150 opacity-0",
            )}
          >
            <Welcome />
          </div>
          <motion.div
            className="mb-4 h-fit w-full items-center justify-center"
            initial={{ opacity: 0, y: "20vh" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={cn(
                "w-full transition-all duration-300",
                !replayStarted && "translate-y-[-40vh]",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <CardHeader>
                    <CardTitle>
                      <RainbowText animated={responding}>
                        {responding ? "Replaying" : `${replayTitle}`}
                      </RainbowText>
                    </CardTitle>
                    <CardDescription>
                      <RainbowText animated={responding}>
                        {responding
                          ? "DeerFlow is now replaying the conversation..."
                          : replayStarted
                            ? "The replay has been stopped."
                            : `You're now in DeerFlow's replay mode. Click the "Play" button on the right to start.`}
                      </RainbowText>
                    </CardDescription>
                  </CardHeader>
                </div>
                {!replayHasError && (
                  <div className="pr-4">
                    {responding && (
                      <Button
                        className={cn(fastForwarding && "animate-pulse")}
                        variant={fastForwarding ? "default" : "outline"}
                        onClick={handleFastForwardReplay}
                      >
                        <FastForward size={16} />
                        Fast Forward
                      </Button>
                    )}
                    {!replayStarted && (
                      <Button className="w-24" onClick={handleStartReplay}>
                        <Play size={16} />
                        Play
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
            {!replayStarted && env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && (
              <div className="text-muted-foreground w-full text-center text-xs">
                * This site is for demo purposes only. If you want to try your
                own question, please{" "}
                <a
                  className="underline"
                  href="https://github.com/bytedance/deer-flow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here
                </a>{" "}
                to clone it locally and run it.
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
