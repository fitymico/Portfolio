import { useEffect, useRef } from 'react'
import {
  Globe,
  MessageSquare,
  Monitor,
  Network,
  Sparkles,
  Rocket,
  ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { ServicesDecor } from '../ui/ServicesDecor'

type Palette = {
  bg: string
  mesh1: string
  mesh2: string
  accent: string
}

type Service = {
  num: string
  icon: LucideIcon
  title: string
  body: string
  tags: string[]
  palette: Palette
}

const SERVICES: Service[] = [
  {
    num: '01',
    icon: Globe,
    title: 'Web-разработка',
    body: 'Лендинги, корпоративные сайты, интернет-магазины. Доработка, копирование, ускорение и защита существующих проектов. Адаптивная вёрстка, SEO-оптимизация.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    palette: {
      bg: '#FFF7F1',
      mesh1: '#FFE9DB',
      mesh2: '#FFD6BE',
      accent: '#FFD6BE',
    },
  },
  {
    num: '02',
    icon: MessageSquare,
    title: 'Telegram-боты и Mini Apps',
    body: 'Автоворонки, приём платежей, интеграция с CRM и внешними API. Полноценные Mini Apps для вашего бизнеса.',
    tags: ['Python', 'aiogram', 'TMA SDK', 'Redis'],
    palette: {
      bg: '#F2F8FE',
      mesh1: '#DCEFFE',
      mesh2: '#BCE0FF',
      accent: '#BCE0FF',
    },
  },
  {
    num: '03',
    icon: Monitor,
    title: 'Desktop-приложения',
    body: 'Кроссплатформенные решения для автоматизации рабочих процессов и работы с локальными данными.',
    tags: ['Qt', 'C++', '.NET', 'Tauri'],
    palette: {
      bg: '#F4F2FE',
      mesh1: '#E5DEFE',
      mesh2: '#D2C7FF',
      accent: '#D2C7FF',
    },
  },
  {
    num: '04',
    icon: Network,
    title: 'Парсеры данных',
    body: 'Сбор данных с сайтов, API и соцсетей. Обход антибот-защиты, прокси-ротация, экспорт в любом формате.',
    tags: ['Scrapy', 'Selenium', 'Playwright'],
    palette: {
      bg: '#F0FBF4',
      mesh1: '#DBF0E4',
      mesh2: '#C5E5D1',
      accent: '#C5E5D1',
    },
  },
  {
    num: '05',
    icon: Sparkles,
    title: 'Интеграция ИИ',
    body: 'Внедрение LLM в проекты: чатботы, генерация контента, аналитика, классификация. RAG-пайплайны на ваших данных.',
    tags: ['OpenAI API', 'LangChain', 'Pinecone'],
    palette: {
      bg: '#FFFAEC',
      mesh1: '#FFF1CC',
      mesh2: '#FFE5A8',
      accent: '#FFE5A8',
    },
  },
  {
    num: '06',
    icon: Rocket,
    title: 'MVP для стартапов',
    body: 'Быстрый запуск минимально жизнеспособного продукта. Помогу выбрать архитектуру, избежать лишних доработок и сократить time-to-market. Не просто пишу код — выступаю техническим партнёром.',
    tags: ['fullstack', 'architecture', 'product'],
    palette: {
      bg: '#FFF4F8',
      mesh1: '#FFDEE9',
      mesh2: '#FFC7DA',
      accent: '#FFC7DA',
    },
  },
]

const meshBg = (p: Palette) =>
  `radial-gradient(at 0% 0%, ${p.mesh1} 0%, transparent 55%), radial-gradient(at 100% 100%, ${p.mesh2} 0%, transparent 55%), radial-gradient(at 80% 0%, ${p.mesh1} 0%, transparent 50%), ${p.bg}`

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const head = headRef.current
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
    if (!head || !cards.length) return

    // Header reveal
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

    // Stack effect: when next card approaches, current card recedes (scale + opacity + slight y)
    const stackTriggers: ScrollTrigger[] = []
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      if (!next) return

      const t = ScrollTrigger.create({
        trigger: next,
        start: 'top 75%',
        end: 'top 10%',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress
          gsap.set(card, {
            scale: 1 - p * 0.08,
            opacity: 1 - p * 0.55,
            y: -p * 24,
          })
        },
      })
      stackTriggers.push(t)
    })

    return () => {
      headTrigger.kill()
      stackTriggers.forEach((t) => t.kill())
    }
  }, [])

  const decorCards = SERVICES.map((s) => ({
    num: s.num,
    color: s.palette.mesh2,
  }))

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative pt-16 md:pt-24 pb-32 px-6 md:px-10"
    >
      <ServicesDecor sectionRef={sectionRef} cards={decorCards} />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div ref={headRef} className="mb-10 md:mb-14">
          <p className="reveal-up eyebrow">[ 01 ]&nbsp;&nbsp;услуги</p>
          <h2 className="reveal-up mt-4 font-extrabold tracking-[-0.035em] leading-[1.0] text-[clamp(2.25rem,5vw,4.5rem)] max-w-3xl">
            Что я могу
            <br />
            <span className="text-[var(--color-fg-subtle)]">
              для вас сделать
            </span>
          </h2>
        </div>

        <div className="relative">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.num}
                ref={(el) => {
                  cardsRef.current[i] = el
                }}
                className="sticky top-[88px] mb-8 will-change-transform"
                style={{ zIndex: 10 + i }}
              >
                <div
                  className="rounded-3xl border border-[var(--color-line)] p-8 md:p-14 lg:p-16 min-h-[64vh] flex flex-col justify-between overflow-hidden relative"
                  style={{ background: meshBg(s.palette) }}
                >
                  {/* top: number + tags */}
                  <div className="flex items-start justify-between gap-6 relative z-10">
                    <div>
                      <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
                        [ {s.num} ]&nbsp;&nbsp;service
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {s.tags.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[0.7rem] px-3 py-1 rounded-full border border-[var(--color-fg)]/15 bg-[var(--color-bg)]/40 backdrop-blur-sm text-[var(--color-fg)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className="h-14 w-14 md:h-16 md:w-16 rounded-2xl border border-[var(--color-fg)]/10 flex items-center justify-center shrink-0"
                      style={{ background: s.palette.accent }}
                    >
                      <Icon
                        size={24}
                        strokeWidth={1.6}
                        className="text-[var(--color-fg)]"
                      />
                    </div>
                  </div>

                  {/* middle: huge title */}
                  <div className="my-12 relative z-10">
                    <h3 className="font-extrabold tracking-[-0.035em] leading-[0.95] text-[clamp(2.5rem,7vw,6rem)]">
                      {s.title}
                    </h3>
                    <p className="mt-8 text-lg md:text-xl leading-[1.55] text-[var(--color-fg-muted)] max-w-3xl">
                      {s.body}
                    </p>
                  </div>

                  {/* bottom: cta + decorative */}
                  <div className="flex items-end justify-between gap-6 relative z-10">
                    <a
                      href="#contact"
                      className="group inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-[var(--color-fg)]"
                    >
                      <span className="border-b border-[var(--color-fg)] pb-0.5">
                        Обсудить проект
                      </span>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={2}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </a>
                    <div
                      className="font-mono text-[clamp(3rem,8vw,7rem)] font-bold leading-none tracking-tight select-none hidden md:block"
                      style={{ color: s.palette.mesh2 }}
                    >
                      /{s.num}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
