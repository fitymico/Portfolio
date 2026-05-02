import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

type Scene = {
  src: string
  label: string
  index: string
}

const SCENES: Scene[] = [
  {
    src: '/scenes/ecommerce.mp4',
    label: 'e-commerce platform',
    index: '01',
  },
]

type Props = {
  className?: string
}

export function HeroShowcase({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    gsap.fromTo(
      wrap,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.7, ease: 'power3.out' },
    )
  }, [])

  const scene = SCENES[0]
  const total = SCENES.length

  return (
    <div ref={wrapRef} className={`relative w-full ${className ?? ''}`}>
      <div className="relative aspect-[16/9] w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden">
        <video
          src={scene.src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Decorative mono labels */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-fg)]/60 backdrop-blur-sm bg-[var(--color-bg)]/40 px-2 py-1 rounded">
            [ scene · live ]
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-fg)]/60 backdrop-blur-sm bg-[var(--color-bg)]/40 px-2 py-1 rounded">
            {scene.index} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-fg)]/60 backdrop-blur-sm bg-[var(--color-bg)]/40 px-2 py-1 rounded">
            {scene.label}
          </span>
        </div>

        {/* Corner ticks */}
        <span className="absolute top-2 left-2 h-2 w-2 border-l border-t border-[var(--color-fg)]/30 pointer-events-none" />
        <span className="absolute top-2 right-2 h-2 w-2 border-r border-t border-[var(--color-fg)]/30 pointer-events-none" />
        <span className="absolute bottom-2 left-2 h-2 w-2 border-l border-b border-[var(--color-fg)]/30 pointer-events-none" />
        <span className="absolute bottom-2 right-2 h-2 w-2 border-r border-b border-[var(--color-fg)]/30 pointer-events-none" />
      </div>
    </div>
  )
}
