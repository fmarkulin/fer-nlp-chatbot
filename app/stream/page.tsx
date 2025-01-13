import { ChatMistralAI } from "@langchain/mistralai";
import {
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { trimMessages } from "@langchain/core/messages";
import ChatbotStream from "@/components/chatbot-stream";

const trimmer = trimMessages({
  maxTokens: 5,
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
  .addEdge("__start__", "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const invokeFn = async function* (message: string, threadId: string) {
  "use server";
  const input = [
    {
      role: "user",
      content: message,
    },
  ];
  const config = {
    streamMode: "messages",
    configurable: {
      thread_id: threadId,
    },
  };
  for await (const [message] of await app.stream(
    { messages: input },
    // @ts-expect-error "messages" is of type StreamMode
    config
  )) {
    yield message.content as string;
  }
};

export default function Home() {
  return <ChatbotStream invoke={invokeFn} />;
}
