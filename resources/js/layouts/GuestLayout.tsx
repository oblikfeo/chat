import ApplicationLogo from "@/components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-[100dvh] min-h-[-webkit-fill-available] flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/30 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="w-11/12 max-w-md animate-fade-in">
        <div className="mb-6 flex flex-col items-center">
          <Link
            href="/"
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 transition-transform hover:scale-105"
          >
            <ApplicationLogo className="h-14 w-14" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Мессенджер</h1>
          <p className="mt-1 text-sm text-secondary-foreground">
            Быстрое и безопасное общение
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-secondary/50 bg-background/80 p-6 shadow-xl backdrop-blur-sm">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-secondary-foreground">
          © {new Date().getFullYear()} Мессенджер. Все права защищены.
        </p>
      </div>
    </div>
  );
}
