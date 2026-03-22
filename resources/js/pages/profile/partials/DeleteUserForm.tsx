import { useRef, useState, FormEventHandler } from "react";
import DangerButton from "@/components/DangerButton";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import Modal from "@/components/Modal";
import SecondaryButton from "@/components/SecondaryButton";
import TextInput from "@/components/TextInput";
import { useForm } from "@inertiajs/react";

export default function DeleteUserForm({
  className = "",
}: {
  className?: string;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    password: "",
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-foreground">Удалить аккаунт</h2>

        <p className="mt-1 text-sm text-secondary-foreground">
          После удаления аккаунта все его ресурсы и данные будут безвозвратно
          удалены. Перед удалением сохраните любые данные или информацию,
          которые хотите сохранить.
        </p>
      </header>

      <DangerButton onClick={confirmUserDeletion}>Удалить аккаунт</DangerButton>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className="p-6">
          <h2 className="text-lg font-medium text-foreground">
            Вы уверены, что хотите удалить свой аккаунт?
          </h2>

          <p className="mt-1 text-sm text-secondary-foreground">
            После удаления аккаунта все его ресурсы и данные будут безвозвратно
            удалены. Введите пароль, чтобы подтвердить удаление.
          </p>

          <div className="mt-6">
            <InputLabel
              htmlFor="password"
              value="Пароль"
              className="sr-only"
            />

            <TextInput
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="mt-1 block w-full sm:w-3/4"
              isFocused
              placeholder="Пароль"
            />

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>Отмена</SecondaryButton>

            <DangerButton className="ms-3" disabled={processing}>
              Удалить аккаунт
            </DangerButton>
          </div>
        </form>
      </Modal>
    </section>
  );
}
