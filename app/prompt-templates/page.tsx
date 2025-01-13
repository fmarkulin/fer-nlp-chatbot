import { ChatMistralAI } from "@langchain/mistralai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import ChatbotPromptTemplates from "@/components/chatbot-prompt-templates";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Pričaj mi samo na Hrvatskom jeziku. Svaki odgovor završi s kratkim vicom.",
  ],
  ["placeholder", "{messages}"],
]);

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  return { messages: [response] };
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
  return (
    <div className="p-8 flex flex-col items-center justify-center mx-auto max-w-7xl">
      <ChatbotPromptTemplates invoke={invokeFn} />
    </div>
  );
}
