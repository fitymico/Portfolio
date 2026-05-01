import { useEffect, useRef, Fragment } from 'react'
import { gsap } from '../../lib/gsap'

const ITEMS = [
  'Web-разработка',
  'Telegram-боты',
  'Mini Apps',
  'Desktop',
  'Парсеры',
  'ИИ-интеграция',
  'MVP',
  'Python',
  'C / C++',
  'React',
  'TypeScript',
  'PostgreSQL',
]

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      tweenRef.current?.kill()
    }
  }, [])

  const onEnter = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0.25, duration: 0.5 })
  }
  const onLeave = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 })
  }

  return (
    <section
      className="relative border-y border-[var(--color-line)] py-7 overflow-hidden"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div ref={trackRef} className="flex w-max gap-12">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <Fragment key={i}>
            <span
              className="font-medium text-[clamp(1rem,1.6vw,1.25rem)] tracking-tight text-[var(--color-fg)] whitespace-nowrap"
            >
              {item}
            </span>
            <span
              aria-hidden
              className="self-center h-1 w-1 rounded-full bg-[var(--color-fg-subtle)] flex-shrink-0"
            />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
