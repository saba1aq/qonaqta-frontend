function guestLabel(n: number): string {
  if (n === 1) return 'гость'
  if (n >= 2 && n <= 4) return 'гостя'
  return 'гостей'
}

export function Ticket({
  branchName,
  address,
  formattedDate,
  timeSlot,
  guestCount,
  code,
  stamp = 'Черновик',
}: {
  branchName: string
  address?: string
  formattedDate: string
  timeSlot: string | null
  guestCount: number
  code?: string
  stamp?: string
}) {
  return (
    <div className="relative bg-paper-3 border-2 border-dashed border-ink p-5 shadow-[9px_9px_0_#eec0ff]">
      <span className="absolute top-1/2 -left-[13px] -translate-y-1/2 size-[22px] rounded-full bg-paper border-2 border-dashed border-ink" />
      <span className="absolute top-1/2 -right-[13px] -translate-y-1/2 size-[22px] rounded-full bg-paper border-2 border-dashed border-ink" />

      <span className="absolute top-3.5 right-4 font-stamp uppercase tracking-[0.08em] font-bold text-[13px] text-ink border-2 border-lilac px-2 py-1 -rotate-[8deg] opacity-90">
        {stamp}
      </span>

      <div className="flex justify-between items-center border-b-2 border-ink pb-2.5 mb-3 pr-20">
        <span className="font-stamp uppercase tracking-[0.1em] text-[11px]">Бронь · Qonaqta</span>
        {code && (
          <span className="font-stamp uppercase tracking-[0.1em] text-[11px] text-ink-soft">
            {code}
          </span>
        )}
      </div>

      <div className="font-display font-extrabold tracking-[-0.03em] text-[24px] leading-tight">
        {branchName}
      </div>
      <div className="font-display font-bold text-[20px] text-ink mt-1 tabular-nums">
        {formattedDate}
        {timeSlot ? ` · ${timeSlot}` : ''}
      </div>

      <div className="flex gap-x-7 gap-y-2 mt-3.5 flex-wrap">
        <div>
          <div className="font-stamp uppercase text-[10px] tracking-[0.1em] text-ink-soft">Гости</div>
          <div className="font-display font-semibold text-[16px]">
            {guestCount} {guestLabel(guestCount)}
          </div>
        </div>
        {address && (
          <div className="min-w-0">
            <div className="font-stamp uppercase text-[10px] tracking-[0.1em] text-ink-soft">Адрес</div>
            <div className="font-display font-semibold text-[16px] truncate max-w-[220px]">{address}</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-[12.5px] text-ink-soft">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 00-8.6 15l-1.4 5 5.1-1.3A10 10 0 1012 2z" />
        </svg>
        Подтверждение придёт в WhatsApp
      </div>
    </div>
  )
}
