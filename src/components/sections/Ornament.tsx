import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'

// White wavy "tunnel" overlaid on the Hero/Services boundary, with a binary
// stream (0/1) flowing along its midline like a snake. The host section is
// 0-height so the ornament does not add scroll — the SVG simply overlaps
// the bottom of Hero and the top of Services.

const HEIGHT = 220 // SVG canvas height; half above, half below boundary
const PERIODS = 2
const AMP = 42
const TUNNEL_GAP = 90
const STROKE_WIDTH = 1.6

// Binary pattern long enough to cover wide viewports comfortably. Period is
// 4 chars ("0 1 ") so a single-pattern shift yields a seamless loop.
const BINARY_PATTERN = '0 1 0 1 1 0 1 0 0 1 1 1 0 1 0 0 '
const BINARY_STREAM = BINARY_PATTERN.repeat(40)

function buildSinePath(
  vw: number,
  baseY: number,
  amp: number,
  periods: number,
) {
  const steps = Math.max(180, Math.round(periods * 80))
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = t * vw
    const y = baseY + amp * Math.sin(t * Math.PI * 2 * periods)
    pts.push(
      i === 0
        ? `M ${x.toFixed(2)} ${y.toFixed(2)}`
        : `L ${x.toFixed(2)} ${y.toFixed(2)}`,
    )
  }
  return pts.join(' ')
}

function buildClosedTunnelPath(
  vw: number,
  topY: number,
  bottomY: number,
  amp: number,
  periods: number,
) {
  const steps = Math.max(180, Math.round(periods * 80))
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = t * vw
    const y = topY + amp * Math.sin(t * Math.PI * 2 * periods)
    pts.push(
      i === 0
        ? `M ${x.toFixed(2)} ${y.toFixed(2)}`
        : `L ${x.toFixed(2)} ${y.toFixed(2)}`,
    )
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps
    const x = t * vw
    const y = bottomY + amp * Math.sin(t * Math.PI * 2 * periods)
    pts.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  pts.push('Z')
  return pts.join(' ')
}

export function Ornament() {
  const [vw, setVw] = useState(1920)
  const textPathRef = useRef<SVGTextPathElement>(null)

  useEffect(() => {
    const update = () => setVw(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Continuously slide the text along the path. The shift is one
  // BINARY_PATTERN width (~92px at the chosen font/letter spacing), so each
  // animation cycle ends visually identical to the start.
  useEffect(() => {
    const tp = textPathRef.current
    if (!tp) return
    const tween = gsap.fromTo(
      tp,
      { attr: { startOffset: 0 } },
      {
        attr: { startOffset: -92 },
        duration: 6,
        ease: 'none',
        repeat: -1,
      },
    )
    return () => {
      tween.kill()
    }
  }, [vw])

  const centreY = HEIGHT / 2
  const topY = centreY - TUNNEL_GAP / 2
  const bottomY = centreY + TUNNEL_GAP / 2

  const tunnel = buildClosedTunnelPath(vw, topY, bottomY, AMP, PERIODS)
  const topPath = buildSinePath(vw, topY, AMP, PERIODS)
  const bottomPath = buildSinePath(vw, bottomY, AMP, PERIODS)
  const midPath = buildSinePath(vw, centreY, AMP, PERIODS)

  return (
    <section
      aria-hidden
      className="relative w-full h-0 z-20 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <svg
        className="absolute left-0"
        style={{ top: -HEIGHT / 2 }}
        width={vw}
        height={HEIGHT}
        viewBox={`0 0 ${vw} ${HEIGHT}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Midline path — invisible, used as the rail for the binary text */}
          <path id="ornament-midline" d={midPath} />
        </defs>

        {/* White fill of the tunnel */}
        <path d={tunnel} fill="var(--color-bg)" />

        {/* Outline curves */}
        <path
          d={topPath}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
        <path
          d={bottomPath}
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />

        {/* Binary stream — text rendered along the midline curve */}
        <text
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="var(--color-fg)"
          fillOpacity="0.55"
          letterSpacing="0.08em"
          dominantBaseline="middle"
          style={{ fontVariationSettings: "'wght' 500" }}
        >
          <textPath
            ref={textPathRef}
            href="#ornament-midline"
            startOffset="0"
          >
            {BINARY_STREAM}
          </textPath>
        </text>
      </svg>
    </section>
  )
}
