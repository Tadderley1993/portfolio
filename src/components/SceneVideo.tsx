import { forwardRef } from 'react'

interface SceneVideoProps {
  name: 'exterior' | 'studio'
  small?: boolean
  className?: string
  ariaHidden?: boolean
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
      {!small && <source src={`/media/${name}-720.webm`} type="video/webm" />}
      <source src={`/media/${name}-${small ? 540 : 720}.mp4`} type="video/mp4" />
    </video>
  )
})
