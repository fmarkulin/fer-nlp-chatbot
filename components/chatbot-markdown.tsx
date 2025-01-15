"use client";

import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { ChatMistralAICallOptions } from "@langchain/mistralai";
import MessageForm from "./message-form";
import { useState } from "react";
import { Card } from "./ui/card";
import Markdown from "react-markdown";

interface ChatbotProps {
  invoke: (
    input: BaseLanguageModelInput,
    options?: ChatMistralAICallOptions | undefined
  ) => Promise<string>;
}

const ChatbotMarkdown = ({ invoke }: ChatbotProps) => {
  const [answer, setAnswer] = useState<string>();
  const [input, setInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full p-8 flex flex-col gap-4 justify-between flex-grow">
      <div className="flex flex-col gap-4">
        {input && (
          <Card className="p-4 bg-slate-200 max-w-5/6 self-end">
            <Markdown>{input}</Markdown>
          </Card>
        )}
        {loading && (
          <Card className="p-4 bg-orange-500 text-white self-start max-w-[90%]">
            <span className="animate-ping h-2 inline-flex w-2 rounded-full bg-white"></span>
          </Card>
        )}
        {answer && (
          <Card className="p-4 bg-orange-500 text-white w-5/6 self-start">
            <Markdown>{answer}</Markdown>
          </Card>
        )}
      </div>
      <MessageForm
        invoke={invoke}
        setAnswer={setAnswer}
        setInput={setInput}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ChatbotMarkdown;
