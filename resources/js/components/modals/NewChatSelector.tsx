import Modal from "@/components/modals/Modal";
import { useModalContext } from "@/contexts/modal-context";
import { BsChatDots, BsPeopleFill, BsChevronRight } from "react-icons/bs";
import clsx from "clsx";

export default function NewChatSelector() {
  const { closeModal, openModal } = useModalContext();

  const openNewPrivateChat = () => {
    openModal({ view: "NEW_PRIVATE_CHAT", size: "lg" });
  };

  const openNewGroup = () => {
    openModal({ view: "ADD_NEW_GROUP", size: "lg" });
  };

  return (
    <Modal>
      <Modal.Header title="Новый чат" onClose={closeModal} />

      <Modal.Body>
        <div className="space-y-2">
          <button
            onClick={openNewPrivateChat}
            className={clsx(
              "flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-200",
              "bg-secondary/30 hover:bg-secondary/60 active:scale-[0.98]",
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BsChatDots className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Личный чат</h4>
              <p className="text-sm text-secondary-foreground">
                Начать переписку с пользователем
              </p>
            </div>
            <BsChevronRight className="h-5 w-5 text-secondary-foreground" />
          </button>

          <button
            onClick={openNewGroup}
            className={clsx(
              "flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all duration-200",
              "bg-secondary/30 hover:bg-secondary/60 active:scale-[0.98]",
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <BsPeopleFill className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Групповой чат</h4>
              <p className="text-sm text-secondary-foreground">
                Создать группу из контактов
              </p>
            </div>
            <BsChevronRight className="h-5 w-5 text-secondary-foreground" />
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
