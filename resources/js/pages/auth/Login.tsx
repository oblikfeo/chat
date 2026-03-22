import { useEffect, FormEventHandler } from "react";
import Checkbox from "@/components/Checkbox";
import GuestLayout from "@/layouts/GuestLayout";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import FormAlert from "@/components/FormAlert";
import { LoginSchema } from "@/types/user";

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } =
    useForm<LoginSchema>({
      email: "",
      password: "",
      remember: false,
    });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"));
  };

  return (
    <GuestLayout>
      <Head title="Вход" />

      {status && <FormAlert message={status} />}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <InputLabel htmlFor="email" value="Электронная почта" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
            onChange={(e) => setData("email", e.target.value)}
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="Пароль" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={(e) => setData("password", e.target.value)}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={(e) => setData("remember", e.target.checked)}
            />
            <span className="ms-2 text-sm text-foreground">Запомнить меня</span>
          </label>

          {canResetPassword && (
            <Link href={route("password.request")} className="btn-link">
              Забыли пароль?
            </Link>
          )}
        </div>

        <div className="flex">
          <PrimaryButton className="w-full" disabled={processing}>
            Войти
          </PrimaryButton>
        </div>

        <div className="flex justify-center">
          <Link href={route("register")} className="btn-link">
            Нет аккаунта?
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
