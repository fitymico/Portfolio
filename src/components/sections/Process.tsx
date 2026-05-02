import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const STEPS = [
  {
    roman: 'I',
    title: 'Обсуждение',
    body: 'Разбираем задачу, цели и ограничения. Предлагаю архитектуру и стек, оцениваю сроки. Без скрытых доплат.',
    label: 'discovery',
  },
  {
    roman: 'II',
    title: 'Разработка',
    body: 'Итерации с регулярными демо. Вы видите прогресс на каждом этапе и вносите правки по ходу.',
    label: 'building',
  },
  {
    roman: 'III',
    title: 'Запуск',
    body: 'Деплой, тестирование, передача доступов и документации. Остаюсь на связи для поддержки.',
    label: 'launch',
  },
]

type CardPos = { left: number; width: number }

// Diagonal cut depth — used for both clip-path AND polygon hit-test
// in the mousemove handler so the hover doesn't trigger inside the
// cut-off (white) triangles at top-left / bottom-right.
const DIAGONAL_SLOPE = 80

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [cardPositions, setCardPositions] = useState<CardPos[]>([])

  // Measure card positions relative to section, recalc on resize.
  // Used to render full-height hover-overlay strips above each card column.
  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current
      if (!section) return
      const sectionRect = section.getBoundingClientRect()
      const positions: CardPos[] = []
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const r = card.getBoundingClientRect()
        let left = r.left - sectionRect.left
        let width = r.width
        const total = cardsRef.current.length
        // First card: extend overlay to section's left edge.
        if (i === 0) {
          width = left + width
          left = 0
        } else if (i === total - 1) {
          // Last card: extend overlay to section's right edge.
          width = sectionRect.width - left
        }
        positions.push({ left, width })
      })
      setCardPositions(positions)
    }
    measure()
    // Re-measure on next frame (after fonts/layout settle) and on resize.
    const raf = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Global mousemove → hoveredIdx. This makes hover trigger as soon as
  // the cursor is anywhere in a card's vertical column (including above the
  // card, over the heading area), not only on the card itself.
  useEffect(() => {
    if (!cardPositions.length) return
    const onMove = (e: MouseEvent) => {
      const section = sectionRef.current
      if (!section) {
        setHoveredIdx(null)
        return
      }
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const w = rect.width
      const h = rect.height
      // Reject if outside section bounding box at all
      if (x < 0 || x > w || y < 0 || y > h) {
        setHoveredIdx(null)
        return
      }
      // Polygon clip-path: 0 80, 100% 0, 100% h-80, 0 h.
      // Top edge:    y_top    = SLOPE − SLOPE * x / w  (drops to 0 at right)
      // Bottom edge: y_bottom = h     − SLOPE * x / w  (drops to h-80 at right)
      // Cursor must lie between these two for hover to fire.
      const yTop = DIAGONAL_SLOPE - (DIAGONAL_SLOPE * x) / w
      const yBottom = h - (DIAGONAL_SLOPE * x) / w
      if (y < yTop || y > yBottom) {
        setHoveredIdx(null)
        return
      }
      const idx = cardPositions.findIndex(
        (pos) => x >= pos.left && x < pos.left + pos.width,
      )
      setHoveredIdx(idx >= 0 ? idx : null)
    }
    window.addEventListener('mousemove', onMove)
    const onLeave = () => setHoveredIdx(null)
    window.addEventListener('mouseout', (e) => {
      // Cursor left the document
      if (!e.relatedTarget) onLeave()
    })
    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [cardPositions])

  // Reveal animations for heading + cards.
  useEffect(() => {
    const head = headRef.current
    let headTrigger: ScrollTrigger | null = null
    if (head) {
      headTrigger = ScrollTrigger.create({
        trigger: head,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            head.querySelectorAll('.reveal-up'),
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
              overwrite: true,
            },
          )
        },
        once: true,
      })
    }

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
    let cardsTrigger: ScrollTrigger | null = null
    if (cards.length) {
      gsap.set(cards, { y: 30, opacity: 0 })
      cardsTrigger = ScrollTrigger.create({
        trigger: cards[0],
        start: 'top 85%',
        onEnter: () => {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true,
          })
        },
        once: true,
      })
    }

    return () => {
      headTrigger?.kill()
      cardsTrigger?.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden"
      style={{
        // Diagonal-cut transition: parallelogram with top-left + bottom-right
        // corners chamfered. Adjacent white sections show through the cut-off
        // triangles, breaking the harsh dark/light edge with a geometric slope.
        // Slope kept in sync with DIAGONAL_SLOPE constant used by hover hit-test.
        clipPath: `polygon(0 ${DIAGONAL_SLOPE}px, 100% 0, 100% calc(100% - ${DIAGONAL_SLOPE}px), 0 100%)`,
      }}
    >
      {/* ── Layer 1: BG photo ── */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#1a1a1a]"
        style={{
          backgroundImage: 'url(/column.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ── Layer 2: Always-on darkening for text readability ── */}
      <div aria-hidden className="absolute inset-0 bg-black/40" />

      {/* ── Layer 3: Soft blur strips at top and bottom of bg.
          Mask gradient makes the blur strongest at the very edge,
          fading to no blur as it moves into the section. ── */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-72"
        style={{
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          maskImage:
            'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-72"
        style={{
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          maskImage:
            'linear-gradient(to top, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, black 0%, black 35%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 4: Per-card full-height hover overlays.
          Each strip spans top-to-bottom of the section so hovering blurs
          a vertical column of the bg image — not just the card area. ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {cardPositions.map((pos, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 transition-opacity duration-700 ease-in-out"
            style={{
              left: pos.left,
              width: pos.width,
              opacity: hoveredIdx === i ? 1 : 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />
        ))}
      </div>

      {/* ── Layer 5: Content (heading + cards) — z-10 to stay above
          all decorative layers. ── */}
      <div className="relative z-10">
        {/* Heading */}
        <div className="px-6 md:px-10 pt-32 md:pt-40 pb-12 md:pb-16">
          <div
            className="max-w-[1280px] mx-auto -translate-x-[10px]"
            ref={headRef}
          >
            <p className="reveal-up font-mono text-[0.75rem] font-medium uppercase tracking-[0.12em] text-white/70">
              [ 03 ]&nbsp;&nbsp;подход
            </p>
            <h2 className="reveal-up mt-4 font-extrabold tracking-[-0.035em] leading-[1.0] text-[clamp(2.25rem,5vw,4.5rem)] max-w-3xl text-white">
              Как строится
              <br />
              <span className="text-white/55">работа</span>
            </h2>
          </div>
        </div>

        {/* Cards row */}
        <div className="pb-32 md:pb-40">
          <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto flex flex-wrap">
            {STEPS.map((step, i) => {
              const isHovered = hoveredIdx === i
              return (
                <div
                  key={i}
                  ref={(el) => {
                    cardsRef.current[i] = el
                  }}
                  className="group relative flex-1 min-w-[240px] text-center text-white"
                >
                  <div
                    className="relative px-6 md:px-10 py-16 md:py-24 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: isHovered ? 'scale(0.96)' : 'scale(1)',
                    }}
                  >
                    {/* Roman numeral with corner brackets that appear on hover */}
                    <div className="relative inline-block mb-7">
                      <span
                        className="block font-mono font-bold leading-none"
                        style={{
                          fontSize: 'clamp(4.5rem, 9vw, 8rem)',
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {step.roman}
                      </span>

                      {/* 4 corner brackets — translate slides them OUT on hover */}
                      {[
                        {
                          pos: 'top-0 left-0',
                          borders: 'border-t-2 border-l-2',
                          rest: 'translate(-4px, -4px)',
                          hover: 'translate(-14px, -14px)',
                        },
                        {
                          pos: 'top-0 right-0',
                          borders: 'border-t-2 border-r-2',
                          rest: 'translate(4px, -4px)',
                          hover: 'translate(14px, -14px)',
                        },
                        {
                          pos: 'bottom-0 left-0',
                          borders: 'border-b-2 border-l-2',
                          rest: 'translate(-4px, 4px)',
                          hover: 'translate(-14px, 14px)',
                        },
                        {
                          pos: 'bottom-0 right-0',
                          borders: 'border-b-2 border-r-2',
                          rest: 'translate(4px, 4px)',
                          hover: 'translate(14px, 14px)',
                        },
                      ].map((c, ci) => (
                        <span
                          key={ci}
                          aria-hidden
                          className={`absolute ${c.pos} w-8 h-8 ${c.borders} border-white transition-all duration-700 ease-in-out`}
                          style={{
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? c.hover : c.rest,
                          }}
                        />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                      {step.title}
                    </h3>

                    {/* Body */}
                    <p className="text-sm md:text-base leading-relaxed text-white/80 max-w-[30ch] mx-auto">
                      {step.body}
                    </p>

                    {/* Mono label */}
                    <p className="mt-10 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/55">
                      [ {step.label} ]
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
