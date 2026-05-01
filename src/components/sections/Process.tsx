import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const STEPS = [
  {
    num: '01',
    title: 'Обсуждение',
    body: 'Разбираем задачу, цели и ограничения. Предлагаю архитектуру и стек, оцениваю сроки. Без скрытых доплат.',
    label: 'discovery',
  },
  {
    num: '02',
    title: 'Разработка',
    body: 'Итерации с регулярными демо. Вы видите прогресс на каждом этапе и вносите правки по ходу.',
    label: 'building',
  },
  {
    num: '03',
    title: 'Запуск',
    body: 'Деплой, тестирование, передача доступов и документации. Остаюсь на связи для поддержки.',
    label: 'launch',
  },
]

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const head = headRef.current
    const sticky = stickyRef.current
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
    if (!section || !head || !sticky || !cards.length) return

    // Reveal head once
    const headTrigger = ScrollTrigger.create({
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

    // Pin + scrub: only on desktop
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) {
      return () => headTrigger.kill()
    }

    const setActive = (idx: number) => {
      cards.forEach((card, i) => {
        const num = card.querySelector('.process-num') as HTMLElement
        const titleBlock = card.querySelector('.process-content') as HTMLElement
        const isActive = i === idx
        card.style.borderColor = isActive
          ? 'var(--color-fg)'
          : 'var(--color-line)'
        card.style.background = isActive
          ? 'var(--color-fg)'
          : 'var(--color-bg)'
        if (num) {
          num.style.color = isActive
            ? 'var(--color-bg)'
            : 'var(--color-line)'
        }
        if (titleBlock) {
          titleBlock.style.color = isActive
            ? 'var(--color-bg)'
            : 'var(--color-fg)'
        }
      })
    }

    setActive(0)

    const pinTrigger = ScrollTrigger.create({
      trigger: sticky,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        const idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2
        setActive(idx)
      },
    })

    return () => {
      headTrigger.kill()
      pinTrigger.kill()
    }
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative border-t border-[var(--color-line)]"
    >
      <div ref={stickyRef} className="min-h-screen flex flex-col py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto w-full">
          <div ref={headRef} className="mb-16 md:mb-20">
            <p className="reveal-up eyebrow">[ 03 ]&nbsp;&nbsp;подход</p>
            <h2 className="reveal-up mt-4 font-extrabold tracking-[-0.035em] leading-[1.0] text-[clamp(2.25rem,5vw,4.5rem)] max-w-3xl">
              Как строится
              <br />
              <span className="text-[var(--color-fg-subtle)]">работа</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {STEPS.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardsRef.current[i] = el
                }}
                className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] p-8 md:p-10 transition-[background,border-color] duration-500 ease-out"
              >
                <div
                  className="process-num font-mono font-bold leading-none mb-12 transition-colors duration-500"
                  style={{
                    fontSize: 'clamp(4.5rem, 8vw, 7rem)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {step.num}
                </div>

                <div className="process-content transition-colors duration-500">
                  <p
                    className="font-mono text-[0.7rem] uppercase tracking-[0.14em] mb-3 opacity-60"
                  >
                    [ {step.label} ]
                  </p>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-70">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
