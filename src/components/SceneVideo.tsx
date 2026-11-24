import { forwardRef } from 'react'

type SceneName = 'exterior' | 'studio'

interface SceneVideoProps {
  name: SceneName
  /** Phones and the blurred backdrop: always the 720p MP4. */
  small?: boolean
  className?: string
  ariaHidden?: boolean
}

/**
 * Which resolution to load. The video is shown "cover", so the pixels it needs are the larger of the
 * screen width and the 16:9 width that fills the screen height, times the pixel density. Above ~1500
 * device pixels the 1080p file is visibly sharper; below that 720p looks the same and loads faster.
 */
export function videoTier(small?: boolean): 720 | 1080 {
  if (small || typeof window === 'undefined') return 720
  const dpr = window.devicePixelRatio || 1
  const needed = Math.max(window.innerWidth, (window.innerHeight * 16) / 9) * dpr
  return needed > 1500 ? 1080 : 720
}

/** Sources in preference order (WebM first where we use it, MP4 fallback for Safari/iOS). */
export function videoSources(name: SceneName, small?: boolean) {
  const tier = videoTier(small)
  return small
    ? [{ src: `/media/${name}-720.mp4`, type: 'video/mp4' }]
    : [
        { src: `/media/${name}-${tier}.webm`, type: 'video/webm' },
        { src: `/media/${name}-${tier}.mp4`, type: 'video/mp4' },
      ]
}

/** Muted, looping background video with a poster fallback. Loops are pre-baked seamless. */
export const SceneVideo = forwardRef<HTMLVideoElement, SceneVideoProps>(function SceneVideo(
  { name, small, className, ariaHidden = true },
  ref,
) {
  const saveData =
    typeof navigator !== 'undefined' &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const poster = `/media/${name}-poster.jpg`
  if (saveData) {
    return <img className={className} src={poster} alt="" aria-hidden={ariaHidden} />
  }
  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden={ariaHidden}
      disablePictureInPicture
    >
      {videoSources(name, small).map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
})
