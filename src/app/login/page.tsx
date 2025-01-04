import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import MagicLinkForm from "./_components/magic-link-form";

export default async function Page() {
  const user = await getCurrentUser();

  if (user) return redirect("/dashboard");

  const cookieStore = await cookies();
  const lastUsed = cookieStore.get("last_used")?.value;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-xl">
        <h3 className="text-2xl font-semibold">Hello!</h3>
        <p className="mt-2 text-muted-foreground">
          Welcome or welcome back to Noti! Login in to continue. If you don't
          have an account, one will be created for you with the information you
          provide.
        </p>
        <div className="my-4 space-y-3">
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "flex items-center gap-3 w-full relative",
            })}
            href="/login/google"
          >
            <Icons.Google />
            <span>Sign in with Google</span>
            {lastUsed === "google" ? (
              <div className="absolute right-2 top-2 text-muted-foreground">
                last used
              </div>
            ) : null}
          </Link>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "flex items-center gap-3 w-full relative",
            })}
            href="/login/github"
          >
            <Icons.GithubOutline />
            <span>Sign in with Github</span>
            {lastUsed === "github" ? (
              <div className="absolute right-2 top-2 text-muted-foreground">
                last used
              </div>
            ) : null}
          </Link>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <MagicLinkForm />
      </div>
    </div>
  );
}
