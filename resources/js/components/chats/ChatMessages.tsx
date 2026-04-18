import moment from "moment";
import { Fragment } from "react";
import DeleteMessage from "@/components/chats/DeleteMessage";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { useAppContext } from "@/contexts/app-context";
import { isImageLinkValid } from "@/utils";
import ChatMessageAttachment from "@/components/chats/ChatMessageAttachment";
import clsx from "clsx";

export default function ChatMessages() {
  const { auth } = useAppContext();
  const { messages, paginate, user } = useChatMessageContext();

  const sortedAndFilteredMessages = messages
    .sort((a, b) => a.sort_id - b.sort_id)
    .filter((message, index) => {
      if (message.chat_type === CHAT_TYPE.GROUP_CHATS && index === 0) {
        return false;
      }
      return true;
    })
    .filter((message) => message.body || message.attachments?.length > 0);

  const formatDateLabel = (date: moment.Moment) => {
    if (date.isSame(moment(), "day")) return "Сегодня";
    if (date.isSame(moment().subtract(1, "day"), "day")) return "Вчера";
    return date.format("D MMMM YYYY");
  };

  return (
    <div className="relative flex flex-1 flex-col gap-1 overflow-x-hidden">
      {sortedAndFilteredMessages.map((message, index) => {
        const isFirstMessage = index === 0;
        const date = moment(message.created_at);
        const prevDate = sortedAndFilteredMessages[index - 1]?.created_at;
        const isDifferentDate = !date.isSame(prevDate, "date");

        const messageWithImages = message.attachments.filter((attachment) =>
          isImageLinkValid(attachment.original_name),
        );
        const messageWithFiles = message.attachments.filter(
          (attachment) => !isImageLinkValid(attachment.original_name),
        );

        const isMyMessage =
          message.from_id === auth.id ||
          (message.chat_type !== CHAT_TYPE.GROUP_CHATS &&
            message.from_id !== user.id);

        const showProfile =
          message.chat_type === CHAT_TYPE.GROUP_CHATS &&
          !isMyMessage &&
          (index === 0 ||
            sortedAndFilteredMessages[index - 1]?.from_id !== message.from_id);

        const prevMessage = sortedAndFilteredMessages[index - 1];
        const nextMessage = sortedAndFilteredMessages[index + 1];

        const isFirstInGroup =
          !prevMessage ||
          prevMessage.from_id !== message.from_id ||
          isDifferentDate;
        const isLastInGroup =
          !nextMessage ||
          nextMessage.from_id !== message.from_id ||
          !moment(nextMessage.created_at).isSame(date, "date");

        return (
          <Fragment key={`message-${message.id}`}>
            {(isFirstMessage || isDifferentDate) && (
              <div className="flex justify-center py-3">
                <span className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground backdrop-blur-sm">
                  {formatDateLabel(date)}
                </span>
              </div>
            )}

            {!isMyMessage ? (
              <div
                className={clsx(
                  "flex justify-start",
                  isFirstInGroup && "mt-2",
                  !isLastInGroup && "mb-0.5",
                )}
              >
                <div className="max-w-[85%] text-sm text-foreground lg:max-w-[70%]">
                  {showProfile && (
                    <div className="mb-1 ml-1 flex items-center gap-2">
                      <img
                        src={message.from.avatar}
                        alt={message.from.name}
                        className="h-5 w-5 rounded-full object-cover ring-1 ring-secondary"
                      />
                      <span className="text-xs font-semibold text-secondary-foreground">
                        {message.from.name}
                      </span>
                    </div>
                  )}

                  {message.body && (
                    <div className="group relative flex items-end gap-1">
                      <div
                        className={clsx(
                          "relative inline-block rounded-2xl bg-secondary px-3 py-2 shadow-sm",
                          isFirstInGroup && "rounded-tl-md",
                          isLastInGroup && "rounded-bl-md",
                        )}
                      >
                        <p
                          dangerouslySetInnerHTML={{ __html: message.body }}
                          className="whitespace-pre-wrap break-words"
                        />
                        <span className="ml-2 inline-block align-bottom text-[10px] leading-none text-secondary-foreground">
                          {date.format("HH:mm")}
                        </span>
                      </div>

                      <DeleteMessage message={message} />
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="h-1" />
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    dir="ltr"
                  />
                </div>
              </div>
            ) : (
              <div
                className={clsx(
                  "flex justify-end",
                  isFirstInGroup && "mt-2",
                  !isLastInGroup && "mb-0.5",
                )}
              >
                <div className="max-w-[85%] text-sm text-white lg:max-w-[70%]">
                  {message.body && (
                    <div className="group relative flex flex-row-reverse items-end gap-1">
                      <div
                        className={clsx(
                          "relative inline-block rounded-2xl px-3 py-2 shadow-sm",
                          isFirstInGroup && "rounded-tr-md",
                          isLastInGroup && "rounded-br-md",
                          !user.message_color && "bg-primary",
                        )}
                        style={{
                          background: user.message_color || undefined,
                        }}
                      >
                        <p
                          dangerouslySetInnerHTML={{ __html: message.body }}
                          className="whitespace-pre-wrap break-words"
                        />
                        <span className="ml-2 inline-block align-bottom text-[10px] leading-none text-white/70">
                          {date.format("HH:mm")}
                        </span>
                      </div>

                      <DeleteMessage message={message} />
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="h-1" />
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    dir="rtl"
                    className="order-2 justify-end"
                    gridClassName="ml-auto"
                    deleteMessageClassName="order-1 flex-row-reverse"
                  />
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
