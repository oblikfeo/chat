import { useEffect, FormEventHandler, useState } from "react";
import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { LoginSchema, RegisterUserSchema } from "@/types/user";
import ApplicationLogo from "@/components/ApplicationLogo";

export default function Welcome({
  canResetPassword,
  appName,
}: {
  canResetPassword: boolean;
  appName: string;
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const loginForm = useForm<LoginSchema>({
    email: "",
    password: "",
    remember: false,
  });

  const registerForm = useForm<RegisterUserSchema>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    return () => {
      loginForm.reset("password");
      registerForm.reset("password", "password_confirmation");
    };
  }, []);

  const submitLogin: FormEventHandler = (e) => {
    e.preventDefault();
    loginForm.post(route("login"));
  };

  const submitRegister: FormEventHandler = (e) => {
    e.preventDefault();
    registerForm.post(route("register"));
  };

  return (
    <>
      <Head title={appName} />
      <div className="flex min-h-[100dvh] min-h-[-webkit-fill-available] flex-col items-center justify-center bg-secondary px-4 py-8 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[max(2rem,env(safe-area-inset-top,0px))] pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <ApplicationLogo className="h-16 w-16" />
          </div>

          <div className="overflow-hidden rounded-lg bg-background shadow-lg">
            {/* Tabs */}
            <div className="flex border-b border-secondary">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "login"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-secondary-foreground hover:text-foreground"
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "register"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-secondary-foreground hover:text-foreground"
                }`}
              >
                Регистрация
              </button>
            </div>

            <div className="p-6">
              {activeTab === "login" ? (
                <form onSubmit={submitLogin} className="space-y-4">
                  <div>
                    <InputLabel htmlFor="login-email" value="Электронная почта" />
                    <TextInput
                      id="login-email"
                      type="email"
                      name="email"
                      value={loginForm.data.email}
                      className="mt-1 block w-full"
                      autoComplete="username"
                      isFocused={true}
                      onChange={(e) => loginForm.setData("email", e.target.value)}
                    />
                    <InputError message={loginForm.errors.email} className="mt-2" />
                  </div>

                  <div>
                    <InputLabel htmlFor="login-password" value="Пароль" />
                    <TextInput
                      id="login-password"
                      type="password"
                      name="password"
                      value={loginForm.data.password}
                      className="mt-1 block w-full"
                      autoComplete="current-password"
                      onChange={(e) => loginForm.setData("password", e.target.value)}
                    />
                    <InputError message={loginForm.errors.password} className="mt-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <Checkbox
                        name="remember"
                        checked={loginForm.data.remember}
                        onChange={(e) => loginForm.setData("remember", e.target.checked)}
                      />
                      <span className="ms-2 text-sm text-foreground">
                        Запомнить меня
                      </span>
                    </label>

                    {canResetPassword && (
                      <Link href={route("password.request")} className="btn-link">
                        Забыли пароль?
                      </Link>
                    )}
                  </div>

                  <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={loginForm.processing}>
                      Войти
                    </PrimaryButton>
                  </div>
                </form>
              ) : (
                <form onSubmit={submitRegister} className="space-y-4">
                  <div>
                    <InputLabel htmlFor="register-name" value="Имя" />
                    <TextInput
                      id="register-name"
                      name="name"
                      value={registerForm.data.name}
                      className="mt-1 block w-full"
                      autoComplete="name"
                      isFocused={true}
                      onChange={(e) => registerForm.setData("name", e.target.value)}
                    />
                    <InputError message={registerForm.errors.name} className="mt-2" />
                  </div>

                  <div>
                    <InputLabel htmlFor="register-email" value="Электронная почта" />
                    <TextInput
                      id="register-email"
                      type="email"
                      name="email"
                      value={registerForm.data.email}
                      className="mt-1 block w-full"
                      autoComplete="username"
                      onChange={(e) => registerForm.setData("email", e.target.value)}
                    />
                    <InputError message={registerForm.errors.email} className="mt-2" />
                  </div>

                  <div>
                    <InputLabel htmlFor="register-password" value="Пароль" />
                    <TextInput
                      id="register-password"
                      type="password"
                      name="password"
                      value={registerForm.data.password}
                      className="mt-1 block w-full"
                      autoComplete="new-password"
                      onChange={(e) => registerForm.setData("password", e.target.value)}
                    />
                    <InputError message={registerForm.errors.password} className="mt-2" />
                  </div>

                  <div className="pt-2">
                    <PrimaryButton className="w-full" disabled={registerForm.processing}>
                      Зарегистрироваться
                    </PrimaryButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
