import { Plus, UtensilsCrossed } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"

export function CuisinesEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-24">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100">
        <UtensilsCrossed className="size-7 text-neutral-300" />
      </div>
      <h3 className="mt-5 text-[15px] font-semibold text-neutral-900">
        Нет кухонь
      </h3>
      <p className="mt-1.5 max-w-[280px] text-center text-[13px] text-neutral-400">
        Добавьте типы кухонь, чтобы рестораны могли указывать свою специализацию
      </p>
      <Button
        onClick={onCreate}
        className="mt-6 gap-1.5 rounded-xl bg-neutral-900 px-5 text-[13px] text-white hover:bg-neutral-800"
      >
        <Plus className="size-4" />
        Добавить кухню
      </Button>
    </div>
  )
}
