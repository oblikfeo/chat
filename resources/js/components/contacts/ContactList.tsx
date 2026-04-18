import { Link } from "@inertiajs/react";
import BadgeOnline from "@/components/chats/BadgeOnline";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { useContactContext } from "@/contexts/contact-context";
import { fetchContactsInPaginate } from "@/api/contacts";
import ContactListAction from "@/components/contacts/ContactListAction";

export default function ContactList() {
  const { contacts, setContacts, paginate, setPaginate } = useContactContext();
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && loadMoreRef.length > 0) {
      if (paginate.next_page_url) {
        fetchContactsInPaginate(paginate.next_page_url).then((response) => {
          setPaginate(response.data.data);
          setContacts([...contacts, ...response.data.data.data]);
        });
      }
    }
  }, [inView, paginate]);

  if (contacts.length === 0) return null;

  const onlineContacts = contacts.filter((c) => c.is_online);
  const offlineContacts = contacts.filter((c) => !c.is_online);

  return (
    <div className="relative max-h-[calc(100vh_-_200px)] flex-1 overflow-y-auto px-2 scrollbar-thin sm:max-h-[calc(100vh_-_130px)] sm:pb-2">
      {onlineContacts.length > 0 && (
        <div className="mb-2">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            В сети — {onlineContacts.length}
          </p>
          {onlineContacts
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((contact, index) => (
              <div
                className="group relative flex animate-fade-in items-center"
                key={contact.id}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Link
                  href={route("chats.show", contact.id)}
                  className={clsx(
                    "relative flex w-full min-w-0 flex-1 items-center gap-3 rounded-xl p-3 pr-11 text-left transition-all duration-200 touch-manipulation",
                    "active:bg-secondary/80",
                    "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary/60",
                    contact.is_contact_blocked && "opacity-40 grayscale",
                  )}
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-success/30"
                    />
                    <BadgeOnline />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="truncate font-semibold">{contact.name}</h5>
                    <span className="text-xs text-success">В сети</span>
                  </div>
                </Link>

                <ContactListAction contact={contact} />
              </div>
            ))}
        </div>
      )}

      {offlineContacts.length > 0 && (
        <div>
          {onlineContacts.length > 0 && (
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              Не в сети — {offlineContacts.length}
            </p>
          )}
          {offlineContacts
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((contact, index) => (
              <div
                className="group relative flex animate-fade-in items-center"
                key={contact.id}
                style={{ animationDelay: `${(onlineContacts.length + index) * 30}ms` }}
              >
                <Link
                  href={route("chats.show", contact.id)}
                  className={clsx(
                    "relative flex w-full min-w-0 flex-1 items-center gap-3 rounded-xl p-3 pr-11 text-left transition-all duration-200 touch-manipulation",
                    "active:bg-secondary/80",
                    "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-secondary/60",
                    contact.is_contact_blocked && "opacity-40 grayscale",
                  )}
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-secondary"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="truncate font-semibold">{contact.name}</h5>
                    <span className="text-xs text-secondary-foreground">
                      Не в сети
                    </span>
                  </div>
                </Link>

                <ContactListAction contact={contact} />
              </div>
            ))}
        </div>
      )}

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
    </div>
  );
}
