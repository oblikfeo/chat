import { Fragment } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useModalContext } from "@/contexts/modal-context";
import {
  BsAppIndicator,
  BsCircleHalf,
  BsSun,
  BsMoon,
  BsDisplay,
  BsCheckLg,
} from "react-icons/bs";

import Modal from "@/components/modals/Modal";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { updateUser } from "@/api/users";

const themes = [
  { id: "system", label: "Система", icon: BsDisplay },
  { id: "light", label: "Светлая", icon: BsSun },
  { id: "dark", label: "Тёмная", icon: BsMoon },
];

export default function Preferences() {
  const { theme, auth, setTheme, setAuth } = useAppContext();
  const { closeModal } = useModalContext();

  const toggleActiveStatus = (status: boolean) => {
    updateUser(auth, { active_status: status }).then(() => {
      setAuth({ ...auth, active_status: status });
    });
  };

  return (
    <Modal>
      <Modal.Header title="Настройки" onClose={closeModal} />

      <Modal.Body className="flex" as={Fragment}>
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-secondary-foreground">
              <BsCircleHalf className="h-4 w-4" />
              Тема оформления
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className={clsx(
                    "flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200",
                    theme === id
                      ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                  {theme === id && (
                    <BsCheckLg className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-secondary" />

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <BsAppIndicator className="h-4 w-4 text-secondary-foreground" />
                Статус активности
              </div>
              <p className="mt-1 text-xs text-secondary-foreground">
                Показывать другим, когда вы онлайн
              </p>
            </div>

            <Switch
              checked={auth.active_status}
              onChange={toggleActiveStatus}
              className={clsx(
                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
                auth.active_status ? "bg-primary" : "bg-secondary",
              )}
            >
              <span className="sr-only">Включить статус активности</span>
              <span
                className={clsx(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200",
                  auth.active_status ? "translate-x-6" : "translate-x-1",
                )}
              />
            </Switch>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
