import { ChatMistralAI } from "@langchain/mistralai";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import ChatbotRag from "@/components/chatbot-rag";
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { pull } from "langchain/hub";
import { Document } from "@langchain/core/documents";

// define vector store
const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
});
const vectorStore = new MemoryVectorStore(embeddings);

// load and split document into chunks
const cheerioLoader = new CheerioWebBaseLoader(
  "https://www.fer.unizg.hr/novosti/istrazivanja?@=30mua#news_96801",
);
const docs = await cheerioLoader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const allSplits = await splitter.splitDocuments(docs);

// Index chunks
await vectorStore.addDocuments(allSplits);

// Define prompt for question-answering
const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

// Define state for application
const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

// Define application steps
const retrieve = async (state: typeof InputStateAnnotation.State) => {
  const retrievedDocs = await vectorStore.similaritySearch(state.question);
  return { context: retrievedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
  const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
  const messages = await promptTemplate.invoke({
    question: state.question,
    context: docsContent,
  });
  const response = await llm.invoke(messages);
  return { answer: response.content };
};

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

const workflow = new StateGraph(StateAnnotation)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge("__start__", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__");
const app = workflow.compile();

const invokeFn = async function* (message: string, threadId: string) {
  "use server";
  const input = { question: message };
  const config = {
    streamMode: "messages",
    configurable: {
      thread_id: threadId,
    },
  };
  for await (const [message] of await app.stream(
    input,
    // @ts-expect-error "messages" is of type StreamMode
    config,
  )) {
    yield message.content as string;
  }
};

export default function Home() {
  return <ChatbotRag invoke={invokeFn} />;
}
