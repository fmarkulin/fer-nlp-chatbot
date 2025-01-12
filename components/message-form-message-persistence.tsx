"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";

const schema = z.object({
  message: z.string().min(1),
});

interface MessageFormProps {
  invoke: (message: string) => Promise<string[]>;
  setAnswers: Dispatch<SetStateAction<string[] | undefined>>;
  setInput: Dispatch<SetStateAction<string | undefined>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const MessageFormMessagePersistence = ({
  invoke,
  setAnswers,
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
    setAnswers(undefined);
    setInput(data.message);
    setLoading(true);
    try {
      const invokePromise = invoke(data.message);
      // toast.promise(invokePromise, {
      //   loading: "Računam...",
      //   success: "Uspješno!",
      //   error: "Greška!",
      // });
      const response = await invokePromise;
      console.log("response", response);
      setLoading(false);
      setAnswers(response);
      form.reset();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setAnswers(["Greška pri dohvaćanju odgovora"]);
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

export default MessageFormMessagePersistence;
