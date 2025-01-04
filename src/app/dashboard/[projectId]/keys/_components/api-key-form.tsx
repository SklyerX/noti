import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createApiKeySchema,
  type CreateApiKeySchema,
} from "@/lib/validators/create-api-key";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createApiKeyAction } from "../_actions/create-api-key";
import { toast } from "sonner";

interface Props {
  onApiKeyCreated: (apiKey: string) => void;
}

export default function ApiKeyForm(props: Props) {
  const { projectId } = useParams();

  const form = useForm<CreateApiKeySchema>({
    resolver: zodResolver(createApiKeySchema),
  });

  const { execute, result, status } = useAction(createApiKeyAction);

  const handleSubmit = (data: CreateApiKeySchema) =>
    execute({
      name: data.name,
      isLive: data.isLive,
      projectId: projectId as string,
    });

  useEffect(() => {
    if (status === "hasSucceeded" && result.data?.apiKey) {
      props.onApiKeyCreated(result.data.apiKey);
    }
    if (status === "hasErrored") {
      toast.error("Failed to create API Key");
    }
  }, [status]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="@music-saas" {...field} />
              </FormControl>
              <FormDescription>
                Give your API key a name that describes its purpose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="isLive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Activate API Key</FormLabel>
                <FormDescription>
                  Allow your API key to be used in production.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={status === "executing"}>
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
