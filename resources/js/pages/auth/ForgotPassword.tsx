import GuestLayout from "@/layouts/GuestLayout";
import InputError from "@/components/InputError";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import FormAlert from "@/components/FormAlert";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.email"));
  };

  return (
    <GuestLayout>
      <Head title="Восстановление пароля" />

      <div className="mb-4 text-sm text-foreground">
        Забыли пароль? Не проблема. Укажите свой адрес электронной почты,
        и мы отправим вам ссылку для сброса пароля.
      </div>

      {status && <FormAlert message={status} />}

      <form onSubmit={submit}>
        <TextInput
          id="email"
          type="email"
          name="email"
          value={data.email}
          className="mt-1 block w-full"
          isFocused={true}
          onChange={(e) => setData("email", e.target.value)}
        />

        <InputError message={errors.email} className="mt-2" />

        <div className="mt-4 flex">
          <PrimaryButton className="w-full" disabled={processing}>
            Отправить ссылку для сброса
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
