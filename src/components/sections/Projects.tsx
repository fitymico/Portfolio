import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedScene } from '../ui/AnimatedScene'
import type { SceneType } from '../ui/AnimatedScene'

type Project = {
  scene: SceneType
  index: string
  title: string
  body: string
  tags: string[]
}

const PROJECTS: Project[] = [
  {
    scene: 'ecommerce',
    index: '/01',
    title: 'E-commerce платформа',
    body: 'Интернет-магазин с каталогом, корзиной, оплатой и личным кабинетом. 3000+ товаров, интеграция с 1С.',
    tags: ['React', 'FastAPI', 'PostgreSQL'],
  },
  {
    scene: 'tg-bot',
    index: '/02',
    title: 'Telegram-бот для салона красоты',
    body: 'Онлайн-запись, напоминания, приём оплаты. Интеграция с Google Calendar и CRM салона.',
    tags: ['Python', 'aiogram', 'Redis'],
  },
  {
    scene: 'parser',
    index: '/03',
    title: 'Парсер маркетплейсов',
    body: 'Автоматический сбор цен и отзывов с Ozon, Wildberries, Яндекс.Маркет. Дашборд аналитики.',
    tags: ['Scrapy', 'Selenium', 'MongoDB'],
  },
  {
    scene: 'ai-chat',
    index: '/04',
    title: 'AI-чатбот для поддержки',
    body: 'Чатбот на базе GPT-4 для автоматизации первой линии поддержки. Снизил нагрузку на операторов на 60%.',
    tags: ['OpenAI API', 'LangChain', 'FastAPI'],
  },
  {
    scene: 'crm',
    index: '/05',
    title: 'Desktop CRM для логистики',
    body: 'Кроссплатформенное приложение для управления заказами, маршрутами и водителями. 50+ пользователей.',
    tags: ['Qt / C++', 'PostgreSQL', 'REST API'],
  },
  {
    scene: 'mini-app',
    index: '/06',
    title: 'Telegram Mini App — доставка еды',
    body: 'Полноценное приложение внутри Telegram: меню, корзина, оплата, отслеживание курьера в реальном времени.',
    tags: ['React', 'TMA SDK', 'Node.js'],
  },
]

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const head = headRef.current
    if (head) {
      ScrollTrigger.create({
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

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return

    const sticky = stickyRef.current
    const track = trackRef.current
    const progress = progressRef.current
    if (!sticky || !track || !progress) return

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)

    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: sticky,
        start: 'top top',
        end: () => '+=' + getDistance(),
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.style.width = `${self.progress * 100}%`
        },
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative border-t border-[var(--color-line)]"
    >
      <div ref={headRef} className="px-6 md:px-10 pt-12 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="reveal-up font-extrabold tracking-[-0.035em] leading-[1.0] text-[clamp(2.25rem,5vw,4.5rem)] max-w-3xl">
            Избранные
            <br />
            <span className="text-[var(--color-fg-subtle)]">работы</span>
          </h2>
        </div>
      </div>

      {/* Desktop: pinned horizontal scroll */}
      <div
        ref={stickyRef}
        className="hidden md:block relative h-screen overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center">
          <div
            ref={trackRef}
            className="flex gap-6 will-change-transform pl-6 md:pl-10 pr-6 md:pr-10"
          >
            {PROJECTS.map((p) => (
              <ProjectCard key={p.scene} project={p} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-6 right-6 md:left-10 md:right-10">
          <div className="max-w-[1280px] mx-auto h-px bg-[var(--color-line)] relative">
            <div
              ref={progressRef}
              className="absolute inset-y-0 left-0 bg-[var(--color-fg)]"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile: snap-scroll */}
      <div className="md:hidden">
        <div
          className="flex gap-4 overflow-x-auto px-6 pb-12"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {PROJECTS.map((p) => (
            <div
              key={p.scene}
              className="flex-shrink-0 w-[85vw]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex-shrink-0 w-full md:w-[440px] rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] overflow-hidden hover:border-[var(--color-fg)] transition-colors">
      <AnimatedScene type={project.scene} />
      <div className="p-6 md:p-7">
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            project{project.index}
          </p>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-fg)] mb-3">
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-fg-muted)] mb-5">
          {project.body}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[0.7rem] px-2.5 py-1 rounded-full border border-[var(--color-line)] text-[var(--color-fg-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
