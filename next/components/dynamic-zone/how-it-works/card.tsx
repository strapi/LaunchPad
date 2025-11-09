import React from 'react';

export const Card = ({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl border border-border/50 bg-surface/80 p-6 shadow-card backdrop-blur-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
        Step {index}
      </span>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-text-subtle">{description}</p>
    </article>
  );
};
