import { Link } from '@tanstack/react-router'

export function Masthead() {
  return (
    <header className="sticky top-0 z-30 bg-ink text-paper-3 border-b-[3px] border-lilac">
      <div className="mx-auto max-w-[1140px] flex items-center justify-between gap-4 px-[clamp(18px,4vw,44px)] py-3">
        <Link
          to="/"
          className="font-display font-extrabold tracking-[-0.03em] text-[19px] leading-none"
        >
          QONA<span className="text-lilac">Q</span>TA
        </Link>
      </div>
    </header>
  )
}
