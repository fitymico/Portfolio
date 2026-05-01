import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

export function ScrollIndicator() {
  const lineRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const line = lineRef.current
    const label = labelRef.current
    if (!line || !label) return

    gsap.set(line, { scaleY: 0, transformOrigin: 'top center' })
    gsap.set(label, { opacity: 0, y: 8 })

    const tl = gsap.timeline({ delay: 1.4 })
    tl.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(line, { scaleY: 1, duration: 0.9, ease: 'power3.inOut' }, '-=0.2')
      .to(line, {
        scaleY: 0.4,
        duration: 1.2,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'top center',
      })
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <span
        ref={labelRef}
        className="font-mono uppercase tracking-[0.18em] text-[0.65rem] text-[var(--color-fg-subtle)]"
      >
        scroll
      </span>
      <span
        ref={lineRef}
        className="block h-14 w-px bg-[var(--color-fg)]"
      />
    </div>
  )
}
