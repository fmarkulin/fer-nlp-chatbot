"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const schema = z.object({
  message: z.string().min(1),
});

interface MessageFormProps {
  invoke: (message: string, threadId: string) => Promise<string>;
  setAnswers: Dispatch<SetStateAction<string[] | undefined>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const MessageFormManageHistory = ({
  invoke,
  setAnswers,
  setLoading,
}: MessageFormProps) => {
  const [threadId, setThreadId] = useState<string>(uuidv4());

  const handleThreadIdReset = () => {
    setThreadId(uuidv4());
    setAnswers(undefined);
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setAnswers((prev) => {
      if (prev) {
        return [...prev, data.message];
      }
      return [data.message];
    });
    form.reset();
    setLoading(true);
    try {
      const invokePromise = invoke(data.message, threadId);
      const response = await invokePromise;
      console.log("response", response);
      setLoading(false);
      setAnswers((p) => {
        if (p) {
          return [...p, response];
        }
        return [response];
      });
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
        <div className="flex gap-2">
          <Button type="submit">Pošalji</Button>
          <Button
            type="button"
            onClick={handleThreadIdReset}
            variant={"destructive"}
          >
            Poništi razgovor
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageFormManageHistory;
