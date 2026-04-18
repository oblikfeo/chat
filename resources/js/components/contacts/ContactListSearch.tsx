import { fetchContacts } from "@/api/contacts";
import { useContactContext } from "@/contexts/contact-context";
import { useDebounce } from "@/hooks/use-debounce";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import { BiSearch, BiX } from "react-icons/bi";

type ContactListSearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function ContactListSearch({
  search,
  setSearch,
}: ContactListSearchProps) {
  const { setContacts, setPaginate } = useContactContext();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsFirstLoading(false);

    if (!isFirstLoading) {
      setIsSearching(true);
      fetchContacts(debouncedSearch)
        .then((response) => {
          setContacts(response.data.data.data);
          setPaginate(response.data.data);
        })
        .finally(() => setIsSearching(false));
    }
  }, [debouncedSearch]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative px-2 py-1">
      <div
        className={clsx(
          "relative flex items-center overflow-hidden rounded-xl transition-all duration-200",
          "bg-secondary/50 dark:bg-secondary/30",
          isFocused && "ring-2 ring-primary/30",
        )}
      >
        <span className="pointer-events-none absolute left-3">
          {isSearching ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <BiSearch
              className={clsx(
                "h-5 w-5 transition-colors duration-200",
                isFocused ? "text-primary" : "text-secondary-foreground",
              )}
            />
          )}
        </span>

        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск контактов..."
          className={clsx(
            "w-full border-0 bg-transparent py-2.5 pl-10 pr-10 text-sm placeholder-secondary-foreground",
            "focus:outline-none focus:ring-0",
          )}
          value={search}
          onChange={handleOnChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {search.length > 0 && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-foreground/20 text-secondary-foreground transition-colors hover:bg-secondary-foreground/30"
          >
            <BiX className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
