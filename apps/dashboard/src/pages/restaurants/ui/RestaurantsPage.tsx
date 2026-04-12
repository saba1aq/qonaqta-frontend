import { Store, Plus } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"

export function RestaurantsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Рестораны</h1>
          <p className="mt-0.5 text-sm text-neutral-400">Управление брендами и филиалами</p>
        </div>
        <Button className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white">
          <Plus className="size-4" />
          Создать бренд
        </Button>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20">
        <Store className="size-10 text-neutral-200" />
        <p className="mt-3 text-sm text-neutral-400">Нет ресторанов</p>
        <p className="mt-1 text-xs text-neutral-300">Создайте первый бренд</p>
      </div>
    </div>
  )
}
