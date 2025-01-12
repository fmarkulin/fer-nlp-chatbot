"use client";

import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { ChatMistralAICallOptions } from "@langchain/mistralai";
import MessageForm from "./message-form";
import { useState } from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface ChatbotProps {
  invoke: (
    input: BaseLanguageModelInput,
    options?: ChatMistralAICallOptions | undefined
  ) => Promise<string>;
}

const ChatbotNoMarkdown = ({ invoke }: ChatbotProps) => {
  const [answer, setAnswer] = useState<string>();
  const [input, setInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col gap-4">
      {input && (
        <Card className="p-4 bg-slate-200 max-w-5/6 self-end">{input}</Card>
      )}
      {loading && <Skeleton className="h-14 w-96 max-w-[50%]" />}
      {answer && (
        <Card className="p-4 bg-orange-500 text-white w-5/6 self-start">
          {answer}
        </Card>
      )}
      <MessageForm
        invoke={invoke}
        setAnswer={setAnswer}
        setInput={setInput}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ChatbotNoMarkdown;
