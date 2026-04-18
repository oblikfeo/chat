import Modal from "@/components/modals/Modal";
import { useModalContext } from "@/contexts/modal-context";
import { Chat } from "@/types/chat";
import { GroupSchema } from "@/types/group";
import { router, useForm } from "@inertiajs/react";
import {
  ChangeEvent,
  FormEventHandler,
  Fragment,
  useRef,
} from "react";
import { BsCamera, BsArrowLeft } from "react-icons/bs";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import TextArea from "@/components/TextArea";
import ComboBox from "@/components/ComboBox";
import { ChatMessagePageProps } from "@/types";
import clsx from "clsx";

export default function AddNewGroup() {
  const { closeModal, openModal } = useModalContext<Chat>();

  const avatarRef = useRef<HTMLImageElement>(null);

  const { data, setData, post, errors, processing } = useForm<GroupSchema>({
    _method: "POST",
    name: "",
    description: "",
    avatar: null,
    group_members: [],
  });

  const handleOnSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (processing) return;

    post(route("group.store"), {
      onSuccess: (response) => {
        const props = response.props as unknown as ChatMessagePageProps;

        router.get(route("chats.show", props.user.id));
        closeModal();
      },
    });
  };

  const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setData("avatar", files[0]);

      const imageUrl = window.URL.createObjectURL(files[0]);
      avatarRef.current?.setAttribute("src", imageUrl);

      return () => {
        window.URL.revokeObjectURL(imageUrl);
      };
    }
  };

  const addMembers = (value: string[]) => {
    setData("group_members", value);
  };

  const goBack = () => {
    openModal({ view: "NEW_CHAT_SELECTOR", size: "lg" });
  };

  return (
    <form onSubmit={handleOnSubmit} className="space-y-4">
      <Modal>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <BsArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold">Новая группа</h2>
        </div>

        <Modal.Body as={Fragment}>
          <div className="relative flex justify-center">
            <div className="relative">
              <img
                src="/images/group-avatar.png"
                alt="Аватар группы"
                className="h-24 w-24 rounded-full border-2 border-secondary object-cover"
                ref={avatarRef}
              />

              <label
                htmlFor="avatar"
                className={clsx(
                  "absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full",
                  "bg-primary text-white shadow-md transition-all hover:bg-primary-dark",
                )}
                tabIndex={0}
              >
                <BsCamera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={changeAvatar}
                  id="avatar"
                  className="hidden"
                />
              </label>
            </div>

            <InputError className="mt-2 text-center" message={errors.avatar} />
          </div>

          <div className="space-y-1.5">
            <InputLabel htmlFor="name" value="Название группы" />

            <TextInput
              id="name"
              type="text"
              className="mt-1 block w-full"
              placeholder="Введите название..."
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />

            <InputError className="mt-2" message={errors.name} />
          </div>

          <div className="space-y-1.5">
            <InputLabel htmlFor="description" value="Описание (необязательно)" />

            <TextArea
              id="description"
              className="mt-1 block w-full"
              placeholder="О чём эта группа..."
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />

            <InputError className="mt-2" message={errors.description} />
          </div>

          <div className="relative space-y-1.5">
            <InputLabel htmlFor="group_members" value="Участники" />

            <ComboBox
              url={route("users.index")}
              onChange={addMembers}
              initialSelected={[]}
              refId="group_members"
            />

            <p className="text-xs text-secondary-foreground">
              Начните вводить имя для поиска участников
            </p>

            <InputError className="mt-2" message={errors.group_members} />
          </div>
        </Modal.Body>

        <Modal.Footer className="flex gap-3 pt-4">
          <button
            type="button"
            className="btn btn-secondary flex-1"
            onClick={closeModal}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={clsx(
              "btn btn-primary flex-1",
              processing && "opacity-50",
            )}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Создание...
              </span>
            ) : (
              "Создать группу"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}
