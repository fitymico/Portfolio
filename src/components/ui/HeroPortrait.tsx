import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const VIDEO_SRC = '/scenes/portrait.mp4'
const POSTER_SRC = '/hero-portrait.jpeg'
const HAS_VIDEO = false

type Props = {
  className?: string
}

export function HeroPortrait({ className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    gsap.fromTo(
      wrap,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.7, ease: 'power3.out' },
    )
  }, [])

  useEffect(() => {
    if (!HAS_VIDEO) return
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    let trigger: ScrollTrigger | undefined

    const setup = () => {
      if (!video.duration || !isFinite(video.duration)) return
      const duration = video.duration

      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const t = duration * self.progress
          if (Math.abs(video.currentTime - t) > 0.05) {
            video.currentTime = t
          }
        },
      })
    }

    if (video.readyState >= 1) {
      setup()
    } else {
      video.addEventListener('loadedmetadata', setup, { once: true })
    }

    return () => {
      trigger?.kill()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`relative w-full max-w-[560px] aspect-[4/3] ${className ?? ''}`}
    >
      {HAS_VIDEO ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={POSTER_SRC}
          alt="Андрей"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
      )}
    </div>
  )
}
