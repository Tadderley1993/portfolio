interface LogoProps {
  className?: string
  title?: string
  strokeWidth?: number
}

/** The d> mark. Stroke-based so it can be drawn on; inherits `color`. */
export function Logo({ className, title = 'd>', strokeWidth = 14 }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 134"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      role="img"
      aria-label={title}
    >
      <circle className="logo-bowl" cx="52" cy="85" r="38" pathLength={1} />
      <path className="logo-stem" d="M90 6v121" pathLength={1} />
      <path
        className="logo-chevron"
        d="M122 54l56 31-56 31"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        pathLength={1}
      />
    </svg>
  )
}
