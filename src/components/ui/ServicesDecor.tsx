import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>
  cards: { num: string; color: string }[]
}

export function ServicesDecor({ sectionRef, cards }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const indicatorRightRef = useRef<HTMLDivElement>(null)
  const indicatorLeftRef = useRef<HTMLDivElement>(null)
  const counterRightRef = useRef<HTMLSpanElement>(null)
  const counterLeftRef = useRef<HTMLSpanElement>(null)
  const labelRightRef = useRef<HTMLSpanElement>(null)
  const labelLeftRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const indicators = [indicatorLeftRef.current, indicatorRightRef.current]
    const counters = [counterLeftRef.current, counterRightRef.current]
    const labels = [labelLeftRef.current, labelRightRef.current]
    if (
      !section ||
      indicators.some((x) => !x) ||
      counters.some((x) => !x) ||
      labels.some((x) => !x)
    )
      return

    let currentIdx = -1

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress

        const idx = Math.min(cards.length - 1, Math.floor(p * cards.length))
        if (idx !== currentIdx) {
          currentIdx = idx
          const c = cards[idx]
          indicators.forEach((el) =>
            gsap.to(el!, {
              backgroundColor: c.color,
              duration: 0.6,
              ease: 'power2.out',
            }),
          )
          counters.forEach((el) => {
            if (el) el.textContent = c.num
          })
          labels.forEach((el) => {
            if (el) el.style.color = c.color
          })
        }

        indicators.forEach((el) => {
          if (el) el.style.top = `${p * 100}%`
        })
      },
    })

    counters.forEach((el) => {
      if (el) el.textContent = cards[0]?.num ?? '01'
    })
    indicators.forEach((el) =>
      gsap.set(el!, { backgroundColor: cards[0]?.color }),
    )

    return () => {
      trigger.kill()
    }
  }, [sectionRef, cards])

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* Soft section-wide gradient mesh */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 0% 20%, rgba(255,217,194,0.18) 0%, transparent 45%), radial-gradient(ellipse at 100% 30%, rgba(188,224,255,0.16) 0%, transparent 45%), radial-gradient(ellipse at 10% 70%, rgba(210,199,255,0.16) 0%, transparent 45%), radial-gradient(ellipse at 95% 85%, rgba(255,229,168,0.18) 0%, transparent 45%)',
        }}
      />

      {/* Left-side mono indicator */}
      <div className="absolute top-0 left-4 md:left-6 lg:left-8 h-full hidden md:flex flex-col items-center pt-[15vh] pb-[15vh]">
        <div className="relative h-full w-px bg-[var(--color-line)]">
          <div
            ref={indicatorLeftRef}
            className="absolute -left-[5px] w-3 h-3 rounded-full will-change-transform"
            style={{ top: '0%', transform: 'translateY(-50%)' }}
          />
        </div>
        <div className="mt-4 flex flex-col items-center">
          <span
            ref={counterLeftRef}
            className="font-mono text-xs font-bold tracking-tight"
          >
            01
          </span>
          <span
            ref={labelLeftRef}
            className="font-mono text-[0.55rem] uppercase tracking-[0.2em] mt-0.5 transition-colors"
          >
            / {cards.length.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Right-side mono indicator */}
      <div className="absolute top-0 right-4 md:right-6 lg:right-8 h-full hidden md:flex flex-col items-center pt-[15vh] pb-[15vh]">
        <div className="relative h-full w-px bg-[var(--color-line)]">
          <div
            ref={indicatorRightRef}
            className="absolute -left-[5px] w-3 h-3 rounded-full will-change-transform"
            style={{ top: '0%', transform: 'translateY(-50%)' }}
          />
        </div>
        <div className="mt-4 flex flex-col items-center">
          <span
            ref={counterRightRef}
            className="font-mono text-xs font-bold tracking-tight"
          >
            01
          </span>
          <span
            ref={labelRightRef}
            className="font-mono text-[0.55rem] uppercase tracking-[0.2em] mt-0.5 transition-colors"
          >
            / {cards.length.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}
