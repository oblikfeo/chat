import clsx from "clsx";
import {
  BsAppIndicator,
  BsBan,
  BsBoxArrowRight,
  BsCamera,
  BsChevronDown,
  BsChevronRight,
  BsCircleHalf,
  BsKey,
  BsPerson,
} from "react-icons/bs";
import Dropdown from "@/components/Dropdown";
import { useAppContext } from "@/contexts/app-context";
import { Switch } from "@headlessui/react";
import { updateUser } from "@/api/users";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { useScreenSize } from "@/hooks/use-screen-size";
import { UpdateProfileSchema } from "@/types/user";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import PrimaryButton from "@/components/PrimaryButton";
import { Transition } from "@headlessui/react";
import UpdatePasswordForm from "@/pages/profile/partials/UpdatePasswordForm";
import DeleteUserForm from "@/pages/profile/partials/DeleteUserForm";

export default function Content() {
  const { theme, setTheme, auth, setAuth } = useAppContext();
  const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'password' | 'delete'>('main');
  const { width } = useScreenSize();
  const avatarRef = useRef<HTMLImageElement>(null);

  const { data, setData, post, errors, processing, recentlySuccessful } =
    useForm<UpdateProfileSchema>({
      _method: "PATCH",
      name: auth.name,
      email: auth.email,
      avatar: null,
    });

  useEffect(() => {
    if (width > 640) {
      router.get(route("chats.index"));
    }
  }, [width]);

  const toggleActiveStatus = (status: boolean) => {
    updateUser(auth, { active_status: status }).then(() => {
      setAuth({ ...auth, active_status: status });
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

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("profile.update"));
  };

  if (activeSection === 'profile') {
    return (
      <div className="order-1 flex flex-1 shrink-0 flex-col gap-4 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            onClick={() => setActiveSection('main')}
            className="text-secondary-foreground hover:text-foreground"
          >
            <BsChevronRight className="rotate-180 text-xl" />
          </button>
          <h3 className="text-2xl font-semibold">Профиль</h3>
        </div>

        <div className="flex h-full max-h-[calc(100dvh_-_106px_-_env(safe-area-inset-bottom,0px)_-_env(safe-area-inset-top,0px))] flex-col gap-4 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <form onSubmit={submitProfile} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={auth.avatar}
                  alt={auth.name}
                  className="h-24 w-24 rounded-full border-2 border-secondary object-cover"
                  ref={avatarRef}
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark"
                  tabIndex={0}
                >
                  <BsCamera />
                  <input
                    type="file"
                    onChange={changeAvatar}
                    id="avatar"
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Имя
                </label>
                <TextInput
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="w-full"
                  required
                />
                <InputError message={errors.name} className="mt-1" />
              </div>

              <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing} className="flex-1">
                  Сохранить
                </PrimaryButton>
                <Transition
                  show={recentlySuccessful}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0"
                  leave="transition ease-in-out"
                  leaveTo="opacity-0"
                >
                  <p className="text-sm text-success">Сохранено</p>
                </Transition>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeSection === 'password') {
    return (
      <div className="order-1 flex flex-1 shrink-0 flex-col gap-4 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            onClick={() => setActiveSection('main')}
            className="text-secondary-foreground hover:text-foreground"
          >
            <BsChevronRight className="rotate-180 text-xl" />
          </button>
          <h3 className="text-2xl font-semibold">Изменить пароль</h3>
        </div>

        <div className="flex h-full max-h-[calc(100dvh_-_106px_-_env(safe-area-inset-bottom,0px)_-_env(safe-area-inset-top,0px))] flex-col gap-4 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <UpdatePasswordForm className="" />
        </div>
      </div>
    );
  }

  if (activeSection === 'delete') {
    return (
      <div className="order-1 flex flex-1 shrink-0 flex-col gap-4 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            onClick={() => setActiveSection('main')}
            className="text-secondary-foreground hover:text-foreground"
          >
            <BsChevronRight className="rotate-180 text-xl" />
          </button>
          <h3 className="text-2xl font-semibold">Удаление аккаунта</h3>
        </div>

        <div className="flex h-full max-h-[calc(100dvh_-_106px_-_env(safe-area-inset-bottom,0px)_-_env(safe-area-inset-top,0px))] flex-col gap-4 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <DeleteUserForm className="" />
        </div>
      </div>
    );
  }

  return (
    <div className="order-1 flex flex-1 shrink-0 flex-col gap-4 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]">
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="text-2xl font-semibold">Настройки</h3>
      </div>

      <div className="flex h-full max-h-[calc(100dvh_-_106px_-_env(safe-area-inset-bottom,0px)_-_env(safe-area-inset-top,0px))] flex-col gap-3 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        
        {/* Profile Card */}
        <button
          onClick={() => setActiveSection('profile')}
          className="group flex items-center gap-3 rounded-lg border border-secondary bg-background p-4 transition-all hover:border-primary/50 hover:bg-secondary"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BsPerson className="text-xl" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-foreground">Профиль</div>
            <div className="text-sm text-secondary-foreground">{auth.name}</div>
          </div>
          <BsChevronRight className="text-secondary-foreground group-hover:text-foreground" />
        </button>

        {/* Change Password Card */}
        <button
          onClick={() => setActiveSection('password')}
          className="group flex items-center gap-3 rounded-lg border border-secondary bg-background p-4 transition-all hover:border-primary/50 hover:bg-secondary"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BsKey className="text-xl" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-foreground">Изменить пароль</div>
            <div className="text-sm text-secondary-foreground">Обновите пароль</div>
          </div>
          <BsChevronRight className="text-secondary-foreground group-hover:text-foreground" />
        </button>

        {/* Logout Card */}
        <Link
          href={route("logout")}
          as="button"
          method="post"
          className="group flex items-center gap-3 rounded-lg border border-secondary bg-background p-4 transition-all hover:border-danger/50 hover:bg-danger/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-danger">
            <BsBoxArrowRight className="text-xl" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-foreground">Выйти</div>
            <div className="text-sm text-secondary-foreground">Выйти из аккаунта</div>
          </div>
          <BsChevronRight className="text-secondary-foreground group-hover:text-danger" />
        </Link>

        <div className="my-2 border-t border-secondary" />

        {/* Theme & Status - Secondary section */}
        <div className="space-y-3 rounded-lg bg-secondary/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-secondary-foreground">
              <BsCircleHalf />
              <span>Тема</span>
            </div>
            <Dropdown>
              <Dropdown.Trigger>
                <button className="rounded-md bg-background px-3 py-1.5 text-sm text-foreground hover:bg-secondary">
                  {theme === 'system' ? 'Системная' : theme === 'dark' ? 'Темная' : 'Светлая'}
                  <BsChevronDown className="ml-1 inline" />
                </button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Button onClick={() => setTheme("system")}>
                  Системная
                </Dropdown.Button>
                <Dropdown.Button onClick={() => setTheme("dark")}>
                  Темная
                </Dropdown.Button>
                <Dropdown.Button onClick={() => setTheme("light")}>
                  Светлая
                </Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-secondary-foreground">
              <BsAppIndicator />
              <span>Статус активности</span>
            </div>
            <Switch
              checked={auth.active_status}
              onChange={toggleActiveStatus}
              className={clsx(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                auth.active_status ? "bg-primary" : "bg-secondary",
              )}
            >
              <span className="sr-only">Включить статус активности</span>
              <span
                className={clsx(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  auth.active_status ? "translate-x-6" : "translate-x-1"
                )}
              />
            </Switch>
          </div>
        </div>

        {/* Delete Account - Danger zone */}
        <button
          onClick={() => setActiveSection('delete')}
          className="group mt-2 flex items-center gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 transition-all hover:border-danger hover:bg-danger/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/20 text-danger">
            <BsBan className="text-xl" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-danger">Удалить аккаунт</div>
            <div className="text-sm text-danger/70">Безвозвратное удаление</div>
          </div>
          <BsChevronRight className="text-danger" />
        </button>
      </div>
    </div>
  );
}
