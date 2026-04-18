import BadgeNotification from "@/components/chats/BadgeNotification";
import { useAppContext } from "@/contexts/app-context";
import { useModalContext } from "@/contexts/modal-context";
import { useScreenSize } from "@/hooks/use-screen-size";
import { Link, router } from "@inertiajs/react";
import clsx from "clsx";
import { useState } from "react";
import {
  BsBoxArrowRight,
  BsChatDots,
  BsGear,
  BsPersonCircle,
  BsPeopleFill,
  BsSearch,
} from "react-icons/bs";

export default function SidebarMini() {
  const { auth, notificationCount } = useAppContext();
  const { openModal } = useModalContext();
  const { width } = useScreenSize();
  const [showMenu, setShowMenu] = useState(false);

  const openPreferences = () => {
    openModal({ view: "PREFERENCES", size: "lg" });
    setShowMenu(false);
  };

  const handleLogout = () => {
    router.post(route("logout"));
  };

  const isDesktop = width > 640;

  if (isDesktop) {
    return (
      <div className="order-1 flex flex-col items-center justify-between bg-secondary/30 p-2 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-1">
          <Link
            href={route("chats.index")}
            className={clsx(
              "relative flex items-center justify-center rounded-xl p-3 transition-all duration-200",
              "hover:bg-primary/10 hover:text-primary",
              route().current("chats.*") && "bg-primary/15 text-primary",
            )}
          >
            <BsChatDots className="h-6 w-6" />
            {notificationCount > 0 && <BadgeNotification />}
          </Link>

          <Link
            href={route("contacts.index")}
            className={clsx(
              "flex items-center justify-center rounded-xl p-3 transition-all duration-200",
              "hover:bg-primary/10 hover:text-primary",
              route().current("contacts.*") && "bg-primary/15 text-primary",
            )}
          >
            <BsPeopleFill className="h-6 w-6" />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={openPreferences}
            className="flex items-center justify-center rounded-xl p-3 transition-all duration-200 hover:bg-secondary"
          >
            <BsGear className="h-5 w-5 text-secondary-foreground" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="relative overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-primary/50"
            >
              <img
                src={auth.avatar}
                alt={auth.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute bottom-14 left-0 z-50 min-w-48 animate-fade-in rounded-xl border border-secondary bg-background p-1 shadow-xl">
                  <Link
                    href={route("profile.edit")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                    onClick={() => setShowMenu(false)}
                  >
                    <BsPersonCircle className="h-5 w-5 text-secondary-foreground" />
                    <span>Профиль</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger transition-colors hover:bg-danger/10"
                  >
                    <BsBoxArrowRight className="h-5 w-5" />
                    <span>Выйти</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 z-30 order-2",
        "pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]",
        route().current("chats.show") && "hidden",
      )}
    >
      <div className="mx-4 mb-2">
        <div className="flex items-center justify-around rounded-2xl bg-background/80 px-2 py-1 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:bg-secondary/80 dark:ring-white/10">
          <Link
            href={route("chats.index")}
            className={clsx(
              "relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all duration-200",
              route().current("chats.*")
                ? "text-primary"
                : "text-secondary-foreground hover:text-foreground",
            )}
          >
            <div className="relative">
              <BsChatDots className="h-6 w-6" />
              {notificationCount > 0 && <BadgeNotification />}
            </div>
            <span className="text-xs font-medium">Чаты</span>
          </Link>

          <Link
            href={route("contacts.index")}
            className={clsx(
              "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all duration-200",
              route().current("contacts.*")
                ? "text-primary"
                : "text-secondary-foreground hover:text-foreground",
            )}
          >
            <BsPeopleFill className="h-6 w-6" />
            <span className="text-xs font-medium">Контакты</span>
          </Link>

          <button
            onClick={openPreferences}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-secondary-foreground transition-all duration-200 hover:text-foreground"
          >
            <BsGear className="h-6 w-6" />
            <span className="text-xs font-medium">Настройки</span>
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all duration-200"
          >
            <img
              src={auth.avatar}
              alt={auth.name}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-transparent"
            />
            <span className="text-xs font-medium text-secondary-foreground">
              Профиль
            </span>
          </button>
        </div>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute bottom-full left-4 right-4 z-50 mb-2 animate-slide-up rounded-2xl border border-secondary bg-background p-2 shadow-2xl">
              <div className="mb-2 flex items-center gap-3 border-b border-secondary px-3 pb-3 pt-1">
                <img
                  src={auth.avatar}
                  alt={auth.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="truncate font-semibold">{auth.name}</h4>
                  <p className="truncate text-sm text-secondary-foreground">
                    {auth.email}
                  </p>
                </div>
              </div>

              <Link
                href={route("profile.edit")}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-secondary"
                onClick={() => setShowMenu(false)}
              >
                <BsPersonCircle className="h-5 w-5 text-secondary-foreground" />
                <span>Редактировать профиль</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-danger transition-colors hover:bg-danger/10"
              >
                <BsBoxArrowRight className="h-5 w-5" />
                <span>Выйти из аккаунта</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
