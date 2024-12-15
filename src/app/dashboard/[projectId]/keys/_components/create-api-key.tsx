"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ApiKeyForm from "./api-key-form";
import { useState } from "react";
import { AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateAPIKey() {
  const [apiKey, setApiKey] = useState<string>("");

  const [open, setOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  const handleClose = () => {
    setOpen(false);
    setApiKey("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create API Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Create a new access key for your project.
          </DialogDescription>
        </DialogHeader>
        {apiKey ? (
          <>
            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <code className="text-sm font-mono break-all">{apiKey}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="relative"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="size-4" />
              <AlertTitle>Be careful!</AlertTitle>
              <AlertDescription>
                This key is only viewable once and cannot be recovered. If you
                lose this key, you will have to create a new one and update your
                project code files.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <ApiKeyForm onApiKeyCreated={setApiKey} />
        )}
      </DialogContent>
    </Dialog>
  );
}
