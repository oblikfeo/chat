import { useAppContext } from "@/contexts/app-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import moment from "moment";
import ChatMessages from "@/components/chats/ChatMessages";
import SaveOrBlockContact from "@/components/chats/SaveOrBlockContact";
import { useInView } from "react-intersection-observer";
import { BsArrowClockwise } from "react-icons/bs";
import { useEffect } from "react";
import { fetchMessagesInPaginate } from "@/api/chat-messages";
import clsx from "clsx";

type ChatBodyProps = {
  chatContainerRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
  onDrop: boolean;
};

export default function ChatBody({
  chatContainerRef,
  bottomRef,
  scrollToBottom,
  onDrop,
}: ChatBodyProps) {
  const { auth } = useAppContext();
  const { user, messages, setMessages, paginate, setPaginate, isTyping } =
    useChatMessageContext();

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    const inViewObserver = setTimeout(() => {
      if (inView && loadMoreRef.length > 0) {
        if (paginate.next_page_url) {
          fetchMessagesInPaginate(paginate.next_page_url).then((response) => {
            if (chatContainerRef.current) {
              const {
                scrollHeight: prevScrollHeight,
                scrollTop: prevScrollTop,
              } = chatContainerRef.current;

              setPaginate(response.data.data);
              setMessages([...messages, ...response.data.data.data]);

              setTimeout(() => {
                if (chatContainerRef.current) {
                  const { scrollHeight } = chatContainerRef.current;
                  const newScrollHeight = scrollHeight - prevScrollHeight;

                  chatContainerRef.current.scrollTop =
                    newScrollHeight + prevScrollTop;
                }
              }, 100);
            }
          });
        }
      }
    }, 500);

    return () => {
      clearTimeout(inViewObserver);
    };
  }, [inView, paginate]);

  const formatDate = (date: string) => {
    const d = moment(date);
    if (d.isSame(moment(), "day")) return "Сегодня";
    if (d.isSame(moment().subtract(1, "day"), "day")) return "Вчера";
    return d.format("D MMMM YYYY");
  };

  if (onDrop) return null;

  return (
    <div
      className={clsx(
        "relative flex-1 overflow-y-auto overflow-x-hidden px-3 py-4",
        "scrollbar-thin",
        "bg-gradient-to-b from-secondary/5 to-transparent",
      )}
      ref={chatContainerRef}
    >
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className={clsx(
              "h-20 w-20 rounded-full object-cover ring-4 transition-all",
              user.is_online ? "ring-success/30" : "ring-secondary",
            )}
          />
          {user.is_online && (
            <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-success" />
          )}
        </div>

        <h4 className="mt-3 text-lg font-bold">{user.name}</h4>

        {user.chat_type === CHAT_TYPE.GROUP_CHATS ? (
          <p className="mt-1 text-sm text-secondary-foreground">
            {auth.id === user.creator_id ? "Вы" : user.creator.name} создали
            группу "{user.name}"
            <br />
            <span className="text-xs">
              {moment(user.created_at).format("D MMMM YYYY")} в{" "}
              {moment(user.created_at).format("HH:mm")}
            </span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-secondary-foreground">
            Присоединился(ась)
            <br />
            <span className="text-xs">
              {moment(user.created_at).format("D MMMM YYYY")}
            </span>
          </p>
        )}
      </div>

      {paginate.next_page_url && (
        <div className="flex justify-center py-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50"
            ref={loadMoreRef}
          >
            <BsArrowClockwise className="h-5 w-5 animate-spin text-primary" />
          </button>
        </div>
      )}

      <ChatMessages />

      {user.chat_type === CHAT_TYPE.CHATS &&
        user.id !== auth.id &&
        isTyping && (
          <div className="my-2 flex justify-start">
            <div className="typing relative flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-secondary px-4 py-3 shadow-sm">
              <div className="animate-typing h-2.5 w-2.5 rounded-full bg-secondary-foreground/50" />
              <div className="animate-typing h-2.5 w-2.5 rounded-full bg-secondary-foreground/50" />
              <div className="animate-typing h-2.5 w-2.5 rounded-full bg-secondary-foreground/50" />
            </div>
          </div>
        )}

      <div ref={bottomRef} className="h-1" />

      <SaveOrBlockContact />
    </div>
  );
}
