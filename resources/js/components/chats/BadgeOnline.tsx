import clsx from "clsx";

export default function BadgeOnline({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-background",
        className,
      )}
    />
  );
}
