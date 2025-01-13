"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import Markdown from "react-markdown";
import MessageFormPromptTemplates from "./message-form-prompt-templates";

interface ChatbotProps {
  invoke: (message: string, threadId: string) => Promise<string>;
}

const ChatbotPromptTemplates = ({ invoke }: ChatbotProps) => {
  const [answers, setAnswers] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full min-h-screen p-8 flex flex-col gap-4 justify-between">
      <div className="flex flex-col gap-4">
        {answers &&
          answers.map((a, i) => (
            <Card
              key={i}
              className={`p-4 ${
                i % 2 === 0
                  ? "bg-slate-200 self-end"
                  : "bg-orange-500 text-white self-start"
              } max-w-[90%]`}
            >
              <Markdown>{a}</Markdown>
            </Card>
          ))}
        {loading && (
          <Card className="p-4 bg-orange-500 text-white self-start max-w-[90%]">
            <span className="animate-ping h-2 inline-flex w-2 rounded-full bg-white"></span>
          </Card>
        )}
      </div>
      <MessageFormPromptTemplates
        invoke={invoke}
        setAnswers={setAnswers}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ChatbotPromptTemplates;
