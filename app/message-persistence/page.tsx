import { ChatMistralAI } from "@langchain/mistralai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import ChatbotMessagePersistence from "@/components/chatbot-message-persistence";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const config = { configurable: { thread_id: uuidv4() } };

const invokeFn = async (message: string) => {
  "use server";
  const input = [
    {
      role: "user",
      content: message,
    },
  ];
  const output = await app.invoke({ messages: input }, config);
  console.log("output", output);
  const messages = output.messages.map((m) => m.content.toString());
  return messages;
};

export default function Home() {
  return (
    <div className="p-8 flex flex-col items-center justify-center mx-auto max-w-7xl">
      <ChatbotMessagePersistence invoke={invokeFn} />
    </div>
  );
}
