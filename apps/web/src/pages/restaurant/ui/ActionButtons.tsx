import { Phone, Navigation, ExternalLink } from 'lucide-react'
import type { BranchDetail } from '@/entities/restaurant'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function ActionButtons({ branch }: { branch: BranchDetail }) {
  return (
    <div className="flex gap-3">
      {branch.phone && (
        <a
          href={`tel:${branch.phone}`}
          className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
        >
          <Phone className="size-5 text-neutral-600" />
          <span className="text-[11px] text-neutral-500 font-medium">Позвонить</span>
        </a>
      )}
      <a
        href={branch.two_gis ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
      >
        <Navigation className="size-5 text-neutral-600" />
        <span className="text-[11px] text-neutral-500 font-medium">Маршрут</span>
      </a>
      {branch.instagram && (
        <a
          href={`https://instagram.com/${branch.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
        >
          <InstagramIcon className="size-5 text-neutral-600" />
          <span className="text-[11px] text-neutral-500 font-medium">Instagram</span>
        </a>
      )}
      {branch.tiktok && (
        <a
          href={`https://tiktok.com/@${branch.tiktok.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-50 active:bg-neutral-100 transition-colors"
        >
          <ExternalLink className="size-5 text-neutral-600" />
          <span className="text-[11px] text-neutral-500 font-medium">TikTok</span>
        </a>
      )}
    </div>
  )
}
