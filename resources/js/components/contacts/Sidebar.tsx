import { useState } from "react";
import { BsPeopleFill, BsPersonPlus, BsPlus } from "react-icons/bs";
import clsx from "clsx";
import ContactListSearch from "@/components/contacts/ContactListSearch";
import ContactList from "@/components/contacts/ContactList";
import { useContactContext } from "@/contexts/contact-context";
import { useModalContext } from "@/contexts/modal-context";

export default function Sidebar() {
  const { contacts } = useContactContext();
  const { openModal } = useModalContext();
  const [search, setSearch] = useState("");

  const onlineCount = contacts.filter((contact) => contact.is_online).length;

  const openAddContact = () => {
    openModal({
      view: "ADD_CONTACT",
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
        <div>
          <h3 className="text-2xl font-bold">Контакты</h3>
          <p className="text-sm text-secondary-foreground">
            {onlineCount > 0 ? (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" />
                {onlineCount} в сети
              </span>
            ) : (
              "Нет активных"
            )}
          </p>
        </div>
        <button
          className={clsx(
            "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
            "bg-primary text-white shadow-md shadow-primary/25",
            "hover:shadow-lg hover:shadow-primary/30 active:scale-95",
          )}
          onClick={openAddContact}
          title="Добавить контакт"
        >
          <BsPlus className="h-6 w-6" />
        </button>
      </div>

      <ContactListSearch search={search} setSearch={setSearch} />

      <ContactList />

      {contacts.length === 0 && search.length > 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50">
            <BsPersonPlus className="h-7 w-7 text-secondary-foreground" />
          </div>
          <div>
            <p className="font-medium">Контакт не найден</p>
            <p className="mt-1 text-sm text-secondary-foreground">
              Попробуйте изменить запрос поиска
            </p>
          </div>
        </div>
      )}

      {contacts.length === 0 && search.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <BsPeopleFill className="h-9 w-9 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Нет контактов</h4>
            <p className="mt-1 text-sm text-secondary-foreground">
              Добавьте контакты, чтобы они появились здесь
            </p>
          </div>
          <button
            onClick={openAddContact}
            className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            <BsPersonPlus className="h-5 w-5" />
            Добавить контакт
          </button>
        </div>
      )}

      <div className="h-20 sm:hidden" />
    </div>
  );
}
