"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import Markdown from "react-markdown";
import MessageFormRag from "./message-form-rag";

interface ChatbotProps {
  invoke: (
    message: string,
    threadId: string,
  ) => AsyncGenerator<string, void, unknown>;
}

const ChatbotRag = ({ invoke }: ChatbotProps) => {
  const [answers, setAnswers] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [newAnswer, setNewAnswer] = useState<string>();

  return (
    <div className="w-full flex flex-col gap-4 justify-between flex-grow">
      <h1 className="text-center">
        <span className="font-bold">Izvor: </span>
        <a
          href="https://www.fer.unizg.hr/novosti/istrazivanja?@=30mua#news_96801"
          className="hover:underline"
        >
          Docent Marko Horvat: Koliko energije troši AI?
        </a>
      </h1>
      <div className="w-full p-8 flex flex-col gap-4 justify-between flex-grow">
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
        <MessageFormRag
          invoke={invoke}
          setAnswers={setAnswers}
          setLoading={setLoading}
          setNewAnswer={setNewAnswer}
        />
      </div>
    </div>
  );
};

export default ChatbotRag;
