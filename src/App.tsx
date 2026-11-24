import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useViewport } from './lib/device'
import { useExperience } from './store'
import { Intro } from './scenes/Intro'
import { Exterior } from './scenes/Exterior'
import { videoSources } from './components/SceneVideo'

// The studio (desk, desktop OS, notebook form) is its own chunk so the first load only carries the
// intro + exterior. It's prefetched while the exterior is on screen, so entering is still instant.
const loadStudio = () => import('./scenes/Studio')
const Studio = lazy(() => loadStudio().then((m) => ({ default: m.Studio })))
const Admin = lazy(() => import('./admin/Admin').then((m) => ({ default: m.Admin })))

const INTRO_KEY = 'd-studio:intro-seen'

function seenIntro() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

function Experience() {
  const vp = useViewport()
  const { scene, setScene } = useExperience()
  const location = useLocation()
  const navigate = useNavigate()

  // Route → scene (supports deep links and browser back/forward).
  useEffect(() => {
    const target = location.pathname.startsWith('/studio') ? 'studio' : 'exterior'
    if (scene === 'intro') {
      if (seenIntro()) setScene(target)
      return
    }
    if (scene !== target) setScene(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Warm the studio video while on the exterior so the transition is instant. Same file the studio
  // will pick (see videoSources), and started a little later so it doesn't compete with the exterior.
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = videoSources('studio', vp.device === 'mobile')[0].src
    const t = window.setTimeout(() => document.head.appendChild(link), 2500)
    return () => {
      window.clearTimeout(t)
      link.remove()
    }
  }, [vp.device])

  // Fetch the studio code in the background once the first screen has had a moment to load.
  useEffect(() => {
    const t = window.setTimeout(() => void loadStudio(), 1200)
    return () => window.clearTimeout(t)
  }, [])

  const intro = scene === 'intro'
  return (
    <>
      {/* The exterior renders underneath the intro so its video buffers meanwhile */}
      {scene === 'studio' ? (
        // Black matches the end of the zoom-to-window transition, so a slow load just holds on black.
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#000' }} />}>
          <Studio key="studio" vp={vp} onExit={() => navigate('/')} />
        </Suspense>
      ) : (
        <Exterior key="exterior" vp={vp} active={!intro} onEnter={() => navigate('/studio')} />
      )}
      {intro && (
        <Intro
          compact={vp.device === 'mobile'}
          reducedMotion={vp.reducedMotion}
          onDone={() => {
            try {
              sessionStorage.setItem(INTRO_KEY, '1')
            } catch {
              /* private mode */
            }
            setScene(location.pathname.startsWith('/studio') ? 'studio' : 'exterior')
          }}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <Suspense fallback={null}>
            <Admin />
          </Suspense>
        }
      />
      <Route path="*" element={<Experience />} />
    </Routes>
  )
}
