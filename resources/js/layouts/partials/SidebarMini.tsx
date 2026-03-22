import BadgeNotification from "@/components/chats/BadgeNotification";
import Dropdown from "@/components/Dropdown";
import { useAppContext } from "@/contexts/app-context";
import { useModalContext } from "@/contexts/modal-context";
import { useScreenSize } from "@/hooks/use-screen-size";
import { Link } from "@inertiajs/react";
import clsx from "clsx";
import {
  BsBoxArrowRight,
  BsChat,
  BsGear,
  BsPersonCircle,
} from "react-icons/bs";

export default function SidebarMini() {
  const { auth, notificationCount } = useAppContext();
  const { openModal } = useModalContext();
  const { width } = useScreenSize();

  const openPreferences = () => {
    openModal({ view: "PREFERENCES", size: "lg" });
  };

  return (
    <div
      className={clsx(
        "order-2 mt-auto flex-row justify-between bg-background pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] sm:order-1 sm:mt-0 sm:flex sm:flex-col sm:items-center sm:justify-center sm:p-2 sm:pb-2",
        route().current("chats.show") ? "hidden" : "flex",
      )}
    >
      <Link
        href={route("chats.index")}
        className={clsx(
          "relative flex flex-1 items-center justify-center rounded-lg p-3 transition-all hover:bg-secondary sm:flex-initial",
          route().current("chats.*") && "bg-secondary",
        )}
      >
        <BsChat className="h-6 w-6" />
        {notificationCount > 0 && <BadgeNotification />}
      </Link>

      {width <= 640 ? (
        <Link
          href={route("preferences.index")}
          className={clsx(
            "flex flex-1 items-center justify-center rounded-lg p-3 transition-all hover:bg-secondary sm:flex-initial",
            route().current("preferences.index") && "bg-secondary",
          )}
        >
          <BsGear className="h-6 w-6" />
        </Link>
      ) : (
        <div className="relative flex flex-1 cursor-pointer items-center justify-center rounded-lg px-3 transition-all hover:bg-secondary sm:mt-auto sm:flex-initial sm:px-0 sm:hover:bg-transparent">
          <Dropdown>
            <Dropdown.Trigger>
              <img
                src={auth.avatar}
                alt=""
                className="h-8 w-8 rounded-full border border-secondary sm:h-10 sm:w-10"
              />
            </Dropdown.Trigger>

            <Dropdown.Content align="top-left" contentClasses="mb-12 sm:mb-10">
              <Dropdown.Button onClick={openPreferences}>
                <div className="flex items-center gap-2">
                  <BsGear />
                  Настройки
                </div>
              </Dropdown.Button>
              <Dropdown.Link href={route("profile.edit")}>
                <div className="flex items-center gap-2">
                  <BsPersonCircle />
                  Профиль
                </div>
              </Dropdown.Link>
              <Dropdown.Link href={route("logout")} method="post" as="button">
                <div className="flex items-center gap-2">
                  <BsBoxArrowRight />
                  Выйти
                </div>
              </Dropdown.Link>
            </Dropdown.Content>
          </Dropdown>
        </div>
      )}
    </div>
  );
}
