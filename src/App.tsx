import { LenisProvider } from './lib/lenis'
import { Nav } from './components/sections/Nav'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Services } from './components/sections/Services'
import { About } from './components/sections/About'
import { Process } from './components/sections/Process'
import { ProjectsIntro } from './components/sections/ProjectsIntro'
import { Projects } from './components/sections/Projects'
import { CTA } from './components/sections/CTA'
import { Footer } from './components/sections/Footer'
import { ScrollProgress } from './components/ui/ScrollProgress'

function App() {
  return (
    <LenisProvider>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Process />
        <ProjectsIntro />
        <Projects />
        <CTA />
      </main>
      <Footer />
    </LenisProvider>
  )
}

export default App
