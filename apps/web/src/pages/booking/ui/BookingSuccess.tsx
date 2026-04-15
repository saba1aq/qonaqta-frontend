import { CheckCircle2 } from 'lucide-react'
import { Button } from '@qonaqta/ui/components/button'

export function BookingSuccess({
  branchName,
  formattedDate,
  timeSlot,
  onGoHome,
}: {
  branchName: string | undefined
  formattedDate: string
  timeSlot: string | null
  onGoHome: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-xl font-bold mb-2">Бронь подтверждена!</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {branchName} — {formattedDate}, {timeSlot}
      </p>
      <Button
        className="w-full h-12 rounded-xl text-sm font-semibold"
        onClick={onGoHome}
      >
        На главную
      </Button>
    </div>
  )
}
