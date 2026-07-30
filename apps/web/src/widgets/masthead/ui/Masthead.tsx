import { Link } from '@tanstack/react-router'

export function Masthead() {
  return (
    <header className="sticky top-0 z-30 bg-ink text-paper-3 border-b-[3px] border-riso-pink">
      <div className="mx-auto max-w-[1140px] flex items-center justify-between gap-4 px-[clamp(18px,4vw,44px)] py-3">
        <Link
          to="/"
          className="font-display font-extrabold tracking-[-0.03em] text-[19px] leading-none"
        >
          QONA<span className="text-riso-sun">Q</span>TA
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/restaurants"
            className="font-stamp uppercase tracking-[0.08em] text-[12.5px] text-paper-3/80 px-3 py-2 border border-transparent hover:text-riso-sun hover:border-riso-sun/50 transition-colors [&.active]:text-riso-sun"
          >
            Рестораны
          </Link>
        </nav>
      </div>
    </header>
  )
}
