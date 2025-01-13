import { ChatMistralAI } from "@langchain/mistralai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { trimMessages } from "@langchain/core/messages";
import ChatbotManageHistory from "@/components/chatbot-manage-history";

const trimmer = trimMessages({
  maxTokens: 6,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

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
  const trimmed = await trimmer.invoke(state.messages);
  const prompt = await promptTemplate.invoke({
    ...state,
    messages: trimmed,
  });
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
  return <ChatbotManageHistory invoke={invokeFn} />;
}
