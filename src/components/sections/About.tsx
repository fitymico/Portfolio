import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Sun, Moon, RefreshCw } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type Chapter = {
    id: string
    label: string
    title: string
    body: ReactNode
    ticker: string
}

const CHAPTERS: Chapter[] = [
    {
        id: 'origin',
        label: 'origin',
        title: 'Откуда',
        body: (
            <>
                <p>
                    Из Москвы. Программирую с университета — поступил на{' '}
                    <em>ИУ6 МГТУ им. Баумана</em>, кафедра компьютерных систем и сетей.
                </p>
                <p>
                    В коммерческой разработке с 2022 года. До этого — учебные проекты
                    и первые заказы на фрилансе.
                </p>
            </>
        ),
        ticker: 'lat 55.751°N · lon 37.617°E · г. москва · since 2022',
    },
    {
        id: 'method',
        label: 'method',
        title: 'Как работаю',
        body: (
            <>
                <p>
                    Подхожу к работе как <em>технический партнёр</em>, а не просто{' '}
                    <em>исполнитель</em>. До начала разработки обсуждаем задачу,
                    целевую аудиторию и проблемы, которые требуется решить.
                </p>
                <p>
                    Подбираю технологии исходя из требований продукта.
                </p>
                <p>
                    Объясняю простым языком, без излишней терминологии.
                    О технических <em>ограничениях</em> и рисках сообщаю заранее
                    — до начала работ.
                </p>
            </>
        ),
        ticker:
            '01 partner first · 02 stack ← product · 03 plain language · 04 one project',
    },
    {
        id: 'terms',
        label: 'terms',
        title: 'Гарантии',
        body: (
            <>
                <p>
                    Работаю по <em>договору</em>. При необходимости подписываю
                    NDA до начала обсуждения деталей проекта.
                </p>
                <p>
                    Оплата <em>поэтапно</em> — по сданным результатам, а не
                    за потраченное время.
                </p>
                <p>
                    Все исходники, документация и доступы передаются заказчику.
                    Никакой привязки к моим сервисам или аккаунтам.
                </p>
            </>
        ),
        ticker:
            '01 договор · 02 nda · 03 этапная оплата · 04 исходники у вас',
    },
    {
        id: 'now',
        label: 'now',
        title: 'Сейчас',
        body: (
            <>
                <p>
                    Откликаюсь в течение <em>4 часов</em>. Если идея ещё сырая —
                    помогу написать техническое задание, потом код.
                </p>
                <p>
                    <em>Сопровождаю проект на всех этапах разработки.</em>
                </p>
            </>
        ),
        ticker: '● open · response < 4h · q3 → q4 2026',
    },
]

const STACK_SNAPSHOT: { key: string; items: string }[] = [
    { key: 'backend', items: 'python · fastapi · django · node · aiogram' },
    {
        key: 'frontend',
        items:
            'react · vue · next · typescript · tailwind · gsap · three.js · wordpress',
    },
    { key: 'desktop', items: 'qt · qml · c++ · .net · wpf · electron' },
    {
        key: 'parsing',
        items: 'selenium · playwright · scrapy · beautifulsoup',
    },
    {
        key: 'data / infra',
        items: 'postgresql · mongodb · redis · sqlite · docker · linux',
    },
    {
        key: 'ai / ml',
        items: 'openai · claude · gemini · ollama · langchain · pytorch',
    },
]

const N = CHAPTERS.length
const SEG = 1 / N

type ThemeOverride = 'light' | 'dark' | null

// Background flip mapping. Окно перехода узкое (16% pin-длины), чтобы
// серый mid-фон не висел долго — на нём карточки и текст в mix-blend-difference
// читаются хуже. Smoothstep сглаживает старт/финиш без ступеньки.
const colorInterp = gsap.utils.interpolate('#FFFFFF', '#0A0A0A')
function flipColor(p: number) {
    const raw = Math.min(1, Math.max(0, (p - 0.42) / 0.16))
    const eased = raw * raw * (3 - 2 * raw)
    return colorInterp(eased)
}

