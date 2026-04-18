import BadgeOnline from "@/components/chats/BadgeOnline";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { Link } from "@inertiajs/react";
import clsx from "clsx";
import moment from "moment";
import { BsThreeDots, BsXLg, BsArrowLeft, BsPhone, BsSearch } from "react-icons/bs";

type ChatHeaderProps = {
  onDrop: boolean;
  closeOnPreview: () => void;
};

export default function ChatHeader({
  onDrop,
  closeOnPreview,
}: ChatHeaderProps) {
  const { user, toggleSidebarRight, showSidebarRight, isTyping } =
    useChatMessageContext();

  const getStatusText = () => {
    if (isTyping) return "печатает...";
    if (user.is_online) return "в сети";
    if (moment(user.last_seen).isAfter("2000-01-01")) {
      const lastSeen = moment(user.last_seen);
      const now = moment();
      
      if (now.diff(lastSeen, "minutes") < 1) return "был(а) только что";
      if (now.diff(lastSeen, "minutes") < 60) {
        const mins = now.diff(lastSeen, "minutes");
        return `был(а) ${mins} мин. назад`;
      }
      if (now.diff(lastSeen, "hours") < 24) {
        return `был(а) сегодня в ${lastSeen.format("HH:mm")}`;
      }
      if (now.diff(lastSeen, "days") < 2) {
        return `был(а) вчера в ${lastSeen.format("HH:mm")}`;
      }
      return `был(а) ${lastSeen.format("DD.MM.YY")}`;
    }
    return "был(а) давно";
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-secondary/50 bg-background/80 px-3 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-3">
        <Link
          href={route("chats.index")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-secondary-foreground transition-all hover:bg-secondary hover:text-foreground sm:hidden"
        >
          <BsArrowLeft className="h-5 w-5" />
        </Link>

        <button
          onClick={toggleSidebarRight}
          className="flex flex-1 items-center gap-3 rounded-xl p-1 transition-all hover:bg-secondary/50"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className={clsx(
                "h-11 w-11 rounded-full object-cover ring-2 transition-all",
                user.is_online ? "ring-success/50" : "ring-secondary",
              )}
            />
            {user.is_online && <BadgeOnline className="!right-0 !h-3.5 !w-3.5" />}
          </div>

          <div className="flex-1 text-left">
            <h5 className="font-semibold">{user.name}</h5>
            {user.chat_type === CHAT_TYPE.CHATS && (
              <span
                className={clsx(
                  "text-xs transition-colors",
                  isTyping ? "text-primary" : "text-secondary-foreground",
                  user.is_online && !isTyping && "text-success",
                )}
              >
                {getStatusText()}
              </span>
            )}
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1">
        {onDrop ? (
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-secondary-foreground transition-all hover:bg-secondary hover:text-foreground"
            onClick={closeOnPreview}
          >
            <BsXLg className="h-5 w-5" />
          </button>
        ) : (
          <button
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all",
              showSidebarRight
                ? "bg-primary text-white"
                : "text-secondary-foreground hover:bg-secondary hover:text-foreground",
            )}
            onClick={toggleSidebarRight}
          >
            <BsThreeDots className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
