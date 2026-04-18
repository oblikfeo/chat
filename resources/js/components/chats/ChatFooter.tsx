import { saveMessage } from "@/api/chat-messages";
import { useAppContext } from "@/contexts/app-context";
import { useChatContext } from "@/contexts/chat-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import clsx from "clsx";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  BiSend,
  BiImage,
  BiPaperclip,
  BiMicrophone,
  BiX,
} from "react-icons/bi";
import { BsBan, BsEmojiSmile } from "react-icons/bs";
import { Preview } from "./Content";
import { unblockContact } from "@/api/contacts";
import { existingFiles, existingLinks, existingMedia } from "@/utils";
import { PresenceChannel } from "laravel-echo";

type ChatFooterProps = {
  scrollToBottom: () => void;
  attachments: Preview[];
  closeOnPreview: () => void;
  onSelectOrPreviewFiles: (files: FileList | null) => void;
};

export default function ChatFooter({
  scrollToBottom,
  attachments,
  closeOnPreview,
  onSelectOrPreviewFiles,
}: ChatFooterProps) {
  const { theme, auth } = useAppContext();
  const { chats, setChats, refetchChats } = useChatContext();
  const {
    user,
    setUser,
    messages,
    setMessages,
    reloadMedia,
    reloadFiles,
    reloadLinks,
  } = useChatMessageContext();

  const [message, setMessage] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(44);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const channel = window.Echo.private(
      `user-typing-${auth.id}-to-${user.id}`,
    ) as PresenceChannel;

    if (message.length > 0 && !isTyping) {
      channel.whisper(".typing", {
        from: auth,
        to: user,
        oldMessage: chats.find((c) => c.id === user.id),
      });

      setIsTyping(true);
    }
  }, [message]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        setIsTyping(false);
        setTimeout(scrollToBottom, 300);
      }, 10000);
    }
  }, [isTyping]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectOrPreviewFiles(e.target.files);
    setShowAttachMenu(false);
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const onPressBackspace = e.key === "Backspace";
    const onPressEnter = e.key === "Enter";

    if (onPressEnter && !e.shiftKey) {
      e.preventDefault();
      handleOnSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }

    if (onPressBackspace) {
      const target = e.target as HTMLTextAreaElement;
      const lines = target.value.split("\n");

      if (target.offsetHeight > 44) {
        if (lines[lines.length - 1] === "") {
          setTextareaHeight((prev) => prev - 22);
        }
      }
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      const { scrollHeight, clientHeight } = textareaRef.current;
      if (scrollHeight !== clientHeight) {
        setTextareaHeight(Math.min(scrollHeight + 2, 120));
      }
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((message.length === 0 && attachments.length === 0) || processing) {
      return;
    }

    setProcessing(true);
    setUploadProgress(0);

    try {
      const response = await saveMessage({ user, message, attachments });

      closeOnPreview();
      setMessage("");
      setTextareaHeight(44);
      setIsOpenEmoji(false);
      textareaRef.current?.focus();

      const data = response.data.data;

      setMessages([...messages, data]);
      refetchChats();

      existingMedia(data.attachments) && reloadMedia(user);
      existingFiles(data.attachments) && reloadFiles(user);
      existingLinks(data.links) && reloadLinks(user);

      setTimeout(scrollToBottom, 300);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setProcessing(false);
      setUploadProgress(0);
    }
  };

  const toggleEmoji = () => {
    setIsOpenEmoji(!isOpenEmoji);
    setShowAttachMenu(false);
  };

  const handleOnEmojiClick = (emoji: string) => {
    setMessage((prevMsg) => prevMsg + emoji);
    textareaRef.current?.focus();
  };

  const handleUnblockContact = () => {
    unblockContact(user.id).then(() => {
      setChats(
        chats.map((c) => {
          if (c.id === user.id) {
            c.is_contact_blocked = false;
          }
          return c;
        }),
      );
      setUser({ ...user, is_contact_blocked: false });
    });
  };

  const openImagePicker = () => {
    imageInputRef.current?.click();
    setShowAttachMenu(false);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
    setShowAttachMenu(false);
  };

  if (user.is_contact_blocked) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 border-t border-secondary bg-background/80 px-4 py-4 backdrop-blur-sm">
        <p className="text-center text-secondary-foreground">
          Невозможно отправить сообщение заблокированному контакту
        </p>
        <button
          className="flex items-center gap-2 rounded-full bg-success px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-95"
          onClick={handleUnblockContact}
        >
          <BsBan className="h-4 w-4" />
          Разблокировать
        </button>
      </div>
    );
  }

  const hasContent = message.trim().length > 0 || attachments.length > 0;

  return (
    <form
      className="relative flex items-end gap-2 border-t border-secondary/50 bg-background px-3 py-2"
      onSubmit={handleOnSubmit}
    >
      {showAttachMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAttachMenu(false)}
          />
          <div className="absolute bottom-full left-3 z-50 mb-2 animate-slide-up rounded-xl border border-secondary bg-background p-1.5 shadow-xl">
            <button
              type="button"
              onClick={openImagePicker}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BiImage className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Фото или видео</span>
            </button>
            <button
              type="button"
              onClick={openFilePicker}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success">
                <BiPaperclip className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Файл</span>
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setShowAttachMenu(!showAttachMenu);
          setIsOpenEmoji(false);
        }}
        className={clsx(
          "mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
          showAttachMenu
            ? "bg-primary text-white"
            : "text-secondary-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        {showAttachMenu ? (
          <BiX className="h-6 w-6" />
        ) : (
          <BiPaperclip className="h-6 w-6" />
        )}
      </button>

      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        multiple
        onChange={onSelectFile}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={onSelectFile}
      />

      <div className="relative flex flex-1 items-end">
        <button
          type="button"
          className={clsx(
            "absolute bottom-2.5 right-3 z-10 transition-colors duration-200",
            isOpenEmoji ? "text-primary" : "text-secondary-foreground hover:text-foreground",
          )}
          onClick={toggleEmoji}
        >
          <BsEmojiSmile className="h-5 w-5" />
        </button>

        {isOpenEmoji && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpenEmoji(false)}
            />
            <div className="absolute bottom-14 right-0 z-50 animate-slide-up overflow-hidden rounded-xl shadow-2xl">
              <EmojiPicker
                theme={(theme === "system" ? "auto" : theme) as Theme}
                skinTonesDisabled={true}
                height={350}
                width={320}
                searchPlaceHolder="Поиск эмодзи..."
                onEmojiClick={({ emoji }) => handleOnEmojiClick(emoji)}
              />
            </div>
          </>
        )}

        <textarea
          placeholder="Сообщение..."
          className={clsx(
            "max-h-[120px] w-full resize-none rounded-2xl border-0 bg-secondary/50 py-2.5 pl-4 pr-11 text-sm",
            "placeholder-secondary-foreground transition-all duration-200",
            "focus:bg-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/20",
          )}
          value={message}
          onKeyDown={handleOnKeyDown}
          onChange={handleOnChange}
          ref={textareaRef}
          style={{
            height: `${textareaHeight}px`,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={processing || !hasContent}
        className={clsx(
          "mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
          hasContent && !processing
            ? "bg-primary text-white shadow-md shadow-primary/25 hover:shadow-lg active:scale-95"
            : "text-secondary-foreground",
          processing && "animate-pulse-soft",
        )}
      >
        {processing ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <BiSend className="h-5 w-5" />
        )}
      </button>
    </form>
  );
}
