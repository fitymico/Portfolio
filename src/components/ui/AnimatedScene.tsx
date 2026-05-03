export type SceneType =
  | 'ecommerce'
  | 'tg-bot'
  | 'parser'
  | 'ai-chat'
  | 'crm'
  | 'mini-app'

const SCENE_LABELS: Record<SceneType, string> = {
  ecommerce: 'Интернет-магазин косметики',
  'tg-bot': 'Telegram-бот · автоскупщик подарков',
  parser: 'Парсер маркетплейсов',
  'ai-chat': 'AI-чатбот для поддержки',
  crm: 'Desktop CRM для логистики',
  'mini-app': 'Mini App доставки еды',
}

type Props = {
  type: SceneType
  className?: string
}

export function AnimatedScene({ type, className }: Props) {
  return (
    <div
      className={`relative aspect-[4/3] w-full bg-[var(--color-surface)] border-b border-[var(--color-line)] overflow-hidden ${className ?? ''}`}
    >
      <img
        src={`/scenes/${type}.png`}
        alt={SCENE_LABELS[type]}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}
