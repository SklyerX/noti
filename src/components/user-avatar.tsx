import type { User } from "@/db/schema";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

interface Props {
  user: Pick<User, "picture" | "name">;
}

export default function UserAvatar(props: Props) {
  return (
    <Avatar>
      {props.user.picture ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={props.user.picture}
            alt="profile picture"
            referrerPolicy="no-referrer"
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
