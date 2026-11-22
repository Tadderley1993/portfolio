import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useViewport } from './lib/device'
import { useExperience } from './store'
import { Intro } from './scenes/Intro'
import { Exterior } from './scenes/Exterior'
import { Studio } from './scenes/Studio'

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

  // Warm the studio video while on the exterior so the transition is instant.
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = `/media/studio-${vp.device === 'mobile' ? '540.mp4' : '720.webm'}`
    document.head.appendChild(link)
    return () => link.remove()
  }, [vp.device])

  const intro = scene === 'intro'
  return (
    <>
      {/* The exterior renders underneath the intro so its video buffers meanwhile */}
      {scene === 'studio' ? (
        <Studio key="studio" vp={vp} onExit={() => navigate('/')} />
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
