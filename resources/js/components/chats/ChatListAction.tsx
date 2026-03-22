import { Chat, CHAT_TYPE } from "@/types/chat";
import Dropdown, { useDropdownContext } from "@/components/Dropdown";
import { useRef } from "react";
import clsx from "clsx";
import {
  BsArchive,
  BsBan,
  BsBoxArrowRight,
  BsCheck2,
  BsThreeDots,
  BsXLg,
} from "react-icons/bs";
import { useAppContext } from "@/contexts/app-context";
import {
  archiveChat,
  markAsRead,
  markAsUnread,
  unarchiveChat,
} from "@/api/chats";
import { useChatContext } from "@/contexts/chat-context";
import { useModalContext } from "@/contexts/modal-context";
import { unblockContact } from "@/api/contacts";
import { useChatMessageContext } from "@/contexts/chat-message-context";

type ActionProps = {
  chat: Chat;
};

export default function ChatListAction({ chat }: ActionProps) {
  return (
    <div className="absolute right-8 shrink-0">
      <Dropdown>
        <Action chat={chat} />
      </Dropdown>
    </div>
  );
}

const Action = ({ chat }: ActionProps) => {
  const { auth, syncNotification } = useAppContext();
  const { chats, setChats, refetchChats } = useChatContext();
  const { user, setUser } = useChatMessageContext();
  const { openModal } = useModalContext();
  const { open } = useDropdownContext();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownPosition =
    (dropdownRef.current?.getBoundingClientRect().bottom || 0) <
    window.innerHeight - 100;

  const handleMarkAsRead = () => {
    markAsRead(chat).then(() => {
      setChats(
        chats.map((c) => {
          if (c.id === chat.id) {
            c.is_read = true;
          }

          return c;
        }),
      );

      syncNotification();
    });
  };

  const handleMarkAsUnread = () => {
    markAsUnread(chat).then(() => {
      setChats(
        chats.map((c) => {
          if (c.id === chat.id) {
            c.is_read = false;
          }

          return c;
        }),
      );

      syncNotification();
    });
  };

  const handleArchiveChat = () => {
    archiveChat(chat).then(() => {
      refetchChats();
      syncNotification();
    });
  };

  const handleUnarchiveChat = () => {
    unarchiveChat(chat).then(() => {
      refetchChats();
      syncNotification();
    });
  };

  const deleteChatConfirmation = () => {
    openModal({
      view: "DELETE_CHAT_CONFIRMATION",
      size: "lg",
      payload: chat,
    });
  };

  const blockContactConfirmation = () => {
    openModal({
      view: "BLOCK_CONTACT_CONFIRMATION",
      size: "lg",
      payload: chat,
    });
  };

  const handleUnblockContact = () => {
    unblockContact(chat.id).then(() => {
      setChats(
        chats.map((c) => {
          if (c.id === chat.id) {
            c.is_contact_blocked = false;
          }

          return c;
        }),
      );

      if (user?.id === chat.id) {
        setUser({ ...user, is_contact_blocked: false });
      }
    });
  };

  const exitGroupConfirmation = () => {
    openModal({
      view: "EXIT_GROUP_CONFIRMATION",
      size: "lg",
      payload: chat,
    });
  };

  return (
    <div ref={dropdownRef}>
      <Dropdown.Trigger>
        <button
          type="button"
          className={clsx(
            "inline-flex items-center justify-center rounded-full border border-secondary bg-background p-1.5 shadow-sm touch-manipulation",
            /* Тачскрин: всегда видна; мышь: только при hover строки */
            "sm:hidden sm:group-hover:inline-flex [@media(pointer:coarse)]:!inline-flex",
            open && "!inline-flex",
          )}
        >
          <BsThreeDots className="text-secondary-foreground" />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content
        align={dropdownPosition ? "right" : "top-right"}
        contentClasses={dropdownPosition ? "" : "mb-7"}
      >
        {auth.id !== chat.id && auth.id !== chat.from_id && (
          <Dropdown.Button
            onClick={chat.is_read ? handleMarkAsUnread : handleMarkAsRead}
          >
            <div className="flex items-center gap-2">
              <BsCheck2 className="-ml-1 text-lg" />
              Отметить как {chat.is_read ? "непрочитанное" : "прочитанное"}
            </div>
          </Dropdown.Button>
        )}

        {route().current("chats.*") ? (
          <Dropdown.Button onClick={handleArchiveChat}>
            <div className="flex items-center gap-2">
              <BsArchive />
              Архивировать чат
            </div>
          </Dropdown.Button>
        ) : (
          <Dropdown.Button onClick={handleUnarchiveChat}>
            <div className="flex items-center gap-2">
              <BsArchive />
              Разархивировать чат
            </div>
          </Dropdown.Button>
        )}

        <Dropdown.Button onClick={deleteChatConfirmation}>
          <div className="flex items-center gap-2">
            <BsXLg />
            Удалить чат
          </div>
        </Dropdown.Button>

        {auth.id !== chat.id && chat.chat_type === CHAT_TYPE.CHATS && (
          <>
            <hr className="my-2 border-secondary" />

            <Dropdown.Button
              onClick={
                chat.is_contact_blocked
                  ? handleUnblockContact
                  : blockContactConfirmation
              }
            >
              {chat.is_contact_blocked ? (
                <div className="flex items-center gap-2 text-success">
                  <BsBan />
                  Разблокировать контакт
                </div>
              ) : (
                <div className="flex items-center gap-2 text-danger">
                  <BsBan />
                  Заблокировать контакт
                </div>
              )}
            </Dropdown.Button>
          </>
        )}

        {auth.id !== chat.id && chat.chat_type === CHAT_TYPE.GROUP_CHATS && (
          <>
            <hr className="my-2 border-secondary" />
            <Dropdown.Button onClick={exitGroupConfirmation}>
              <div className="flex items-center gap-2 text-danger">
                <BsBoxArrowRight />
                Выйти из группы
              </div>
            </Dropdown.Button>
          </>
        )}
      </Dropdown.Content>
    </div>
  );
};
