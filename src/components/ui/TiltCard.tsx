import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from '../../lib/gsap'

type Props = {
  children: ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({ children, className, intensity = 8 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const shine = shineRef.current
    if (!wrap || !shine) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const rx = (0.5 - y) * intensity
      const ry = (x - 0.5) * intensity

      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        gsap.to(wrap, {
          rotateX: rx,
          rotateY: ry,
          scale: 1.01,
          duration: 0.4,
          ease: 'power3.out',
          transformPerspective: 1000,
        })
        shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(0,0,0,0.06) 0%, transparent 60%)`
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(raf)
      gsap.to(wrap, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      })
      shine.style.background = 'transparent'
    }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [intensity])

  return (
    <div
      ref={wrapRef}
      className={`relative will-change-transform ${className ?? ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      <div
        ref={shineRef}
        aria-hidden
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-[background] duration-200"
      />
    </div>
  )
}
