import type { User } from "@/db/schema";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user: Pick<User, "picture" | "name">;
  pfpSize?: string;
}

export default function UserAvatar(props: Props) {
  return (
    <Avatar className={cn(props.pfpSize)}>
      {props.user.picture ? (
        <div className="relative aspect-square h-full w-full overflow-hidden">
          <Image
            fill
            src={props.user.picture}
            alt="profile picture"
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{props.user.name}</span>
          <UserIcon className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
