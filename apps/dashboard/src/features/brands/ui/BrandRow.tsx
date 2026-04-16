import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { MoreHorizontal, Power, Trash2, ChevronRight } from "lucide-react"
import { useDeleteBrand, useUpdateBrand } from "../api"
import type { Brand } from "../model/types"

export function BrandRow({ brand }: { brand: Brand }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const deleteMutation = useDeleteBrand()
  const updateMutation = useUpdateBrand()

  const openDetail = () => {
    navigate({ to: "/brands/$brandId", params: { brandId: String(brand.id) } })
  }

  const toggleActive = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    updateMutation.mutate({ id: brand.id, payload: { is_active: !brand.is_active } })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    deleteMutation.mutate(brand.id)
  }

  return (
    <div
      onClick={openDetail}
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-neutral-100 bg-white px-4 py-3 transition-all hover:border-neutral-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900">
        <span className="text-[14px] font-bold text-white">
          {brand.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] font-semibold text-neutral-900">
            {brand.name}
          </p>
          {!brand.is_active && (
            <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
              пауза
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[12px] text-neutral-400 font-mono">
          {brand.slug}
        </p>
      </div>

      {brand.description && (
        <p className="hidden min-w-0 max-w-[280px] truncate text-[13px] text-neutral-400 md:block">
          {brand.description}
        </p>
      )}

      <ChevronRight className="size-4 text-neutral-300 transition-colors group-hover:text-neutral-500" />

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-all hover:bg-neutral-50 hover:text-neutral-500"
        >
          <MoreHorizontal className="size-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-neutral-100 bg-white py-1.5 shadow-lg">
              <button
                onClick={toggleActive}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                <Power className="size-3.5" />
                {brand.is_active ? "Деактивировать" : "Активировать"}
              </button>
              <div className="my-1 h-px bg-neutral-100" />
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 className="size-3.5" />
                Удалить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
