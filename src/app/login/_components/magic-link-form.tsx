"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type MagicLinkSchema,
  magicLinkSchema,
} from "@/lib/validators/magic-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { sendMagicLinkAction } from "../_actions/send-magic-link";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function MagicLinkForm() {
  const { execute, result, status } = useAction(sendMagicLinkAction);

  const form = useForm<MagicLinkSchema>({
    resolver: zodResolver(magicLinkSchema),
  });

  const handleSubmit = (data: MagicLinkSchema) => execute(data);

  useEffect(() => {
    if (status === "hasSucceeded") {
      redirect("/login/magic-link-sent");
    }
    if (status === "hasErrored") {
      toast.error("Failed to send magic link", {
        description:
          result.serverError || "Something went wrong, please try again later",
      });
    }
  }, [status]);

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Continue with Email
        </Button>
      </form>
    </Form>
  );
}
