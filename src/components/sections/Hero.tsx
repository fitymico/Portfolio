import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { MagneticLink } from '../ui/MagneticLink'
import { RevealText } from '../ui/RevealText'
import { StatusBadge } from '../ui/StatusBadge'

const HAS_VIDEO = false
const VIDEO_SRC = '/scenes/portrait.mp4'
const POSTER_SRC = '/hero-portrait.jpeg'

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null)
    const descRef = useRef<HTMLParagraphElement>(null)
    const actionsRef = useRef<HTMLDivElement>(null)
    const badgeRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLDivElement>(null)
    const portraitRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        // Initial fade-in
        gsap.set([badgeRef.current, descRef.current, actionsRef.current], {
            opacity: 0,
            y: 24,
        })
        gsap.set(bgRef.current, { opacity: 0 })

        gsap
            .timeline({ delay: 0.1 })
            .to(bgRef.current, {
                opacity: 1,
                duration: 1.4,
                ease: 'power3.out',
            })
            .to(
                badgeRef.current,
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.9',
            )
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

        // Parallax on portrait — moves slower than the rest of the page on scroll
        const parallaxTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            onUpdate: (self) => {
                gsap.to(portraitRef.current, {
                    yPercent: self.progress * -8,
                    duration: 0.3,
                    overwrite: 'auto',
                    ease: 'power1.out',
                })
            },
        })

        // Scroll-driven video scrubbing (when HAS_VIDEO)
        let videoTrigger: ScrollTrigger | undefined
        if (HAS_VIDEO && videoRef.current) {
            const video = videoRef.current
            const setup = () => {
                if (!video.duration || !isFinite(video.duration)) return
                videoTrigger = ScrollTrigger.create({
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                    onUpdate: (self) => {
                        const t = video.duration * self.progress
                        if (Math.abs(video.currentTime - t) > 0.05) {
                            video.currentTime = t
                        }
                    },
                })
            }
            if (video.readyState >= 1) setup()
            else video.addEventListener('loadedmetadata', setup, { once: true })
        }

        return () => {
            parallaxTrigger.kill()
            videoTrigger?.kill()
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center px-6 md:px-10 overflow-hidden"
        >
            {/* Full-bleed background — portrait positioned to the LEFT, slightly oversized for parallax */}
            <div
                ref={bgRef}
                aria-hidden
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div
                    ref={portraitRef}
                    className="absolute -top-[14%] -bottom-[14%] left-0 w-full md:w-[88%] lg:w-[82%] will-change-transform"
                >
                    {HAS_VIDEO ? (
                        <video
                            ref={videoRef}
                            src={VIDEO_SRC}
                            poster={POSTER_SRC}
                            muted
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: '85% 50%' }}
                        />
                    ) : (
                        <img
                            src={POSTER_SRC}
                            alt=""
                            className="w-full h-full object-cover"
                            style={{ objectPosition: '85% 50%' }}
                        />
                    )}
                </div>

                {/* White veil — soft fade on LEFT edge of portrait + heavy fade on RIGHT for text readability */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to right, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.4) 14%, rgba(255,255,255,0.1) 28%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.88) 88%)',
                    }}
                />

            </div>

            <div className="relative z-10 max-w-[1280px] mx-auto w-full pt-32 pb-16 flex justify-end">
                <div className="max-w-2xl">
                    <div ref={badgeRef}>
                        <StatusBadge label="открыт для проектов" />
                    </div>

                    <h1 className="font-extrabold tracking-[-0.04em] leading-[0.92] mt-10 text-[clamp(3.5rem,9vw,8.5rem)]">
                        <RevealText
                            lines={[
                                { content: 'Создаю' },
                                {
                                    content: (
                                        <span
                                            className="inline-block bg-[var(--color-fg)] text-[var(--color-bg)]"
                                            style={{
                                                padding: '0.08em 0.18em 0.12em',
                                                margin: '0 -0.18em',
                                                lineHeight: 1,
                                            }}
                                        >
                                            цифровые
                                        </span>
                                    ),
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

                    <div ref={actionsRef} className="mt-12 ml-[55px] flex flex-wrap items-center gap-4">
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
            </div>

        </section>
    )
}