// ─── Wavy background lines ───
type WaveLineCfg = {
    yPct: number
    amp: number
    periods: number
    opacity: number
    dur: number
    phase: number
    reverse?: boolean
    width?: number
}

// periods обязательно ЧЁТНЫЕ — drift сдвигается на vp.w = половина path-ширины,
// и seamless-loop требует целого числа периодов на этом отрезке.
const WAVE_LINES: WaveLineCfg[] = [
    { yPct: 0.14, amp: 38, periods: 4, opacity: 0.18, dur: 38, phase: 0 },
    { yPct: 0.26, amp: 22, periods: 6, opacity: 0.12, dur: 26, phase: 1.5, reverse: true },
    { yPct: 0.4, amp: 54, periods: 2, opacity: 0.22, dur: 46, phase: 0.8 },
    { yPct: 0.54, amp: 18, periods: 6, opacity: 0.1, dur: 22, phase: 2.2, reverse: true },
    { yPct: 0.68, amp: 44, periods: 4, opacity: 0.18, dur: 34, phase: 0.4 },
    { yPct: 0.82, amp: 26, periods: 4, opacity: 0.14, dur: 28, phase: 1.0, reverse: true },
    { yPct: 0.94, amp: 32, periods: 2, opacity: 0.16, dur: 42, phase: 1.7 },
]

