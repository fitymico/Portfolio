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
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-50 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
      </span>
      <span className="font-mono uppercase tracking-[0.12em] text-[0.7rem] text-[var(--color-fg)]">
        {label}
      </span>
    </div>
  )
}
