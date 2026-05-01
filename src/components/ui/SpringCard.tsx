import { useEffect, useRef } from 'react'
import { gsap, Draggable } from '../../lib/gsap'

const ANCHOR_X = 160
const ANCHOR_Y = 8
const REST_Y = 110
const CARD_W = 280

type Props = {
  className?: string
}

export function SpringCard({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const inner = innerRef.current
    const path = pathRef.current
    if (!card || !inner || !path) return

    // current displacement from rest position
    const offset = { x: 0, y: 0 }

    const drawString = () => {
      const ax = ANCHOR_X
      const ay = ANCHOR_Y
      const bx = ANCHOR_X + offset.x
      const by = ANCHOR_Y + REST_Y + offset.y

      const dist = Math.sqrt(
        offset.x * offset.x + (REST_Y + offset.y) * (REST_Y + offset.y),
      )
      const restDist = REST_Y

      if (dist >= restDist * 0.9) {
        const sag = offset.x * 0.18
        const cpx = (ax + bx) / 2 + sag * 0.5
        const cpy = (ay + by) / 2 + Math.max(0, dist - restDist) * 0.04
        path.setAttribute('d', `M${ax},${ay} Q${cpx},${cpy} ${bx},${by}`)
      } else {
        const wave = Math.min((restDist - dist) * 0.3, 18)
        const t1 = (by - ay) / 3
        path.setAttribute(
          'd',
          `M${ax},${ay} C${ax + wave},${ay + t1} ${bx - wave},${by - t1} ${bx},${by}`,
        )
      }
    }

    const updateTilt = () => {
      const tilt = offset.x * 0.04
      inner.style.transform = `rotate(${tilt}deg)`
    }

    drawString()

    const draggable = Draggable.create(card, {
      type: 'x,y',
      bounds: { minX: -120, maxX: 120, minY: -20, maxY: 240 },
      inertia: false,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() {
        gsap.killTweensOf(card)
      },
      onDrag() {
        offset.x = (this as Draggable).x
        offset.y = (this as Draggable).y
        drawString()
        updateTilt()
      },
      onRelease() {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 1.4,
          ease: 'elastic.out(1, 0.4)',
          onUpdate() {
            offset.x = Number(gsap.getProperty(card, 'x')) || 0
            offset.y = Number(gsap.getProperty(card, 'y')) || 0
            drawString()
            updateTilt()
          },
          onComplete() {
            offset.x = 0
            offset.y = 0
            drawString()
            updateTilt()
          },
        })
      },
    })[0]

    // Entrance: drop in from above with elastic bounce
    gsap.fromTo(
      card,
      { y: -40 },
      {
        y: 0,
        duration: 1.6,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.6,
        onUpdate() {
          offset.y = Number(gsap.getProperty(card, 'y')) || 0
          drawString()
        },
      },
    )

    return () => {
      draggable.kill()
      gsap.killTweensOf(card)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`relative ${className ?? ''}`}
      style={{ width: 320, height: 480 }}
    >
      <svg
        viewBox="0 0 320 600"
        className="absolute inset-0 w-full h-[600px] pointer-events-none overflow-visible z-10"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          stroke="var(--color-fg)"
          strokeWidth="1"
          fill="none"
        />
        <g>
          <circle
            cx={ANCHOR_X}
            cy={ANCHOR_Y}
            r="6"
            stroke="var(--color-fg)"
            strokeWidth="1"
            fill="none"
          />
          <circle cx={ANCHOR_X} cy={ANCHOR_Y} r="2" fill="var(--color-fg)" />
        </g>
      </svg>

      <div
        ref={cardRef}
        className="absolute select-none cursor-grab active:cursor-grabbing z-20 will-change-transform"
        style={{
          left: ANCHOR_X - CARD_W / 2,
          top: ANCHOR_Y + REST_Y,
          width: CARD_W,
        }}
      >
        <div
          ref={innerRef}
          className="bg-[var(--color-bg)] border border-[var(--color-line)] will-change-transform"
          style={{
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow:
              '0 1px 0 rgba(0,0,0,0.02), 0 24px 48px -24px rgba(0,0,0,0.18)',
          }}
        >
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[var(--color-fg)] text-[var(--color-bg)] flex items-center justify-center text-3xl font-extrabold">
            А
          </div>
          <div className="text-lg font-bold text-[var(--color-fg)]">
            Андрей
          </div>
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mt-1">
            fullstack.developer
          </div>

          <div className="my-5 h-px bg-[var(--color-line)]" />

          <div className="grid grid-cols-3 gap-2">
            {[
              ['4+', 'years'],
              ['50+', 'projects'],
              ['100%', 'result'],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-mono text-base font-bold text-[var(--color-fg)]">
                  {num}
                </div>
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            moscow · russia
          </div>
        </div>
      </div>
    </div>
  )
}
