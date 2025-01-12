import ChatbotMarkdown from "@/components/chatbot-markdown";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { ChatMistralAI } from "@langchain/mistralai";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

const invokeFn = async (input: BaseLanguageModelInput) => {
  "use server";
  const response = await llm.invoke(input);
  console.log(response);
  return response.content.toString();
};

export default function Home() {
  return (
    <div className="p-8 flex flex-col items-center justify-center mx-auto max-w-7xl">
      <ChatbotMarkdown invoke={invokeFn} />
    </div>
  );
}
