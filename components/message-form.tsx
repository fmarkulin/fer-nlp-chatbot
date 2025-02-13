"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChatMistralAICallOptions } from "@langchain/mistralai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { Dispatch, SetStateAction } from "react";

const schema = z.object({
  message: z.string().min(1),
});

interface MessageFormProps {
  invoke: (
    input: BaseLanguageModelInput,
    options?: ChatMistralAICallOptions | undefined,
  ) => Promise<string>;
  setAnswer: Dispatch<SetStateAction<string | undefined>>;
  setInput: Dispatch<SetStateAction<string | undefined>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const MessageForm = ({
  invoke,
  setAnswer,
  setInput,
  setLoading,
}: MessageFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setAnswer(undefined);
    setInput(data.message);
    setLoading(true);
    form.reset();
    try {
      const invokePromise = invoke(data.message);
      const response = await invokePromise;
      console.log("response", response);
      setLoading(false);
      setAnswer(response);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setAnswer("Greška pri dohvaćanju odgovora");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Zašto je nebo plavo?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Pošalji</Button>
      </form>
    </Form>
  );
};

export default MessageForm;
