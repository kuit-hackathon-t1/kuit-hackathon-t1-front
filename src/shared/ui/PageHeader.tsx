import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({ title, left, right, description, action }: PageHeaderProps) {
  return (
    <header className="mb-5">
      <div className="relative flex min-h-12 items-center justify-between">
        <div className="flex min-w-10 items-center justify-start">{left}</div>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-center text-subtitle-20 whitespace-nowrap text-black-800">
          {title}
        </h1>

        <div className="flex min-w-10 items-center justify-end">{right ?? action}</div>
      </div>

      {description ? <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p> : null}
    </header>
  );
}
