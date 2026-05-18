import { CheckCircle2 } from 'lucide-react'
import { Button } from '@qonaqta/ui/components/button'

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
    <div className="flex flex-col h-svh px-6 pt-6 pb-5 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center min-h-0 overflow-y-auto">
        <CheckCircle2 className="size-14 text-neutral-900 mb-5 shrink-0" />
        <h2 className="text-[24px] font-bold text-neutral-900 leading-tight">Заявка принята</h2>
        <p className="text-[14px] text-neutral-500 mt-2 leading-relaxed">
          Менеджер свяжется с вами
          <br />
          для подтверждения брони
        </p>

        {branchName && (
          <div className="w-full mt-6 rounded-2xl bg-neutral-50 border border-neutral-100 overflow-hidden">
            <div className="p-5 text-left">
              <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">Место</p>
              <p className="text-[18px] font-bold text-neutral-900">{branchName}</p>
              {branchAddress && (
                <p className="text-[12px] text-neutral-500 mt-0.5">{branchAddress}</p>
              )}
            </div>
            <div className="mx-5 border-t border-dashed border-neutral-300" />
            <div className="p-5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Дата</p>
                <p className="text-[15px] font-bold text-neutral-900 mt-1 tabular-nums">{formattedDate}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Время</p>
                <p className="text-[15px] font-bold text-neutral-900 mt-1 tabular-nums">{timeSlot}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Гостей</p>
                <p className="text-[15px] font-bold text-neutral-900 mt-1">{guestCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        className="w-full shrink-0 mt-4 h-13 rounded-2xl text-[15px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/20"
        onClick={onGoHome}
      >
        На главную
      </Button>
    </div>
  )
}
