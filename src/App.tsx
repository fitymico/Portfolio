import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function App() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return
    gsap.from(titleRef.current, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    })
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-6">
      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900"
      >
        Стек подключён
      </h1>
      <p className="mt-6 text-lg text-neutral-600 max-w-md text-center">
        React + Vite + Tailwind v4 + GSAP. Заголовок въезжает снизу — это GSAP.
        Цвета и отступы — это Tailwind.
      </p>
      <div className="mt-10 flex gap-3 flex-wrap justify-center">
        {['React', 'Vite', 'Tailwind v4', 'GSAP', 'TypeScript'].map((t) => (
          <span
            key={t}
            className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm font-medium text-neutral-700 shadow-sm"
          >
            {t}
          </span>
        ))}
      </div>
    </main>
  )
}

export default App
