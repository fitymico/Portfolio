import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { TiltCard } from '../ui/TiltCard'
import { AnimatedCount } from '../ui/AnimatedCount'

const STATS: { to: number; suffix: string; label: string }[] = [
  { to: 4, suffix: '+', label: 'года в разработке' },
  { to: 50, suffix: '+', label: 'проектов' },
  { to: 100, suffix: '%', label: 'до результата' },
  { to: 24, suffix: 'h', label: 'время ответа' },
]

const TECH = [
  'Python',
  'FastAPI',
  'Django',
  'C / C++',
  'JavaScript',
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Git',
  'Linux',
  'Qt',
  '.NET',
  'Selenium',
  'aiogram',
  'OpenAI API',
  'LangChain',
]

export function About() {
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
          stagger: 0.1,
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
      id="about"
      ref={sectionRef}
      className="relative py-32 md:py-44 px-6 md:px-10 border-t border-[var(--color-line)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div ref={headRef} className="mb-16 md:mb-24">
          <p className="reveal-up eyebrow">[ 02 ]&nbsp;&nbsp;обо мне</p>
          <h2 className="reveal-up mt-4 font-extrabold tracking-[-0.035em] leading-[1.0] text-[clamp(2.25rem,5vw,4.5rem)] max-w-3xl">
            Разработчик
            <br />
            <span className="text-[var(--color-fg-subtle)]">
              и технический партнёр
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {/* Bio + edu — span-7, row-2 */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el
            }}
            className="col-span-1 md:col-span-6 lg:col-span-7 lg:row-span-2"
          >
            <TiltCard
              intensity={4}
              className="h-full rounded-2xl bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-fg)] transition-colors"
            >
              <div className="p-8 md:p-12 h-full flex flex-col">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mb-6">
                  [ Андрей · fullstack ]
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.2] mb-6 text-[var(--color-fg)]">
                  Помогаю бизнесу превращать идеи в рабочие цифровые решения.
                </h3>
                <p className="text-[var(--color-fg-muted)] leading-relaxed mb-4">
                  В профессиональной разработке с 2022 года. Реализовал десятки
                  проектов — от лендингов до комплексных веб-платформ и
                  Telegram-ботов с интеграцией платёжных систем.
                </p>
                <p className="text-[var(--color-fg-muted)] leading-relaxed">
                  Подключаюсь не только как исполнитель, но и как технический
                  партнёр: помогаю выбрать стек, выстроить архитектуру и
                  избежать лишних затрат. Особый акцент — на автоматизации и
                  экономии ресурсов.
                </p>

                <div className="mt-auto pt-10">
                  <div className="border border-[var(--color-line)] rounded-xl p-6 bg-[var(--color-surface)]">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mb-3">
                      образование
                    </p>
                    <p className="text-base font-semibold text-[var(--color-fg)] mb-1">
                      МГТУ им. Н.Э. Баумана
                    </p>
                    <p className="text-sm text-[var(--color-fg-muted)] leading-snug">
                      Кафедра ИУ6 «Компьютерные системы и сети». Информатика и
                      вычислительная техника.
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Stats — span-5 */}
          <div
            ref={(el) => {
              cardsRef.current[1] = el
            }}
            className="col-span-1 md:col-span-6 lg:col-span-5"
          >
            <TiltCard
              intensity={5}
              className="h-full rounded-2xl bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-fg)] transition-colors"
            >
              <div className="grid grid-cols-2 h-full">
                {STATS.map((stat, i) => (
                  <div
                    key={i}
                    className={`p-6 md:p-8 flex flex-col justify-between ${
                      i % 2 === 0 ? 'border-r' : ''
                    } ${i < 2 ? 'border-b' : ''} border-[var(--color-line)]`}
                  >
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                      {stat.label}
                    </p>
                    <AnimatedCount
                      to={stat.to}
                      suffix={stat.suffix}
                      className="font-mono text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-fg)] mt-6 leading-none"
                    />
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>

          {/* Tech-stack pills — span-5 */}
          <div
            ref={(el) => {
              cardsRef.current[2] = el
            }}
            className="col-span-1 md:col-span-6 lg:col-span-5"
          >
            <TiltCard
              intensity={4}
              className="h-full rounded-2xl bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-fg)] transition-colors"
            >
              <div className="p-8 md:p-10 h-full flex flex-col">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mb-6">
                  [ stack · daily ]
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-[var(--color-fg)] mb-2">
                  Технологии
                </h3>
                <p className="text-sm text-[var(--color-fg-muted)] mb-6">
                  Инструменты, которые использую ежедневно
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TECH.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[0.72rem] px-3 py-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] cursor-default transition-all duration-300 hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] hover:border-[var(--color-fg)] hover:-translate-y-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  )
}
