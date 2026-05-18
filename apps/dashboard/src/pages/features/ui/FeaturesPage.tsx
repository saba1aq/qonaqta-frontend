import { useState, useRef, useEffect } from "react"
import { Plus, Search, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@qonaqta/ui/components/button"
import { Input } from "@qonaqta/ui/components/input"
import {
  useFeatures,
  useCreateFeature,
  useToggleFeatureActive,
  useDeleteFeature,
  useUpdateFeature,
  type Feature,
} from "@/features/features-catalog"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
        з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
        п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
        ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      }
      return map[ch] ?? ch
    })
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
}

export function FeaturesPage() {
  const { data: features, isLoading } = useFeatures()
  const toggleActive = useToggleFeatureActive()
  const deleteFeature = useDeleteFeature()
  const [search, setSearch] = useState("")
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [newIcon, setNewIcon] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [editIcon, setEditIcon] = useState("")
  const nameInputRef = useRef<HTMLInputElement>(null)
  const editNameRef = useRef<HTMLInputElement>(null)

  const createMutation = useCreateFeature(() => {
    setAdding(false)
    setNewName("")
    setNewSlug("")
    setNewIcon("")
  })

  const updateMutation = useUpdateFeature(() => {
    setEditingId(null)
  })

  useEffect(() => {
    if (adding) nameInputRef.current?.focus()
  }, [adding])

  useEffect(() => {
    if (editingId) editNameRef.current?.focus()
  }, [editingId])

  const handleCreate = () => {
    if (!newName.trim()) return
    createMutation.mutate({
      name: newName.trim(),
      slug: newSlug.trim() || slugify(newName),
      icon: newIcon.trim(),
    })
  }

  const handleUpdate = () => {
    if (!editingId || !editName.trim()) return
    updateMutation.mutate({
      id: editingId,
      payload: {
        name: editName.trim(),
        slug: editSlug.trim() || undefined,
        icon: editIcon,
      },
    })
  }

  const startEdit = (feature: Feature) => {
    setEditingId(feature.id)
    setEditName(feature.name)
    setEditSlug(feature.slug)
    setEditIcon(feature.icon)
    setAdding(false)
  }

  const filtered = features?.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Особенности</h1>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {features?.length ? `${features.length} особенностей` : "Управление особенностями ресторанов"}
          </p>
        </div>
        <Button
          onClick={() => { setAdding(true); setEditingId(null) }}
          className="gap-1.5 rounded-xl bg-neutral-900 text-[13px] text-white hover:bg-neutral-800"
        >
          <Plus className="size-4" />
          Добавить
        </Button>
      </div>

      {features && features.length > 0 && (
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-neutral-200 bg-white pl-10 text-[13px] placeholder:text-neutral-300 focus-visible:border-neutral-300 focus-visible:ring-neutral-200/50"
          />
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[52px] animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="text-left px-4 py-3 font-medium text-neutral-500 w-16">ID</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500 w-16">Иконка</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Название</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Slug</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-500 w-24">Активна</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((feature) => (
                <tr key={feature.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                  <td className="px-4 py-3 text-neutral-400 tabular-nums">{feature.id}</td>
                  {editingId === feature.id ? (
                    <>
                      <td className="px-4 py-1.5">
                        <input
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); if (e.key === "Escape") setEditingId(null) }}
                          maxLength={4}
                          className="h-8 w-full rounded-lg border border-neutral-300 px-2 text-center text-base outline-none focus:border-neutral-400"
                        />
                      </td>
                      <td className="px-4 py-1.5">
                        <input
                          ref={editNameRef}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); if (e.key === "Escape") setEditingId(null) }}
                          className="h-8 w-full rounded-lg border border-neutral-300 px-2 text-sm outline-none focus:border-neutral-400"
                        />
                      </td>
                      <td className="px-4 py-1.5">
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); if (e.key === "Escape") setEditingId(null) }}
                          className="h-8 w-full rounded-lg border border-neutral-300 px-2 text-sm font-mono outline-none focus:border-neutral-400"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-center text-[18px]">{feature.icon || <span className="text-neutral-300 text-xs">—</span>}</td>
                      <td className="px-4 py-3 font-medium text-neutral-900">{feature.name}</td>
                      <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{feature.slug}</td>
                    </>
                  )}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive.mutate({ id: feature.id, is_active: !feature.is_active })}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                        feature.is_active ? "bg-neutral-900" : "bg-neutral-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                          feature.is_active ? "translate-x-4" : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === feature.id ? (
                        <>
                          <button onClick={handleUpdate} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                            <Check className="size-3.5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                            <X className="size-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(feature)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm("Удалить особенность?")) deleteFeature.mutate(feature.id) }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {adding && (
                <tr className="bg-neutral-50/30">
                  <td className="px-4 py-1.5 text-neutral-300 text-xs">new</td>
                  <td className="px-4 py-1.5">
                    <input
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setAdding(false); setNewName(""); setNewSlug(""); setNewIcon("") } }}
                      placeholder="🌿"
                      maxLength={4}
                      className="h-8 w-full rounded-lg border border-neutral-300 px-2 text-center text-base outline-none focus:border-neutral-400 placeholder:text-neutral-300"
                    />
                  </td>
                  <td className="px-4 py-1.5">
                    <input
                      ref={nameInputRef}
                      value={newName}
                      onChange={(e) => { setNewName(e.target.value); setNewSlug(slugify(e.target.value)) }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setAdding(false); setNewName(""); setNewSlug(""); setNewIcon("") } }}
                      placeholder="Название"
                      className="h-8 w-full rounded-lg border border-neutral-300 px-2 text-sm outline-none focus:border-neutral-400 placeholder:text-neutral-300"
                    />
                  </td>
                  <td className="px-4 py-1.5">
                    <input
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setAdding(false); setNewName(""); setNewSlug(""); setNewIcon("") } }}
                      placeholder="slug"
                      className="h-8 w-full rounded-lg border border-neutral-300 px-2 text-sm font-mono outline-none focus:border-neutral-400 placeholder:text-neutral-300"
                    />
                  </td>
                  <td></td>
                  <td className="px-4 py-1.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={handleCreate}
                        disabled={!newName.trim() || createMutation.isPending}
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-30"
                      >
                        <Check className="size-3.5" />
                      </button>
                      <button
                        onClick={() => { setAdding(false); setNewName(""); setNewSlug(""); setNewIcon("") }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
