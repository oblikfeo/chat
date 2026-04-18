import clsx from "clsx";
import { Fragment, PropsWithChildren } from "react";
import { BsX } from "react-icons/bs";

const Modal = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4 p-5 text-foreground animate-fade-in",
        className,
      )}
    >
      {children}
    </div>
  );
};

const Header = ({ title, onClose }: { title: string; onClose: () => void }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{title}</h2>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-secondary hover:text-foreground"
        onClick={onClose}
      >
        <BsX className="h-6 w-6" />
      </button>
    </div>
  );
};

const Body = ({
  className,
  as: Component = "div",
  children,
}: PropsWithChildren<{ as?: React.ElementType; className?: string }>) => {
  return Component === Fragment ? (
    <Fragment>{children}</Fragment>
  ) : (
    <Component className={className}>{children}</Component>
  );
};

const Footer = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={clsx("flex justify-end gap-2 pt-2", className)}>
      {children}
    </div>
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
