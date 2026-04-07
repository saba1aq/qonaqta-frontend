import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2, ChevronDown, ChevronRight, Pencil, Check, X } from "lucide-react"
import { cn } from "@qonaqta/ui/lib/utils"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import { apiClient } from "@/shared/api"

interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  photo_url: string | null
  is_available: boolean
  sort_order: number
}

interface MenuCategory {
  id: number
  name: string
  sort_order: number
  items: MenuItem[]
}

async function fetchAdminContext() {
  const { data: restaurants } = await apiClient.get("/admin/restaurants")
  const restaurant = restaurants[0]
  if (!restaurant) return { branchId: null }
  const { data: branches } = await apiClient.get(`/admin/restaurants/${restaurant.id}/branches`)
  return { branchId: branches[0]?.id ?? null }
}

function EditableText({
  value,
  onSave,
  className,
  placeholder,
}: {
  value: string
  onSave: (v: string) => void
  className?: string
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="h-7 rounded-lg border-neutral-200 text-[13px]"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") { onSave(draft); setEditing(false) }
            if (e.key === "Escape") { setDraft(value); setEditing(false) }
          }}
        />
        <button onClick={() => { onSave(draft); setEditing(false) }} className="text-green-600">
          <Check className="size-3.5" />
        </button>
        <button onClick={() => { setDraft(value); setEditing(false) }} className="text-neutral-400">
          <X className="size-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      className={cn("group flex items-center gap-1 text-left", className)}
      onClick={() => { setDraft(value); setEditing(true) }}
    >
      {value}
      <Pencil className="size-3 opacity-0 transition-opacity group-hover:opacity-40" />
    </button>
  )
}

