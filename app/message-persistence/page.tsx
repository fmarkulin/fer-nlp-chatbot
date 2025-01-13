import { ChatMistralAI } from "@langchain/mistralai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
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

const invokeFn = async (message: string, threadId: string) => {
  "use server";
  const input = [
    {
      role: "user",
      content: message,
    },
  ];
  const config = { configurable: { thread_id: threadId } };
  const output = await app.invoke({ messages: input }, config);
  console.log("output", output);
  return output.messages[output.messages.length - 1].content.toString();
};

export default function Home() {
  return <ChatbotMessagePersistence invoke={invokeFn} />;
}
