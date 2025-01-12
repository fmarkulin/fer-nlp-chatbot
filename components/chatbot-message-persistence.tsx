"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import Markdown from "react-markdown";
import { Skeleton } from "./ui/skeleton";
import MessageFormMessagePersistence from "./message-form-message-persistence";

interface ChatbotProps {
  invoke: (message: string) => Promise<string[]>;
}

const ChatbotMessagePersistence = ({ invoke }: ChatbotProps) => {
  const [answers, setAnswers] = useState<string[]>();
  const [input, setInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col gap-4">
      {input && !answers && (
        <Card className="p-4 bg-slate-200 max-w-5/6 self-end">
          <Markdown>{input}</Markdown>
        </Card>
      )}
      {loading && <Skeleton className="h-14 w-96 max-w-[50%]" />}
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
      <MessageFormMessagePersistence
        invoke={invoke}
        setAnswers={setAnswers}
        setInput={setInput}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ChatbotMessagePersistence;
