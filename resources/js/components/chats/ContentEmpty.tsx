import { BsChatDots } from "react-icons/bs";

export default function ContentEmpty() {
  return (
    <div className="order-3 hidden h-screen w-full flex-1 flex-col items-center justify-center gap-6 border-l border-secondary bg-gradient-to-br from-background to-secondary/20 sm:flex">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <BsChatDots className="h-12 w-12 text-primary" />
      </div>
      <div className="text-center">
        <h4 className="text-xl font-semibold">Выберите чат</h4>
        <p className="mt-2 text-secondary-foreground">
          Выберите диалог из списка слева, чтобы начать общение
        </p>
      </div>
    </div>
  );
}
