export default function BadgeNotification() {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
    </span>
  );
}
