import Modal from "@/components/modals/Modal";
import { useModalContext } from "@/contexts/modal-context";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { BiSearch, BiX } from "react-icons/bi";
import { BsPersonPlus, BsCheck, BsPersonPlusFill } from "react-icons/bs";
import clsx from "clsx";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  is_online: boolean;
  is_contact_saved: boolean;
};

export default function AddContact() {
  const { closeModal } = useModalContext();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
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
        const alreadySaved = new Set(
          response.data.data
            .filter((u) => u.is_contact_saved)
            .map((u) => u.id),
        );
        setSavedIds(alreadySaved);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  const saveContact = async (user: User) => {
    if (savingIds.has(user.id) || savedIds.has(user.id)) return;

    setSavingIds((prev) => new Set(prev).add(user.id));

    try {
      await window.axios.post(route("contacts.store"), {
        contact_id: user.id,
      });
      setSavedIds((prev) => new Set(prev).add(user.id));
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  };

  return (
    <Modal>
      <Modal.Header title="Добавить контакт" onClose={closeModal} />

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
                {users.map((user) => {
                  const isSaving = savingIds.has(user.id);
                  const isSaved = savedIds.has(user.id);

                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-secondary/40"
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={clsx(
                            "h-11 w-11 rounded-full object-cover ring-2",
                            user.is_online
                              ? "ring-success/30"
                              : "ring-secondary",
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

                      <button
                        onClick={() => saveContact(user)}
                        disabled={isSaving || isSaved}
                        className={clsx(
                          "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                          isSaved
                            ? "bg-success text-white"
                            : isSaving
                              ? "bg-secondary"
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-95",
                        )}
                      >
                        {isSaving ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : isSaved ? (
                          <BsCheck className="h-6 w-6" />
                        ) : (
                          <BsPersonPlus className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : query.length > 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
                  <BsPersonPlus className="h-7 w-7 text-secondary-foreground" />
                </div>
                <p className="mt-3 font-medium">Пользователь не найден</p>
                <p className="mt-1 text-sm text-secondary-foreground">
                  Попробуйте другой запрос
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BsPersonPlusFill className="h-7 w-7 text-primary" />
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
