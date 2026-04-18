import { useState } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import ChatListSearch from "@/components/chats/ChatListSearch";
import ChatList from "@/components/chats/ChatList";
import { useChatContext } from "@/contexts/chat-context";
import clsx from "clsx";
import { useModalContext } from "@/contexts/modal-context";

export default function Sidebar() {
  const { chats } = useChatContext();
  const { openModal } = useModalContext();

  const [search, setSearch] = useState("");

  const openNewChatSelector = () => {
    openModal({
      view: "NEW_CHAT_SELECTOR",
      size: "lg",
    });
  };

  return (
    <div
      className={clsx(
        "order-1 flex flex-1 flex-col gap-1 sm:order-2 sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]",
        route().current("chats.show") ? "hidden" : "flex",
      )}
    >
      <div className="flex items-center justify-between px-3 pt-3">
        <h3 className="text-2xl font-bold">Чаты</h3>
        <button
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
            "bg-primary text-white shadow-md shadow-primary/25",
            "hover:shadow-lg hover:shadow-primary/30 active:scale-95",
          )}
          onClick={openNewChatSelector}
          title="Новый чат"
        >
          <BsPlus className="h-6 w-6" />
        </button>
      </div>

      <ChatListSearch search={search} setSearch={setSearch} />

      <ChatList search={search} href="chats.show" />

      {chats.length === 0 && search.length > 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
            <FaUserPlus className="h-7 w-7 text-secondary-foreground" />
          </div>
          <div>
            <p className="font-medium">Пользователь не найден</p>
            <p className="mt-1 text-sm text-secondary-foreground">
              Попробуйте изменить запрос поиска
            </p>
          </div>
        </div>
      )}

      {chats.length === 0 && search.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <FaUsers className="h-9 w-9 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Нет чатов</h4>
            <p className="mt-1 text-sm text-secondary-foreground">
              Начните общение, нажав на кнопку выше
            </p>
          </div>
          <button
            onClick={openNewChatSelector}
            className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            <BsPlus className="h-5 w-5" />
            Начать чат
          </button>
        </div>
      )}

      <div className="h-20 sm:hidden" />
    </div>
  );
}
