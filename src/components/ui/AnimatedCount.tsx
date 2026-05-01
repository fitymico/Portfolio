import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type Props = {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCount({
  to,
  suffix = '',
  duration = 1.8,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const counter = { v: 0 }
    el.textContent = `0${suffix}`

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          v: to,
          duration,
          ease: 'power2.out',
          snap: { v: 1 },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.v)}${suffix}`
          },
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [to, suffix, duration])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
