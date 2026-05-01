import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from '../../lib/gsap'

type Line = {
  content: ReactNode
  className?: string
}

type Props = {
  lines: Line[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  duration?: number
}

export function RevealText({
  lines,
  className,
  lineClassName,
  delay = 0.15,
  stagger = 0.12,
  duration = 1.0,
}: Props) {
  const innerRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const targets = innerRefs.current.filter(Boolean) as HTMLSpanElement[]
    if (!targets.length) return

    gsap.set(targets, { yPercent: 110 })
    gsap.to(targets, {
      yPercent: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
    })
  }, [delay, stagger, duration])

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`block overflow-hidden ${lineClassName ?? ''}`}
          style={{ paddingBottom: '0.06em' }}
        >
          <span
            ref={(el) => {
              innerRefs.current[i] = el
            }}
            className={`block ${line.className ?? ''}`}
          >
            {line.content}
          </span>
        </span>
      ))}
    </span>
  )
}
