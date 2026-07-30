import { Ticket } from './Ticket'

export function BookingSuccess({
  branchName,
  branchAddress,
  formattedDate,
  timeSlot,
  guestCount,
  onGoHome,
}: {
  branchName: string | undefined
  branchAddress: string | undefined
  formattedDate: string
  timeSlot: string | null
  guestCount: number
  onGoHome: () => void
}) {
  return (
    <div className="mx-auto max-w-[560px] px-[clamp(18px,4vw,44px)] py-[clamp(36px,7vw,72px)]">
      <div className="text-center">
        <div className="font-stamp uppercase tracking-[0.16em] text-[13px] text-riso-pink font-semibold">
          Готово
        </div>
        <h2 className="font-display font-extrabold tracking-[-0.04em] text-[clamp(30px,7vw,48px)] mt-2 leading-[0.95]">
          Заявка принята
        </h2>
        <p className="text-ink-soft text-[15px] mt-3 leading-relaxed">
          Ресторан свяжется с вами для подтверждения брони.
        </p>
      </div>

      {branchName && (
        <div className="mt-8">
          <Ticket
            branchName={branchName}
            address={branchAddress}
            formattedDate={formattedDate}
            timeSlot={timeSlot}
            guestCount={guestCount}
            stamp="Принято"
          />
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={onGoHome}
          className="font-display font-bold text-[15px] bg-ink text-paper-3 px-7 py-4 shadow-[6px_6px_0_#f4b71a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#f4b71a] transition-all"
        >
          К ресторанам →
        </button>
      </div>
    </div>
  )
}
