import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { MagneticLink } from '../ui/MagneticLink'
import { RevealText } from '../ui/RevealText'
import { StatusBadge } from '../ui/StatusBadge'
import { ScrollIndicator } from '../ui/ScrollIndicator'
import { SpringCard } from '../ui/SpringCard'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Fade-in for description, actions, badge
    gsap.set([badgeRef.current, descRef.current, actionsRef.current], {
      opacity: 0,
      y: 24,
    })
    gsap
      .timeline({ delay: 0.1 })
      .to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to(
        descRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '+=0.5',
      )
      .to(
        actionsRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5',
      )

    // Pin Hero on scroll
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=50%',
      pin: true,
      pinSpacing: true,
    })

    return () => {
      trigger.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-8 items-start pt-32 pb-16">
        <div className="relative z-10">
          <div ref={badgeRef}>
            <StatusBadge label="открыт для проектов" />
          </div>

          <h1
            className="font-extrabold tracking-[-0.04em] leading-[0.92] mt-10 text-[clamp(3.5rem,9vw,8.5rem)]"
            style={{ fontStretch: '100%' }}
          >
            <RevealText
              lines={[
                { content: 'Создаю' },
                {
                  content: 'цифровые',
                  className: 'text-stroke-outline',
                },
                { content: 'продукты.' },
              ]}
              delay={0.2}
              stagger={0.1}
              duration={1.0}
            />
          </h1>

          <p
            ref={descRef}
            className="mt-10 text-lg leading-[1.65] text-[var(--color-fg-muted)] max-w-[44ch]"
          >
            Сайты, Telegram-боты, парсеры и приложения. Помогаю бизнесу и
            стартапам быстро превращать идеи в рабочие решения без лишних
            затрат.
          </p>

          <div ref={actionsRef} className="mt-12 flex flex-wrap items-center gap-4">
            <MagneticLink
              href="#contact"
              strength={0.3}
              className="px-7 py-4 bg-[var(--color-fg)] text-[var(--color-bg)] rounded-full text-sm font-semibold tracking-tight"
            >
              <span>Написать мне</span>
              <ArrowUpRight size={16} strokeWidth={2.2} />
            </MagneticLink>
            <MagneticLink
              href="#services"
              strength={0.3}
              className="px-7 py-4 border border-[var(--color-line)] hover:border-[var(--color-fg)] rounded-full text-sm font-semibold tracking-tight transition-colors"
            >
              <span>Что я делаю</span>
            </MagneticLink>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end items-start lg:pt-4">
          <SpringCard />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex">
        <ScrollIndicator />
      </div>
    </section>
  )
}
