"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import Markdown from "react-markdown";
import MessageFormStream from "./message-form-stream";

interface ChatbotProps {
  invoke: (
    message: string,
    threadId: string
  ) => AsyncGenerator<string, void, unknown>;
}

const ChatbotStream = ({ invoke }: ChatbotProps) => {
  const [answers, setAnswers] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [newAnswer, setNewAnswer] = useState<string>();

  return (
    <div className="w-full flex flex-col gap-4 justify-between h-full">
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
        {newAnswer && (
          <Card className="p-4 bg-orange-500 text-white self-start max-w-[90%]">
            <Markdown>{newAnswer}</Markdown>
          </Card>
        )}
      </div>
      <MessageFormStream
        invoke={invoke}
        setAnswers={setAnswers}
        setLoading={setLoading}
        setNewAnswer={setNewAnswer}
      />
    </div>
  );
};

export default ChatbotStream;
