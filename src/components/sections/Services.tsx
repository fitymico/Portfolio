import { useEffect, useRef } from 'react'
import {
    Globe,
    MessageSquare,
    Monitor,
    Network,
    Sparkles,
    Rocket,
    Cpu,
    ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { ServicesDecor } from '../ui/ServicesDecor'
import { TelegramPattern } from '../ui/TelegramPattern'

type Service = {
    num: string
    icon: LucideIcon
    title: string
    body: string
    tags: string[]
}

const SERVICES: Service[] = [
    {
        num: '01',
        icon: Globe,
        title: 'Web-разработка',
        body: 'Лендинги, корпоративные сайты, интернет-магазины. Доработка, копирование, ускорение и защита существующих проектов. Адаптивная вёрстка, SEO-оптимизация.',
        tags: [
            'React',
            'Next.js',
            'Vue',
            'TypeScript',
            'Tailwind',
            'GSAP',
            'Three.js',
            'Node.js',
            'FastAPI',
            'PostgreSQL',
            'WordPress',
        ],
    },
    {
        num: '02',
        icon: MessageSquare,
        title: 'Telegram-боты и Mini Apps',
        body: 'Автоворонки, приём платежей, интеграция с CRM и внешними API. Полноценные Mini Apps для вашего бизнеса.',
        tags: [
            'Python',
            'aiogram',
            'FastAPI',
            'React',
            'TypeScript',
            'PostgreSQL',
            'Telegram Payments',
            'Docker',
        ],
    },
    {
        num: '03',
        icon: Monitor,
        title: 'Desktop-приложения',
        body: 'Кроссплатформенные решения для автоматизации рабочих процессов и работы с локальными данными.',
        tags: [
            'Qt',
            'QML',
            'C++',
            'CMake',
            'Boost',
            '.NET',
            'WPF',
            'Electron',
            'SQLite',
        ],
    },
    {
        num: '04',
        icon: Network,
        title: 'Парсеры данных',
        body: 'Сбор данных с сайтов, API и соцсетей. Обход антибот-защиты, прокси-ротация, экспорт в любом формате.',
        tags: [
            'Python',
            'Scrapy',
            'BeautifulSoup',
            'Selenium',
            'Playwright',
            'PostgreSQL',
        ],
    },
    {
        num: '05',
        icon: Sparkles,
        title: 'Интеграция ИИ',
        body: 'Внедрение LLM в проекты: чатботы, генерация контента, аналитика, классификация. RAG-пайплайны на ваших данных.',
        tags: [
            'Python',
            'OpenAI API',
            'Anthropic Claude',
            'Gemini',
            'Ollama',
            'LangChain',
            'PyTorch',
        ],
    },
    {
        num: '06',
        icon: Rocket,
        title: 'MVP для стартапов',
        body: 'Быстрый запуск минимально жизнеспособного продукта. Помогу выбрать архитектуру, избежать лишних доработок и сократить time-to-market. Не просто пишу код — выступаю техническим партнёром.',
        tags: [
            'mvp',
            'fullstack',
            'architecture',
            'product',
            'consulting',
            'pivot',
        ],
    },
    {
        num: '07',
        icon: Cpu,
        title: 'Программирование МК',
        body: 'Прошивки и прототипы на Arduino, ESP32/ESP8266, STM32 для IoT, автоматизации и умных домов. Работа с датчиками, дисплеями, Wi-Fi/Bluetooth — от схемы до тестирования.',
        tags: [
            'Arduino',
            'ESP32',
            'ESP8266',
            'STM32',
            'C/C++',
            'GPIO',
            'IoT',
        ],
    },
]

// Единый фон карточки: белый с заметным серым диагональным mesh.
// Один и тот же на всех карточках — отличие даёт только tg-паттерн с иконкой.
const CARD_BG =
    'radial-gradient(at 0% 0%, #E4E4E4 0%, transparent 55%), radial-gradient(at 100% 100%, #D8D8D8 0%, transparent 60%), linear-gradient(135deg, #FFFFFF 0%, #E8E8E8 100%)'

// Запас сверх максимальной натуральной высоты карточек, px.
// Берём max, чтобы самая «высокая» карточка (с 2-строчным заголовком) тоже
// помещалась — иначе justify-between схлопывается и CTA уползает за overflow.
const HEIGHT_PADDING = 20

export function Services() {
    const sectionRef = useRef<HTMLElement>(null)
    const headRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])
    const cardInnersRef = useRef<(HTMLDivElement | null)[]>([])
    const spacerRef = useRef<HTMLDivElement>(null)

    // Унифицируем высоту всех карточек по самой «высокой» (max) + запас.
    useEffect(() => {
        const inners = cardInnersRef.current.filter(Boolean) as HTMLDivElement[]
        if (!inners.length) return

        const apply = () => {
            // Сбрасываем фиксированную высоту, чтобы измерить натуральную
            inners.forEach((el) => {
                el.style.height = 'auto'
            })
            const maxH = Math.max(...inners.map((el) => el.offsetHeight))
            const target = maxH + HEIGHT_PADDING
            inners.forEach((el) => {
                el.style.height = `${target}px`
            })
            ScrollTrigger.refresh()
        }

        apply()

        const onResize = () => apply()
        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [])

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

        // Stack-эффект: при подходе следующей карточки текущая «отъезжает
        // вглубь» через scale (origin = центр, без y-сдвига). Так как все
        // карточки одной высоты, уменьшенная card лежит строго внутри bbox
        // следующей и нигде не торчит.
        const stackTriggers: ScrollTrigger[] = []
        cards.forEach((card, i) => {
            const next = cards[i + 1]
            if (!next) return

            gsap.set(card, { transformOrigin: '50% 50%' })

            const t = ScrollTrigger.create({
                trigger: next,
                start: 'top 75%',
                end: 'top 10%',
                scrub: 0.6,
                onUpdate: (self) => {
                    gsap.set(card, {
                        scale: 1 - self.progress * 0.06,
                    })
                },
            })
            stackTriggers.push(t)
        })

        // Last-card recede: у последней карточки нет «следующей», поэтому
        // её эффект «отъезда» привязываем к spacer'у — пока он проезжает
        // через viewport, последняя карточка тоже плавно уменьшается.
        let lastTrigger: ScrollTrigger | undefined
        const lastCard = cards[cards.length - 1]
        const spacer = spacerRef.current
        if (lastCard && spacer) {
            gsap.set(lastCard, { transformOrigin: '50% 50%' })
            lastTrigger = ScrollTrigger.create({
                trigger: spacer,
                start: 'top 90%',
                end: 'top 30%',
                scrub: 0.6,
                onUpdate: (self) => {
                    gsap.set(lastCard, {
                        scale: 1 - self.progress * 0.06,
                    })
                },
            })
        }

        return () => {
            headTrigger.kill()
            stackTriggers.forEach((t) => t.kill())
            lastTrigger?.kill()
        }
    }, [])

    const decorCards = SERVICES.map((s) => ({ num: s.num }))

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative pt-16 md:pt-24 pb-32 px-6 md:px-10"
        >
            <ServicesDecor sectionRef={sectionRef} cards={decorCards} />

            <div className="relative z-10 max-w-[1280px] mx-auto">
                <div ref={headRef} className="mt-[35px] mb-10 md:mb-14">
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
                                    ref={(el) => {
                                        cardInnersRef.current[i] = el
                                    }}
                                    className="rounded-3xl border border-[var(--color-line)] p-8 md:p-14 lg:p-16 flex flex-col justify-between overflow-hidden relative"
                                    style={{ background: CARD_BG }}
                                >
                                    {/* Telegram-style фоновый паттерн с иконкой сервиса */}
                                    <TelegramPattern Icon={Icon} />

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
                                                        className="font-mono text-[0.7rem] px-3 py-1 rounded-full border border-[var(--color-fg)]/15 bg-[var(--color-bg)]/60 backdrop-blur-sm text-[var(--color-fg)]"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl border border-[var(--color-fg)]/10 bg-[var(--color-bg)]/70 backdrop-blur-sm flex items-center justify-center shrink-0">
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
                                            style={{ color: 'rgba(10,10,10,0.08)' }}
                                        >
                                            /{s.num}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {/* Spacer: даёт последней карточке полноценный sticky-range,
                        чтобы card 6 успела доехать до top:88px и зафиксироваться,
                        а остальные карточки не отлипали раньше времени. */}
                    <div
                        ref={spacerRef}
                        aria-hidden
                        className="h-[12vh] pointer-events-none"
                    />
                </div>
            </div>
        </section>
    )
}
