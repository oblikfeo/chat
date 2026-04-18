import Modal from "@/components/modals/Modal";
import { useModalContext } from "@/contexts/modal-context";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { router } from "@inertiajs/react";
import { BiSearch, BiX } from "react-icons/bi";
import { BsArrowLeft, BsChatDots } from "react-icons/bs";
import clsx from "clsx";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  is_online: boolean;
};

export default function NewPrivateChat() {
  const { closeModal, openModal } = useModalContext();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    window.axios
      .get(`${route("users.index")}?query=${debouncedQuery}`)
      .then((response: { data: { data: User[] } }) => {
        setUsers(response.data.data);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  const startChat = (user: User) => {
    closeModal();
    router.get(route("chats.show", user.id));
  };

  const goBack = () => {
    openModal({ view: "NEW_CHAT_SELECTOR", size: "lg" });
  };

  return (
    <Modal>
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <BsArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold">Новый чат</h2>
      </div>

      <Modal.Body>
        <div className="space-y-4">
          <div
            className={clsx(
              "relative flex items-center overflow-hidden rounded-xl transition-all duration-200",
              "bg-secondary/50 dark:bg-secondary/30",
            )}
          >
            <span className="pointer-events-none absolute left-3">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <BiSearch className="h-5 w-5 text-secondary-foreground" />
              )}
            </span>

            <input
              type="text"
              placeholder="Введите имя или email..."
              className="w-full border-0 bg-transparent py-3 pl-10 pr-10 text-sm placeholder-secondary-foreground focus:outline-none focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-foreground/20 text-secondary-foreground transition-colors hover:bg-secondary-foreground/30"
              >
                <BiX className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
            {users.length > 0 ? (
              <div className="space-y-1">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => startChat(user)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:bg-secondary/60 active:bg-secondary/80"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={clsx(
                          "h-11 w-11 rounded-full object-cover ring-2",
                          user.is_online ? "ring-success/30" : "ring-secondary",
                        )}
                      />
                      {user.is_online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h5 className="truncate font-semibold">{user.name}</h5>
                      <p className="truncate text-sm text-secondary-foreground">
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length > 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                  <BsChatDots className="h-7 w-7 text-secondary-foreground" />
                </div>
                <p className="mt-3 font-medium">Пользователь не найден</p>
                <p className="mt-1 text-sm text-secondary-foreground">
                  Попробуйте другой запрос
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BiSearch className="h-7 w-7 text-primary" />
                </div>
                <p className="mt-3 font-medium">Найдите пользователя</p>
                <p className="mt-1 text-sm text-secondary-foreground">
                  Введите имя или email для поиска
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
