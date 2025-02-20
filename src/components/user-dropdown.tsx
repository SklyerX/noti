import type { User } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import LogoutButton from "./logout-button";

interface Props {
  user: Pick<User, "name" | "email" | "picture">;
  pfpSize?: string;
}

export default function UserDropdown(props: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={props.user} pfpSize={props.pfpSize} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{props.user.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {props.user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard/account" className="flex items-center gap-2">
            <UserIcon className="size-4" />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
