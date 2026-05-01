import { useEffect, useRef } from 'react'
import { Send, Mail, ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { MagneticLink } from '../ui/MagneticLink'

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const box = boxRef.current
    if (!section || !box) return

    const headTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(
          box.querySelectorAll('.cta-reveal'),
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

    // Subtle parallax of the grid background on scroll
    const grid = box.querySelector('.cta-grid') as HTMLElement | null
    let parallaxTrigger: ScrollTrigger | undefined
    if (grid) {
      parallaxTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          grid.style.transform = `translate3d(0, ${(self.progress - 0.5) * 40}px, 0)`
        },
      })
    }

    return () => {
      headTrigger.kill()
      parallaxTrigger?.kill()
    }
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative px-6 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32 border-t border-[var(--color-line)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div
          ref={boxRef}
          className="relative rounded-[28px] md:rounded-[36px] bg-[var(--color-fg)] text-[var(--color-bg)] overflow-hidden px-6 md:px-16 py-20 md:py-28 text-center"
        >
          {/* Diagonal grid background */}
          <div
            aria-hidden
            className="cta-grid absolute inset-0 pointer-events-none opacity-[0.07] will-change-transform"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, var(--color-bg) 0, var(--color-bg) 1px, transparent 1px, transparent 28px)',
            }}
          />

          {/* Glow blobs */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10">
            <p className="cta-reveal eyebrow text-white/50">
              [ contact ]
            </p>
            <h2 className="cta-reveal mt-6 font-extrabold tracking-[-0.035em] leading-[1.0] text-[clamp(2.5rem,6vw,5rem)]">
              Есть идея?
              <br />
              <span className="text-white/40">Давайте обсудим.</span>
            </h2>
            <p className="cta-reveal mt-8 text-base md:text-lg text-white/60 max-w-md mx-auto leading-relaxed">
              Напишите — предложу оптимальное решение под ваши задачи. Первая
              консультация бесплатно.
            </p>

            <div className="cta-reveal mt-12 flex flex-wrap justify-center gap-3">
              <MagneticLink
                href="#"
                strength={0.25}
                className="px-7 py-4 bg-[var(--color-bg)] text-[var(--color-fg)] rounded-full text-sm font-semibold tracking-tight"
              >
                <Send size={16} strokeWidth={2.2} />
                <span>Telegram</span>
                <ArrowUpRight size={14} strokeWidth={2.4} />
              </MagneticLink>
              <MagneticLink
                href="#"
                strength={0.25}
                className="px-7 py-4 border border-white/30 hover:border-white text-white rounded-full text-sm font-semibold tracking-tight transition-colors"
              >
                <Mail size={16} strokeWidth={2.2} />
                <span>Email</span>
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
