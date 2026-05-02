import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { MagneticLink } from '../ui/MagneticLink'

const NAV_LINKS = [
  { href: '#services', label: 'Услуги' },
  { href: '#about', label: 'Обо мне' },
  { href: '#process', label: 'Подход' },
  { href: '#contact', label: 'Контакты' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-[padding,background,border,backdrop-filter] duration-500 ${
          scrolled
            ? 'py-3 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-line)]'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center justify-between gap-6">
          <a
            href="#"
            className="font-mono text-base font-semibold tracking-tight text-[var(--color-fg)] -ml-4 md:-ml-5"
          >
            andrey<span className="text-[var(--color-fg-subtle)]">.</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticLink
              href="#contact"
              strength={0.25}
              className="px-5 py-2.5 bg-[var(--color-fg)] text-[var(--color-bg)] rounded-full text-xs font-semibold tracking-tight"
            >
              <span>Обсудить проект</span>
              <ArrowUpRight size={14} strokeWidth={2.4} />
            </MagneticLink>
          </div>

          <button
            type="button"
            aria-label="Открыть меню"
            onClick={() => setOpen(true)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-[var(--color-line)] text-[var(--color-fg)]"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-[var(--color-bg)] transition-opacity duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full px-6 pt-6 pb-12">
          <div className="flex items-center justify-between">
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="font-mono text-base font-semibold tracking-tight text-[var(--color-fg)]"
            >
              andrey<span className="text-[var(--color-fg-subtle)]">.</span>
            </a>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-[var(--color-line)] text-[var(--color-fg)]"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center gap-4">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-5xl font-extrabold tracking-tight text-[var(--color-fg)] transition-all duration-500 ${
                  open
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-[var(--color-fg)] text-[var(--color-bg)] rounded-full text-sm font-semibold"
          >
            Обсудить проект
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </>
  )
}