function AddItemRow({
  onAdd,
}: {
  onAdd: (name: string, price: number, description: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-[13px] text-[#1C1C1C]/40 transition-colors hover:text-[#1C1C1C]/70"
      >
        <Plus className="size-3.5" />
        Добавить блюдо
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Input
        autoFocus
        placeholder="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 flex-1 rounded-lg border-neutral-200 text-[13px]"
      />
      <Input
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="h-8 flex-1 rounded-lg border-neutral-200 text-[13px]"
      />
      <Input
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        className="h-8 w-24 rounded-lg border-neutral-200 text-[13px]"
      />
      <button
        onClick={() => {
          if (name && price) {
            onAdd(name, Number(price), description)
            setName("")
            setPrice("")
            setDescription("")
            setOpen(false)
          }
        }}
        className="text-green-600"
      >
        <Check className="size-4" />
      </button>
      <button onClick={() => setOpen(false)} className="text-neutral-400">
        <X className="size-4" />
      </button>
    </div>
  )
}

export function MenuPage() {
  const queryClient = useQueryClient()
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingCategory, setAddingCategory] = useState(false)

  const { data: context } = useQuery({
    queryKey: ["admin-context"],
    queryFn: fetchAdminContext,
    staleTime: Infinity,
  })

  const branchId = context?.branchId

  const { data: categories = [] as MenuCategory[], isLoading } = useQuery<MenuCategory[]>({
    queryKey: ["menu", branchId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/branches/${branchId}/menu`)
      return data as MenuCategory[]
    },
    enabled: !!branchId,
  })

  useEffect(() => {
    if (categories.length > 0) {
      setExpandedCategories(new Set(categories.map((c) => c.id)))
    }
  }, [categories.length])

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["menu", branchId] })

  const addCategory = useMutation({
    mutationFn: (name: string) =>
      apiClient.post("/admin/menu/categories", { branch_id: branchId, name }),
    onSuccess: invalidate,
  })

  const updateCategory = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      apiClient.put(`/admin/menu/categories/${id}`, { name }),
    onSuccess: invalidate,
  })

  const deleteCategory = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/menu/categories/${id}`),
    onSuccess: invalidate,
  })

  const addItem = useMutation({
    mutationFn: ({
      categoryId,
      name,
      price,
      description,
    }: {
      categoryId: number
      name: string
      price: number
      description: string
    }) =>
      apiClient.post("/admin/menu/items", {
        category_id: categoryId,
        name,
        price,
        description: description || undefined,
      }),
    onSuccess: invalidate,
  })

  const updateItem = useMutation({
    mutationFn: ({ id, ...body }: { id: number; name?: string; price?: number; description?: string; is_available?: boolean }) =>
      apiClient.put(`/admin/menu/items/${id}`, body),
    onSuccess: invalidate,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/menu/items/${id}`),
    onSuccess: invalidate,
  })

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5 -m-6 lg:-m-8 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1C1C1C]">Меню</h1>
          <p className="mt-0.5 text-sm text-[#1C1C1C]/40">{categories.length} категорий</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl bg-[#232323] text-[13px]"
          onClick={() => setAddingCategory(true)}
        >
          <Plus className="size-4" />
          Категория
        </Button>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center rounded-2xl bg-[#FEFEFE] text-[#1C1C1C]/30">
          Загрузка...
        </div>
      )}

      <div className="space-y-3">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          return (
            <div
              key={category.id}
              className="rounded-2xl bg-[#FEFEFE] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3"
                onClick={() => toggleCategory(category.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="size-4 text-[#1C1C1C]/40" />
                ) : (
                  <ChevronRight className="size-4 text-[#1C1C1C]/40" />
                )}
                <EditableText
                  value={category.name}
                  onSave={(name) => updateCategory.mutate({ id: category.id, name })}
                  className="flex-1 text-[15px] font-semibold text-[#1C1C1C]"
                />
                <span className="text-[13px] text-[#1C1C1C]/40">{category.items.length} блюд</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCategory.mutate(category.id)
                  }}
                  className="ml-2 text-neutral-300 transition-colors hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-[#F3F3F3]">
                  {category.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3",
                        idx !== category.items.length - 1 && "border-b border-[#F3F3F3]"
                      )}
                    >
                      <div className="flex flex-1 flex-col gap-0.5">
                        <EditableText
                          value={item.name}
                          onSave={(name) => updateItem.mutate({ id: item.id, name })}
                          className="text-[14px] font-medium text-[#1C1C1C]"
                        />
                        {item.description && (
                          <EditableText
                            value={item.description}
                            onSave={(description) => updateItem.mutate({ id: item.id, description })}
                            className="text-[12px] text-[#1C1C1C]/50"
                          />
                        )}
                      </div>
                      <EditableText
                        value={String(item.price)}
                        onSave={(v) => updateItem.mutate({ id: item.id, price: Number(v) })}
                        className="text-[14px] font-medium text-[#1C1C1C]"
                      />
                      <span className="text-[12px] text-[#1C1C1C]/40">₸</span>
                      <button
                        onClick={() =>
                          updateItem.mutate({ id: item.id, is_available: !item.is_available })
                        }
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
                          item.is_available
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                        )}
                      >
                        {item.is_available ? "Доступно" : "Скрыто"}
                      </button>
                      <button
                        onClick={() => deleteItem.mutate(item.id)}
                        className="text-neutral-300 transition-colors hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}

                  <AddItemRow
                    onAdd={(name, price, description) =>
                      addItem.mutate({ categoryId: category.id, name, price, description })
                    }
                  />
                </div>
              )}
            </div>
          )
        })}

        {addingCategory && (
          <div className="flex items-center gap-2 rounded-2xl bg-[#FEFEFE] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Input
              autoFocus
              placeholder="Название категории"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="h-8 flex-1 rounded-lg border-neutral-200 text-[13px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newCategoryName.trim()) {
                  addCategory.mutate(newCategoryName.trim())
                  setNewCategoryName("")
                  setAddingCategory(false)
                }
                if (e.key === "Escape") {
                  setNewCategoryName("")
                  setAddingCategory(false)
                }
              }}
            />
            <button
              onClick={() => {
                if (newCategoryName.trim()) {
                  addCategory.mutate(newCategoryName.trim())
                  setNewCategoryName("")
                  setAddingCategory(false)
                }
              }}
              className="text-green-600"
            >
              <Check className="size-4" />
            </button>
            <button
              onClick={() => {
                setNewCategoryName("")
                setAddingCategory(false)
              }}
              className="text-neutral-400"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {!isLoading && categories.length === 0 && !addingCategory && (
          <div className="flex h-40 items-center justify-center rounded-2xl bg-[#FEFEFE] text-[#1C1C1C]/30">
            Меню пустое. Добавьте первую категорию.
          </div>
        )}
      </div>
    </div>
  )
}
