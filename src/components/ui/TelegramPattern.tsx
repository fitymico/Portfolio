import type { LucideIcon } from 'lucide-react'

type Props = {
    Icon: LucideIcon
    className?: string
}

// Фиксированная раскладка тайла 480×480 — 16 иконок с псевдо-случайным
// смещением и поворотом. Повторяется через background-style repeat
// благодаря тому, что svg рисуется как <pattern> внутри.
const SLOTS: { x: number; y: number; r: number; s: number }[] = [
    { x: 30, y: 40, r: -18, s: 1.0 },
    { x: 130, y: 90, r: 22, s: 0.85 },
    { x: 240, y: 30, r: -8, s: 1.1 },
    { x: 360, y: 100, r: 14, s: 0.9 },
    { x: 70, y: 180, r: 28, s: 0.95 },
    { x: 200, y: 160, r: -24, s: 1.05 },
    { x: 320, y: 200, r: 6, s: 0.9 },
    { x: 420, y: 170, r: -14, s: 1.0 },
    { x: 30, y: 290, r: 12, s: 1.05 },
    { x: 160, y: 270, r: -20, s: 0.9 },
    { x: 280, y: 320, r: 18, s: 1.0 },
    { x: 400, y: 290, r: -6, s: 0.95 },
    { x: 90, y: 400, r: -28, s: 0.9 },
    { x: 220, y: 420, r: 10, s: 1.05 },
    { x: 340, y: 410, r: -16, s: 0.95 },
    { x: 440, y: 420, r: 24, s: 0.9 },
]

const ICON_BASE = 32

export function TelegramPattern({ Icon, className }: Props) {
    return (
        <div
            aria-hidden
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className ?? ''}`}
            style={{
                WebkitMaskImage:
                    'radial-gradient(ellipse at 50% 50%, #000 75%, transparent 100%)',
                maskImage:
                    'radial-gradient(ellipse at 50% 50%, #000 75%, transparent 100%)',
            }}
        >
            <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
            >
                <defs>
                    <pattern
                        id={`tg-tile-${Icon.displayName ?? 'icon'}`}
                        x="0"
                        y="0"
                        width="480"
                        height="480"
                        patternUnits="userSpaceOnUse"
                    >
                        {SLOTS.map((s, i) => {
                            const size = ICON_BASE * s.s
                            return (
                                <g
                                    key={i}
                                    transform={`translate(${s.x} ${s.y}) rotate(${s.r} ${size / 2} ${size / 2})`}
                                    style={{
                                        color: 'rgba(10,10,10,0.11)',
                                    }}
                                >
                                    <Icon
                                        size={size}
                                        strokeWidth={1.4}
                                        absoluteStrokeWidth
                                    />
                                </g>
                            )
                        })}
                    </pattern>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill={`url(#tg-tile-${Icon.displayName ?? 'icon'})`}
                />
            </svg>
        </div>
    )
}
