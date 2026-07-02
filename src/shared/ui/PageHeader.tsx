import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-neutral-950">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