function buildWavePath(
    totalW: number,
    baseY: number,
    amp: number,
    periods: number,
    phase: number,
) {
    const steps = Math.max(120, periods * 36)
    const pts: string[] = []
    for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const x = t * totalW
        const y = baseY + amp * Math.sin(t * Math.PI * 2 * periods + phase)
        pts.push(
            i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`,
        )
    }
    return pts.join(' ')
}

export function About() {
    const headRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const stageBgRef = useRef<HTMLDivElement>(null)
    const wavesRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])
    const tickersRef = useRef<(HTMLDivElement | null)[]>([])
    const titlesRef = useRef<(HTMLHeadingElement | null)[]>([])
    const numbersRef = useRef<(HTMLSpanElement | null)[]>([])
    const progressBarRef = useRef<HTMLDivElement>(null)
    const stackRef = useRef<HTMLDivElement>(null)

    const [activeIdx, setActiveIdx] = useState(0)
    const [vp, setVp] = useState({ w: 1920, h: 1080 })
    const [themeOverride, setThemeOverride] = useState<ThemeOverride>(null)
    const themeOverrideRef = useRef<ThemeOverride>(null)
    const triggerRef = useRef<ScrollTrigger | null>(null)

    useEffect(() => {
        themeOverrideRef.current = themeOverride
        const bg = stageBgRef.current
        if (!bg) return
        if (themeOverride === 'light') bg.style.backgroundColor = '#FFFFFF'
        else if (themeOverride === 'dark') bg.style.backgroundColor = '#0A0A0A'
        else if (triggerRef.current) bg.style.backgroundColor = flipColor(triggerRef.current.progress)
    }, [themeOverride])

    // Drip-треугольник под pin-сценой раньше был хардкоднут чёрным, потому что
    // авто-режим всегда заканчивает на #0A0A0A. При override='light' он торчит
    // как чужеродная фигура — теперь fill следует за выбранной темой.
    const dripColor = themeOverride === 'light' ? '#FFFFFF' : '#0A0A0A'

    useEffect(() => {
        const update = () =>
            setVp({ w: window.innerWidth, h: window.innerHeight })
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    // Subtle mouse parallax on wave layer
    useEffect(() => {
        const waves = wavesRef.current
        if (!waves) return
        const dx = gsap.quickTo(waves, 'x', { duration: 1.0, ease: 'power3.out' })
        const dy = gsap.quickTo(waves, 'y', { duration: 1.0, ease: 'power3.out' })
        const onMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2
            const ny = (e.clientY / window.innerHeight - 0.5) * 2
            dx(nx * -16)
            dy(ny * -10)
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [])

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

        const stage = stageRef.current
        const bg = stageBgRef.current
        if (!stage || !bg) return

        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
        const tickers = tickersRef.current.filter(Boolean) as HTMLDivElement[]
        const titles = titlesRef.current.filter(Boolean) as HTMLHeadingElement[]
        const numbers = numbersRef.current.filter(Boolean) as HTMLSpanElement[]

        cards.forEach((c, i) => {
            gsap.set(c, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 80 })
        })
        tickers.forEach((t, i) => {
            gsap.set(t, { opacity: i === 0 ? 1 : 0 })
        })
        titles.forEach((t) => {
            t.style.setProperty('--wght', '300')
            t.style.setProperty('--lsp', '0.05em')
        })
        numbers.forEach((n) => {
            n.style.setProperty('--wght', '200')
            n.style.setProperty('--lsp', '0.06em')
        })

        const trigger = ScrollTrigger.create({
            trigger: stage,
            start: 'top top',
            end: '+=420%',
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const p = self.progress

                const override = themeOverrideRef.current
                if (override === 'light') bg.style.backgroundColor = '#FFFFFF'
                else if (override === 'dark') bg.style.backgroundColor = '#0A0A0A'
                else bg.style.backgroundColor = flipColor(p)

                cards.forEach((card, i) => {
                    const segCenter = (i + 0.5) * SEG
                    const localDist = (p - segCenter) / SEG
                    const absDist = Math.abs(localDist)
                    let opacity = 0
                    if (i === 0 && p <= segCenter) opacity = 1
                    else if (i === N - 1 && p >= segCenter) opacity = 1
                    else if (absDist < 0.45) opacity = 1
                    else if (absDist < 0.65) opacity = (0.65 - absDist) / 0.2

                    let y = 0
                    if (opacity < 1) {
                        const off = 80 * (1 - opacity)
                        y = localDist > 0 ? off : -off
                    }
                    card.style.opacity = String(opacity)
                    card.style.transform = `translateY(${y}px)`

                    if (tickers[i]) {
                        tickers[i].style.opacity = String(opacity)
                    }

                    const localProg = Math.min(1, Math.max(0, (p - i * SEG) / SEG))
                    if (titles[i]) {
                        const wght = Math.round(200 + localProg * 700)
                        const lsp = (0.05 - localProg * 0.07).toFixed(3)
                        titles[i].style.setProperty('--wght', String(wght))
                        titles[i].style.setProperty('--lsp', `${lsp}em`)
                    }
                    if (numbers[i]) {
                        const nwght = Math.round(150 + localProg * 750)
                        const nlsp = (0.06 - localProg * 0.08).toFixed(3)
                        numbers[i].style.setProperty('--wght', String(nwght))
                        numbers[i].style.setProperty('--lsp', `${nlsp}em`)
                    }
                })

                const activeI = Math.min(N - 1, Math.floor(p * N + 0.001))
                setActiveIdx(activeI)

                if (progressBarRef.current) {
                    progressBarRef.current.style.width = `${p * 100}%`
                }
            },
        })
        triggerRef.current = trigger

        const stack = stackRef.current
        let stackTrigger: ScrollTrigger | null = null
        if (stack) {
            const rows = stack.querySelectorAll<HTMLElement>('[data-stack-row]')
            gsap.set(rows, { opacity: 0, y: 14 })
            stackTrigger = ScrollTrigger.create({
                trigger: stack,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(rows, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                        duration: 0.6,
                        ease: 'power3.out',
                        overwrite: true,
                    })
                },
                once: true,
            })
        }

        return () => {
            headTrigger?.kill()
            trigger.kill()
            triggerRef.current = null
            stackTrigger?.kill()
        }
    }, [])

    const totalWaveWidth = vp.w * 2

    // Drip triangle + extensions geometry — extensions continue until they
    // exit the viewport horizontally (left ext exits at right edge, right ext
    // exits at left edge).
    const triH = Math.min(110, Math.max(60, vp.w * 0.08))
    const apexX = vp.w * 0.65
    // Left edge of triangle: P1 (0, 0) → P3 (apexX, triH).
    // Extension hits x = vp.w at y = triH * (vp.w / apexX).
    const leftEndX = vp.w
    const leftEndY = triH * (vp.w / apexX)
    // Right edge: P2 (vp.w, 0) → P3 (apexX, triH).
    // Extension hits x = 0 at y = triH * vp.w / (vp.w - apexX).
    const rightEndX = 0
    const rightEndY = triH * (vp.w / (vp.w - apexX))
    const dripTotal = Math.max(leftEndY, rightEndY)

    return (
        <section
            id="about"
            className="relative border-t border-[var(--color-line)]"
        >
            <div
                ref={headRef}
                className="px-6 md:px-10 pt-20 md:pt-28 pb-20 md:pb-24"
            >
                <div className="max-w-[1400px] mx-auto">
                    <p className="reveal-up eyebrow">[ 02 ]&nbsp;&nbsp;обо мне</p>
                    <h2 className="reveal-up mt-4 font-extrabold tracking-[-0.035em] leading-[0.95] text-[clamp(2.25rem,6vw,5rem)] max-w-4xl">
                        Разработчик
                        <br />
                        <span className="text-[var(--color-fg-subtle)]">
                            и технический партнёр
                        </span>
                    </h2>
                </div>
            </div>

            <div
                ref={stageRef}
                className="relative h-screen overflow-hidden"
                style={{ isolation: 'isolate' }}
            >
                <div
                    ref={stageBgRef}
                    className="absolute inset-0"
                    style={{ backgroundColor: '#FFFFFF' }}
                />

                <div className="relative h-full text-white about-stage-content [mix-blend-mode:difference]">
                    {/* ─── Wavy lines background ─── */}
                    <div
                        ref={wavesRef}
                        aria-hidden
                        className="absolute inset-0 pointer-events-none will-change-transform"
                    >
                        <svg
                            className="absolute inset-0"
                            width={vp.w}
                            height={vp.h}
                            viewBox={`0 0 ${vp.w} ${vp.h}`}
                            preserveAspectRatio="none"
                        >
                            {WAVE_LINES.map((l, i) => {
                                const baseY = vp.h * l.yPct
                                const d = buildWavePath(
                                    totalWaveWidth,
                                    baseY,
                                    l.amp,
                                    l.periods,
                                    l.phase,
                                )
                                const driftPx = -vp.w
                                return (
                                    <g
                                        key={i}
                                        style={
                                            {
                                                animation: `pi-wave-drift ${l.dur}s linear infinite ${l.reverse ? 'reverse' : 'normal'}`,
                                                '--drift-x': `${driftPx}px`,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <path
                                            d={d}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeOpacity={l.opacity}
                                            strokeWidth="1"
                                        />
                                    </g>
                                )
                            })}
                        </svg>
                    </div>

                    {/* Top progress bar */}
                    <div className="absolute top-1 md:top-2 left-6 right-6 md:left-10 md:right-10 z-50">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="flex items-end justify-between mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em]">
                                <span>
                                    [&nbsp;02&nbsp;] обо мне · chapter {activeIdx + 1} / {N}
                                </span>
                                <span className="opacity-70">
                                    {CHAPTERS[activeIdx]?.label}
                                </span>
                            </div>
                            <div className="h-px bg-current opacity-25 relative">
                                <div
                                    ref={progressBarRef}
                                    className="absolute inset-y-0 left-0 bg-current"
                                    style={{ width: 0 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Side-rail TOC */}
                    <div className="hidden md:block absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                        <ul className="space-y-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em]">
                            {CHAPTERS.map((c, i) => (
                                <li
                                    key={c.id}
                                    className={`flex items-center gap-3 transition-opacity duration-500 ${i === activeIdx ? 'opacity-100' : 'opacity-30'
                                        }`}
                                >
                                    <span className="tabular-nums">0{i + 1}</span>
                                    <span
                                        className={`block h-px bg-current transition-all duration-500 ease-[var(--ease-out-quart)] ${i === activeIdx ? 'w-12' : 'w-4'
                                            }`}
                                    />
                                    <span>{c.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Chapter slides */}
                    <div className="relative h-full">
                        {CHAPTERS.map((c, i) => (
                            <div
                                ref={(el) => {
                                    cardsRef.current[i] = el
                                }}
                                key={c.id}
                                className="absolute inset-0 flex items-center px-6 md:px-10"
                                style={{ willChange: 'opacity, transform' }}
                            >
                                <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12 gap-6 md:gap-12">
                                    <div className="col-span-12 md:col-span-3 flex md:items-start">
                                        <span
                                            ref={(el) => {
                                                numbersRef.current[i] = el
                                            }}
                                            className="block leading-[0.85] text-[clamp(5rem,14vw,11rem)]"
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontVariationSettings: "'wght' var(--wght, 200)",
                                                letterSpacing: 'var(--lsp, 0em)',
                                            }}
                                        >
                                            0{i + 1}
                                        </span>
                                    </div>

                                    <div className="col-span-12 md:col-span-8 max-w-[820px]">
                                        <h3
                                            ref={(el) => {
                                                titlesRef.current[i] = el
                                            }}
                                            className="leading-[0.95] mb-8 md:mb-10 text-[clamp(2.25rem,6vw,5.5rem)]"
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontVariationSettings: "'wght' var(--wght, 300)",
                                                letterSpacing: 'var(--lsp, 0em)',
                                            }}
                                        >
                                            {c.title}
                                        </h3>
                                        <div className="about-cinematic-prose space-y-4 text-lg md:text-xl leading-[1.55] max-w-[58ch]">
                                            {c.body}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom mono ticker — chapter-specific data, fades with chapter */}
                    <div className="absolute bottom-16 md:bottom-20 left-6 right-6 md:left-10 md:right-10 z-30 pointer-events-none">
                        <div className="max-w-[1400px] mx-auto relative h-5">
                            {CHAPTERS.map((c, i) => (
                                <div
                                    ref={(el) => {
                                        tickersRef.current[i] = el
                                    }}
                                    key={c.id}
                                    className="absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] uppercase tracking-[0.22em] whitespace-nowrap overflow-hidden"
                                >
                                    <span className="opacity-55">↳&nbsp;&nbsp;{c.ticker}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom hint */}
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-50">
                        {activeIdx < N - 1 ? '↓ continue' : '↓ end of chapter'}
                    </div>


                    {/* Theme override — фиксирует фон поверх scroll-driven логики.
                        currentColor = white внутри mix-blend-difference контейнера, поэтому
                        кнопки автоматически читаются и на белом, и на чёрном. */}
                    <div className="hidden md:flex absolute bottom-6 left-6 md:left-10 z-30 items-center gap-3">
                        <span className="font-mono text-[0.78rem] uppercase tracking-[0.22em] opacity-60 mr-1">
                            theme
                        </span>
                        {([
                            { value: 'light' as const, Icon: Sun, label: 'Светлый фон' },
                            { value: 'dark' as const, Icon: Moon, label: 'Тёмный фон' },
                            { value: null, Icon: RefreshCw, label: 'По скроллу' },
                        ]).map(({ value, Icon, label }) => {
                            const active = themeOverride === value
                            return (
                                <button
                                    key={value ?? 'auto'}
                                    type="button"
                                    onClick={() => setThemeOverride(value)}
                                    aria-label={label}
                                    title={label}
                                    className={`h-11 w-11 rounded-full border border-current flex items-center justify-center transition-opacity cursor-pointer ${active ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Wrapper for stack section with the black "drip" triangle (filled)
          plus the two slanted lines continuing past the apex (stroke-only).
          P1/P2 are the two top corners (= bottom corners of pinned stage),
          P3 = right-of-center apex, then lines extend further from P3 in
          their original directions. SVG is absolute so flow position of stack
          content is unaffected. */}
            <div className="relative">
                {/* Hairline-разделитель ниже pin-сцены при light-теме (где drip-треугольник
                    сливается с белым стэк-фоном). top:20px = +20px ниже самого края stage. */}
                {themeOverride === 'light' && (
                    <div className="absolute left-6 right-6 md:left-10 md:right-10 z-20 pointer-events-none" style={{ top: 20 }}>
                        <div className="max-w-[1400px] mx-auto">
                            <div className="h-px bg-[var(--color-line)]" />
                        </div>
                    </div>
                )}

                {/* SVG #1 — filled black triangle (no blend, normal painting) */}
                <svg
                    aria-hidden
                    width={vp.w}
                    height={triH + 1}
                    viewBox={`0 0 ${vp.w} ${triH + 1}`}
                    className="absolute top-0 left-0 pointer-events-none z-10"
                >
                    <path
                        d={`M 0 0 L ${vp.w} 0 L ${apexX} ${triH} Z`}
                        fill={dripColor}
                    />
                </svg>

                {/* SVG #2 — extension lines with mix-blend-difference applied to the
            ENTIRE SVG element. The SVG composes its white strokes internally,
            then the SVG as a whole blends with the backdrop (stack content +
            page bg). Result: line shows BLACK over white bg (255−255=0),
            shows WHITE over black heading text (255−10=245).
            При light-теме линии теряют визуальный смысл (треугольника-источника
            нет), поэтому SVG не рендерится вообще. */}
                {themeOverride !== 'light' && (
                    <svg
                        aria-hidden
                        width={vp.w}
                        height={dripTotal}
                        viewBox={`0 0 ${vp.w} ${dripTotal}`}
                        className="absolute top-0 left-0 pointer-events-none z-10"
                        style={{ mixBlendMode: 'difference' }}
                    >
                        {/* Left edge extension — exits at the right edge of the viewport. */}
                        <line
                            x1={apexX}
                            y1={triH}
                            x2={leftEndX}
                            y2={leftEndY}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                        />
                        {/* Right edge extension — exits at the left edge of the viewport. */}
                        <line
                            x1={apexX}
                            y1={triH}
                            x2={rightEndX}
                            y2={rightEndY}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                        />
                    </svg>
                )}

                <div
                    ref={stackRef}
                    className="px-6 md:px-10 pt-24 md:pt-32 pb-16 md:pb-20"
                >
                    <div className="max-w-[1400px] mx-auto">
                        {/* Stack header — '~/stack' highlighted as inverted pill, same
                treatment as 'цифровые' in Hero */}
                        <p className="mb-10 md:mb-14 font-mono text-[0.7rem] uppercase tracking-[0.22em]">
                            <span
                                className="inline-block bg-[var(--color-fg)] text-[var(--color-bg)]"
                                style={{
                                    padding: '0.08em 0.18em 0.12em',
                                    margin: '0 -0.18em',
                                    lineHeight: 1,
                                }}
                            >
                                ~/stack
                            </span>
                        </p>
                        <h3 className="mb-12 md:mb-16 font-extrabold tracking-[-0.025em] leading-[1.0] text-[clamp(1.875rem,4vw,3.25rem)] max-w-3xl">
                            Мой стек технологий
                        </h3>

                        {/* Bordered specs-sheet rows */}
                        <div className="border-t border-[var(--color-fg)]">
                            {STACK_SNAPSHOT.map((row) => (
                                <div
                                    data-stack-row
                                    key={row.key}
                                    className="grid grid-cols-12 gap-4 md:gap-8 py-5 md:py-7 border-b border-[var(--color-line)] items-baseline group hover:bg-[var(--color-surface)] transition-colors duration-300"
                                >
                                    <span className="col-span-12 md:col-span-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-fg)] pt-1">
                                        /&nbsp;{row.key}
                                    </span>
                                    <span className="col-span-12 md:col-span-9 font-mono text-base md:text-xl text-[var(--color-fg)] tracking-[0.005em] leading-snug">
                                        {row.items}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
