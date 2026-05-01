export type SceneType =
  | 'ecommerce'
  | 'tg-bot'
  | 'parser'
  | 'ai-chat'
  | 'crm'
  | 'mini-app'

// Map of types that have a real video loop (from Higgsfield AI).
// Empty for now — all rendered as placeholder. Update as scenes are produced.
const SCENES_WITH_VIDEO: Partial<Record<SceneType, true>> = {}

type Props = {
  type: SceneType
  className?: string
}

export function AnimatedScene({ type, className }: Props) {
  const hasVideo = SCENES_WITH_VIDEO[type]

  return (
    <div
      className={`relative aspect-[4/3] w-full bg-[var(--color-surface)] border-b border-[var(--color-line)] overflow-hidden ${className ?? ''}`}
    >
      {hasVideo ? (
        <video
          src={`/scenes/${type}.mp4`}
          poster={`/scenes/${type}.webp`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <PlaceholderScene type={type} />
      )}
    </div>
  )
}

function PlaceholderScene({ type }: { type: SceneType }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)] mb-2">
          [ scene · pending ]
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
          {type}
        </div>
      </div>

      {/* corner ticks */}
      <span className="absolute top-3 left-3 h-3 w-3 border-l border-t border-[var(--color-line)]" />
      <span className="absolute top-3 right-3 h-3 w-3 border-r border-t border-[var(--color-line)]" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-l border-b border-[var(--color-line)]" />
      <span className="absolute bottom-3 right-3 h-3 w-3 border-r border-b border-[var(--color-line)]" />
    </div>
  )
}
