import ApplicationLogo from "@/components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-[100dvh] min-h-[-webkit-fill-available] flex-col items-center justify-center bg-secondary pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[max(1.75rem,env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex w-11/12 max-w-md flex-col space-y-6 overflow-hidden rounded-lg bg-background p-6 shadow-md">
        <Link href="/" className="mx-auto w-20">
          <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
        </Link>

        {children}
      </div>
    </div>
  );
}
