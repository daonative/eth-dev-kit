import { classNames } from "@/lib/utils";

export default function Badge({
  className,
  children,
}: {
  className: string;
  children: any;
}) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium text-gray-800",
        className
      )}
    >
      {children}
    </span>
  );
}
