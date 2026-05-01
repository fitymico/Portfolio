type Props = {
  label: string
  className?: string
}

export function StatusBadge({ label, className }: Props) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 border border-[var(--color-line)] rounded-full ${className ?? ''}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-fg)] opacity-30 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-fg)]" />
      </span>
      <span className="font-mono uppercase tracking-[0.12em] text-[0.7rem] text-[var(--color-fg)]">
        {label}
      </span>
    </div>
  )
}
