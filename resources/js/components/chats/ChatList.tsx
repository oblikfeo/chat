import { Chat } from "@/types/chat";
import { Link } from "@inertiajs/react";
import BadgeOnline from "@/components/chats/BadgeOnline";
import clsx from "clsx";
import { relativeTime } from "@/utils";
import { useChatContext } from "@/contexts/chat-context";
import BadgeChatNotification from "@/components/chats/BadgeChatNotification";
import { fetchChatsInPaginate, markAsRead } from "@/api/chats";
import ChatListAction from "@/components/chats/ChatListAction";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { useAppContext } from "@/contexts/app-context";

type ChatListProps = {
  search: string;
  href: string;
  className?: string;
};

export default function ChatList({ search, href, className }: ChatListProps) {
  const { syncNotification } = useAppContext();
  const { chats, setChats, paginate, setPaginate } = useChatContext();
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && loadMoreRef.length > 0) {
      if (paginate.next_page_url) {
        fetchChatsInPaginate(paginate.next_page_url).then((response) => {
          setPaginate(response.data.data);
          setChats([...chats, ...response.data.data.data]);
        });
      }
    }
  }, [inView, paginate]);

  const handleMarkAsRead = (chat: Chat) => {
    if (!chat.is_read) {
      markAsRead(chat).then(syncNotification);
    }
  };

  if (chats.length === 0) return null;

  return (
    <div
      className={clsx(
        "relative max-h-[calc(100vh_-_200px)] flex-1 overflow-y-auto px-2 sm:max-h-[calc(100vh_-_130px)] sm:pb-2",
        "scrollbar-thin",
        className,
      )}
    >
      {chats
        .sort((a, b) => {
          if (search.length === 0)
            return b.created_at?.localeCompare(a.created_at);

          return a.name.localeCompare(b.name);
        })
        .map((chat, index) => (
          <div
            className="group relative flex animate-fade-in items-center"
            key={chat.id}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <Link
              href={route(href, chat.id)}
              onClick={() => handleMarkAsRead(chat)}
              className={clsx(
                "relative flex w-full min-w-0 flex-1 items-center gap-3 rounded-xl p-3 pr-11 text-left transition-all duration-200 touch-manipulation",
                "active:bg-secondary/80",
                "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary/60",
                route().current(href, chat.id) &&
                  "bg-primary/10 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/15",
                chat.is_contact_blocked && "opacity-40 grayscale",
              )}
            >
              {search.length === 0 && chat.created_at ? (
                <>
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className={clsx(
                        "h-12 w-12 rounded-full object-cover ring-2 transition-all duration-200",
                        route().current(href, chat.id)
                          ? "ring-primary/30"
                          : "ring-secondary",
                      )}
                    />
                    {chat.is_online && <BadgeOnline />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="truncate font-semibold">{chat.name}</h5>
                      <span className="shrink-0 text-xs text-secondary-foreground">
                        {relativeTime(chat.created_at)}
                      </span>
                    </div>
                    <p
                      className={clsx(
                        "mt-0.5 truncate text-sm",
                        !chat.is_read
                          ? "font-medium text-foreground"
                          : "text-secondary-foreground",
                        route().current(href, chat.id) && "text-foreground/80",
                      )}
                      dangerouslySetInnerHTML={{ __html: chat.body }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-secondary"
                    />
                    {chat.is_online && <BadgeOnline />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="truncate font-semibold">{chat.name}</h5>
                    {chat.email && (
                      <p className="truncate text-sm text-secondary-foreground">
                        {chat.email}
                      </p>
                    )}
                  </div>
                </>
              )}
            </Link>

            {chat.body && <ChatListAction chat={chat} />}
            {!chat.is_read && <BadgeChatNotification />}
          </div>
        ))}

      {paginate.next_page_url && (
        <button
          className="mx-auto mt-4 flex items-center justify-center p-2"
          ref={loadMoreRef}
        >
          <BsArrowClockwise className="h-5 w-5 animate-spin text-primary" />
        </button>
      )}
    </div>
  );
}
