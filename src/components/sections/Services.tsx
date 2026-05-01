import { useEffect, useRef } from 'react'
import {
  Globe,
  MessageSquare,
  Monitor,
  Network,
  Sparkles,
  Rocket,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { TiltCard } from '../ui/TiltCard'

type Service = {
  span: '4' | '5' | '7' | '12'
  icon: LucideIcon
  title: string
  body: string
  tag: string
}

const SPAN_CLASS: Record<Service['span'], string> = {
  '4': 'col-span-1 md:col-span-3 lg:col-span-4',
  '5': 'col-span-1 md:col-span-6 lg:col-span-5',
  '7': 'col-span-1 md:col-span-6 lg:col-span-7',
  '12': 'col-span-1 md:col-span-6 lg:col-span-12',
}

const SERVICES: Service[] = [
  {
    span: '7',
    icon: Globe,
    title: 'Web-разработка',
    body: 'Лендинги, корпоративные сайты, интернет-магазины. Доработка, копирование, ускорение и защита существующих проектов. Адаптивная вёрстка, SEO-оптимизация.',
    tag: 'HTML · CSS · JS · React',
  },
  {
    span: '5',
    icon: MessageSquare,
    title: 'Telegram-боты и Mini Apps',
    body: 'Автоворонки, приём платежей, интеграция с CRM и внешними API. Полноценные Mini Apps для вашего бизнеса.',
    tag: 'Python · aiogram · TMA',
  },
  {
    span: '4',
    icon: Monitor,
    title: 'Desktop-приложения',
    body: 'Кроссплатформенные решения для автоматизации рабочих процессов.',
    tag: 'Qt · .NET',
  },
  {
    span: '4',
    icon: Network,
    title: 'Парсеры данных',
    body: 'Сбор данных с сайтов, API, соцсетей. Экспорт в любом формате.',
    tag: 'Scrapy · Selenium',
  },
  {
    span: '4',
    icon: Sparkles,
    title: 'Интеграция ИИ',
    body: 'Внедрение LLM в проекты: чатботы, генерация контента, аналитика.',
    tag: 'OpenAI · LangChain',
  },
  {
    span: '12',
    icon: Rocket,
    title: 'MVP для стартапов',
    body: 'Быстрый запуск минимально жизнеспособного продукта. Помогу выбрать архитектуру, избежать лишних доработок и сократить time-to-market. Не просто пишу код — выступаю техническим партнёром.',
    tag: 'fullstack · architecture',
  },
]

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const head = headRef.current
    if (!head) return

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

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
    gsap.set(cards, { y: 40, opacity: 0, scale: 0.97 })

    const batchTriggers = ScrollTrigger.batch(cards, {
      start: 'top 88%',
      onEnter: (els) => {
        gsap.to(els, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true,
        })
      },
      once: true,
    })

    return () => {
      headTrigger.kill()
      batchTriggers.forEach((t) => t.kill())
    }
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 md:py-44 px-6 md:px-10"
    >
      <div className="max-w-[1280px] mx-auto">
        <div ref={headRef} className="mb-16 md:mb-24">
          <p className="reveal-up eyebrow">[ 01 ]&nbsp;&nbsp;услуги</p>
          <h2 className="reveal-up mt-4 font-extrabold tracking-[-0.035em] leading-[1.0] text-[clamp(2.25rem,5vw,4.5rem)] max-w-3xl">
            Что я могу
            <br />
            <span className="text-[var(--color-fg-subtle)]">
              для вас сделать
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={i}
                ref={(el) => {
                  cardsRef.current[i] = el
                }}
                className={SPAN_CLASS[s.span]}
              >
                <TiltCard className="h-full rounded-2xl bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-fg)] transition-colors">
                  <div className="p-8 md:p-10 h-full flex flex-col">
                    <div className="h-12 w-12 rounded-xl border border-[var(--color-line)] flex items-center justify-center mb-6 bg-[var(--color-surface)]">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className="text-[var(--color-fg)]"
                      />
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-[var(--color-fg)] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {s.body}
                    </p>

                    <div className="mt-auto pt-6">
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                        [ {s.tag} ]
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
