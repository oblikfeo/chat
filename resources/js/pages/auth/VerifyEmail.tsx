import GuestLayout from "@/layouts/GuestLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("verification.send"));
  };

  return (
    <GuestLayout>
      <Head title="Подтверждение почты" />

      <div className="mb-4 text-sm text-foreground">
        Спасибо за регистрацию! Прежде чем начать, подтвердите свой адрес
        электронной почты, перейдя по ссылке, которую мы вам отправили. Если вы
        не получили письмо, мы с радостью отправим вам новое.
      </div>

      {status === "verification-link-sent" && (
        <div className="mb-4 text-sm font-medium text-green-600">
          Новая ссылка для подтверждения отправлена на адрес электронной почты,
          который вы указали при регистрации.
        </div>
      )}

      <form onSubmit={submit}>
        <div className="mt-4 flex items-center justify-between">
          <PrimaryButton disabled={processing}>
            Отправить письмо повторно
          </PrimaryButton>

          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="rounded-md text-sm text-foreground underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Выйти
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
