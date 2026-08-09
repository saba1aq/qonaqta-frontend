import { useState, useMemo } from "react"
import { Link } from "@tanstack/react-router"
import { Plus, Pencil, Trash2, Megaphone, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@qonaqta/ui/lib/utils"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { Label } from "@qonaqta/ui/components/label"
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
  PROMOTION_KINDS,
  type Promotion,
  type PromotionKind,
} from "@/features/promotions"
import { useRestaurants } from "@/features/restaurants"

const PAGE_SIZE = 20

interface FormState {
  branch_id: number
  kind: PromotionKind
  title: string
  description: string
  sort_order: number
}

const EMPTY_FORM: FormState = {
  branch_id: 0,
  kind: "discount",
  title: "",
  description: "",
  sort_order: 0,
}

export function PromotionsPage() {
  const { data: restaurants } = useRestaurants()
  const [branchFilter, setBranchFilter] = useState<number | "">("")
  const [page, setPage] = useState(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const filters = useMemo(
    () => ({
      branch_id: branchFilter === "" ? undefined : branchFilter,
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
    }),
    [branchFilter, page]
  )

  const { data: promotions, isLoading, isError } = usePromotions(filters)
  const deletePromotion = useDeletePromotion()

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const createMutation = useCreatePromotion(closeForm)
  const updateMutation = useUpdatePromotion(closeForm)
  const toggleMutation = useUpdatePromotion()

  const changeBranchFilter = (value: number | "") => {
    setBranchFilter(value)
    setPage(0)
  }

  const branchName = (promotion: Promotion) =>
    promotion.branch?.name ??
    restaurants?.find((r) => r.id === promotion.branch_id)?.name ??
    `#${promotion.branch_id}`

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, branch_id: restaurants?.[0]?.id ?? 0 })
    setFormOpen(true)
  }

  const openEdit = (promotion: Promotion) => {
    setEditingId(promotion.id)
    setForm({
      branch_id: promotion.branch_id,
      kind: promotion.kind,
      title: promotion.title,
      description: promotion.description ?? "",
      sort_order: promotion.sort_order,
    })
    setFormOpen(true)
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return
    if (editingId !== null) {
      updateMutation.mutate({
        id: editingId,
        payload: {
          kind: form.kind,
          title: form.title.trim(),
          description: form.description.trim() || null,
          sort_order: form.sort_order,
        },
      })
      return
    }
    if (!form.branch_id) return
    createMutation.mutate({
      branch_id: form.branch_id,
      kind: form.kind,
      title: form.title.trim(),
      description: form.description.trim() || null,
      sort_order: form.sort_order,
    })
  }

  const handleDelete = (promotion: Promotion) => {
    if (confirm(`Удалить «${promotion.title}»?`)) deletePromotion.mutate(promotion.id)
  }

  const noRestaurants = restaurants !== undefined && restaurants.length === 0
  const isSaving = createMutation.isPending || updateMutation.isPending
  const hasNextPage = (promotions?.length ?? 0) === PAGE_SIZE

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Афиша</h1>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            Скидки, акции и события заведений
          </p>
        </div>
        <Button
          onClick={openCreate}
          disabled={noRestaurants}
          className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
        >
          <Plus className="size-4" />
          Добавить
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <select
          value={branchFilter}
          onChange={(e) => changeBranchFilter(e.target.value ? Number(e.target.value) : "")}
          className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 outline-none focus:border-neutral-300"
        >
          <option value="">Все заведения</option>
          {restaurants?.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {formOpen && (
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-neutral-900">
              {editingId !== null ? "Редактирование промо" : "Новое промо"}
            </h2>
            <button
              onClick={closeForm}
              className="flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Заведение *</Label>
              <select
                value={form.branch_id}
                onChange={(e) => update("branch_id", Number(e.target.value))}
                disabled={editingId !== null}
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/20 disabled:bg-neutral-50 disabled:text-neutral-400"
              >
                <option value={0} disabled>Выберите заведение</option>
                {restaurants?.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Тип *</Label>
              <select
                value={form.kind}
                onChange={(e) => update("kind", e.target.value as PromotionKind)}
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-[14px] text-neutral-900 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/20"
              >
                {PROMOTION_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[13px] text-neutral-600">Заголовок *</Label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                maxLength={120}
                placeholder="Кальян от 2500 ₸"
                className="h-10 rounded-xl text-[14px]"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[13px] text-neutral-600">Описание</Label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Весь август, кроме пятницы и субботы"
                className="w-full resize-none rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-neutral-600">Порядок</Label>
              <Input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => update("sort_order", Math.max(0, Number(e.target.value) || 0))}
                className="h-10 rounded-xl text-[14px]"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isSaving || !form.title.trim() || (editingId === null && !form.branch_id)}
              className="rounded-xl bg-neutral-900 px-6 text-[13px] text-white hover:bg-neutral-800"
            >
              {isSaving ? "Сохранение..." : editingId !== null ? "Сохранить" : "Создать"}
            </Button>
            <Button
              onClick={closeForm}
              variant="ghost"
              className="rounded-xl text-[13px] text-neutral-500"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      {noRestaurants ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <Megaphone className="size-6 text-neutral-300" />
          </div>
          <p className="mt-4 text-sm text-neutral-400">Сначала добавьте заведение</p>
          <Link
            to="/restaurants/create"
            className="mt-3 text-[13px] font-medium text-neutral-900 underline underline-offset-4"
          >
            Создать ресторан
          </Link>
        </div>
      ) : isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[52px] animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-white/50 py-20">
          <p className="text-sm text-red-500">Не удалось загрузить афишу</p>
        </div>
      ) : !promotions || promotions.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/50 py-20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <Megaphone className="size-6 text-neutral-300" />
          </div>
          <p className="mt-4 text-sm text-neutral-400">Пока нет промо</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Заведение</th>
                <th className="w-28 px-4 py-3 text-left font-medium text-neutral-500">Тип</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Заголовок</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500">Описание</th>
                <th className="w-24 px-4 py-3 text-center font-medium text-neutral-500">Активно</th>
                <th className="w-20 px-4 py-3 text-center font-medium text-neutral-500">Порядок</th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => {
                const kind = PROMOTION_KINDS.find((k) => k.value === promotion.kind)
                return (
                  <tr key={promotion.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                    <td className="px-4 py-3 text-neutral-500">{branchName(promotion)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          kind?.color ?? "bg-neutral-100 text-neutral-500"
                        )}
                      >
                        {kind?.label ?? promotion.kind}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{promotion.title}</td>
                    <td className="max-w-[280px] truncate px-4 py-3 text-neutral-500">
                      {promotion.description || <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          toggleMutation.mutate({
                            id: promotion.id,
                            payload: { is_active: !promotion.is_active },
                          })
                        }
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
                          promotion.is_active ? "bg-neutral-900" : "bg-neutral-200"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none mt-0.5 inline-block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
                            promotion.is_active ? "translate-x-4" : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums text-neutral-500">
                      {promotion.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(promotion)}
                          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(promotion)}
                          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {!noRestaurants && (page > 0 || hasNextPage) && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-[13px] tabular-nums text-neutral-400">{page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage}
            className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
