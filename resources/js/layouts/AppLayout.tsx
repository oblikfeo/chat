import { AppProvider } from "@/contexts/app-context";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import clsx from "clsx";

export default function AppLayout({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const { notification_count } = usePage<PageProps>().props;

  return (
    <AppProvider>
      <Head
        title={clsx(notification_count > 0 && `(${notification_count})`, title)}
      />

      <div
        className={clsx(
          "box-border flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-background text-foreground sm:flex-row",
          /* iPhone PWA: чёлка + статус-бар; не меньше ~28px сверху */
          "pt-[max(1.75rem,env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]",
        )}
      >
        {children}
      </div>
    </AppProvider>
  );
}
