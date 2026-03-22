import { useEffect, FormEventHandler } from "react";
import GuestLayout from "@/layouts/GuestLayout";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { RegisterUserSchema } from "@/types/user";

export default function Register() {
  const { data, setData, post, processing, errors, reset } =
    useForm<RegisterUserSchema>({
      name: "",
      email: "",
      password: "",
    });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("register"));
  };

  return (
    <GuestLayout>
      <Head title="Регистрация" />

      <form onSubmit={submit} className="space-y-4">
        <div>
          <InputLabel htmlFor="name" value="Имя" />

          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
            onChange={(e) => setData("name", e.target.value)}
          />

          <InputError message={errors.name} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Электронная почта" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
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
            autoComplete="new-password"
            onChange={(e) => setData("password", e.target.value)}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="flex items-center">
          <PrimaryButton className="w-full" disabled={processing}>
            Зарегистрироваться
          </PrimaryButton>
        </div>

        <div className="flex justify-center">
          <Link href={route("login")} className="btn-link">
            Уже есть аккаунт?
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
