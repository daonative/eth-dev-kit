import { classNames } from "@/lib/utils";

export const PrimaryButton = ({
  children,
  className,
  disabled = false,
  type = "button",
  onClick = () => {},
}: any) => {
  const handleClick = () => {
    if (!disabled) onClick();
  };
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center rounded-md border border-transparent bg-blue-600 text-white",
        "px-3 py-2 text-sm font-medium leading-4 shadow-sm hover:opacity-90",
        "disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
};

export const OutlineButton = ({
  children,
  className,
  disabled = false,
  type = "button",
  onClick = () => {},
}: any) => {
  const handleClick = () => {
    if (!disabled) onClick();
  };
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tokensops-primary-600 focus:ring-offset-2",
        "disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
};
