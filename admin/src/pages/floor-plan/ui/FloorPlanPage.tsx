import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { FloorPlanEditor, type FloorObject } from "@/widgets/floor-plan-editor"
import { apiClient } from "@/shared/api"

interface ApiTable {
  id: number
  number: number
  seats: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  shape: "rect" | "circle"
  is_active: boolean
}

interface ApiDecoration {
  id: number
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  shape: "rect" | "circle"
}

interface ApiFloor {
  id: number
  name: string
  floor_number: number
  tables: ApiTable[]
  decorations: ApiDecoration[]
}

function tableToFloorObject(table: ApiTable): FloorObject {
  return {
    id: `table-${table.id}`,
    x: table.x,
    y: table.y,
    width: table.width,
    height: table.height,
    rotation: table.rotation,
    shape: table.shape,
    type: "table",
    seats: table.seats,
    label: `Стол ${table.number}`,
  }
}

function decorationToFloorObject(dec: ApiDecoration): FloorObject {
  return {
    id: `dec-${dec.id}`,
    x: dec.x,
    y: dec.y,
    width: dec.width,
    height: dec.height,
    rotation: dec.rotation,
    shape: dec.shape ?? "rect",
    type: dec.type as FloorObject["type"],
    seats: 0,
    label: dec.type,
  }
}

async function fetchAdminContext() {
  const { data: restaurants } = await apiClient.get("/admin/restaurants")
  const restaurant = restaurants[0]
  if (!restaurant) return { branchId: null }
  const { data: branches } = await apiClient.get(`/admin/restaurants/${restaurant.id}/branches`)
  return { branchId: branches[0]?.id ?? null }
}

export function FloorPlanPage() {
  const queryClient = useQueryClient()
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null)

  const { data: context } = useQuery({
    queryKey: ["admin-context"],
    queryFn: fetchAdminContext,
    staleTime: Infinity,
  })

  const branchId = context?.branchId

  const { data: floors = [], isLoading } = useQuery({
    queryKey: ["floors", branchId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/branches/${branchId}/floors`)
      return data as ApiFloor[]
    },
    enabled: !!branchId,
  })

  useEffect(() => {
    if (floors.length > 0 && selectedFloorId === null) {
      setSelectedFloorId(floors[0].id)
    }
  }, [floors, selectedFloorId])

  const activeFloor = floors.find((f) => f.id === selectedFloorId) ?? floors[0] ?? null

  const initialObjects: FloorObject[] = activeFloor
    ? [
        ...activeFloor.tables.map(tableToFloorObject),
        ...activeFloor.decorations.map(decorationToFloorObject),
      ]
    : []

  const saveMutation = useMutation({
    mutationFn: async (objects: FloorObject[]) => {
      if (!activeFloor) return

      const existingTableIds = new Set(activeFloor.tables.map((t: ApiTable) => `table-${t.id}`))
      const existingDecIds = new Set(activeFloor.decorations.map((d: ApiDecoration) => `dec-${d.id}`))

      const newTables = objects.filter((o) => o.type === "table" && o.id.startsWith("new-"))
      const updatedTables = objects.filter(
        (o) => o.type === "table" && existingTableIds.has(o.id)
      )
      const deletedTableIds = activeFloor.tables
        .filter((t: ApiTable) => !objects.find((o) => o.id === `table-${t.id}`))
        .map((t: ApiTable) => t.id)

      const newDecs = objects.filter((o) => o.type !== "table" && o.id.startsWith("new-"))
      const updatedDecs = objects.filter(
        (o) => o.type !== "table" && existingDecIds.has(o.id)
      )
      const deletedDecIds = activeFloor.decorations
        .filter((d: ApiDecoration) => !objects.find((o) => o.id === `dec-${d.id}`))
        .map((d: ApiDecoration) => d.id)

      const promises: Promise<unknown>[] = []

      for (const t of newTables) {
        const num = parseInt(t.label.replace(/\D/g, "")) || 1
        promises.push(
          apiClient.post("/admin/tables", {
            floor_id: activeFloor.id,
            number: num,
            seats: t.seats,
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
            rotation: t.rotation,
            shape: t.shape,
          })
        )
      }

      for (const t of updatedTables) {
        const id = parseInt(t.id.replace("table-", ""))
        promises.push(
          apiClient.put(`/admin/tables/${id}`, {
            seats: t.seats,
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
            rotation: t.rotation,
            shape: t.shape,
          })
        )
      }

      for (const id of deletedTableIds) {
        promises.push(apiClient.delete(`/admin/tables/${id}`))
      }

      for (const d of newDecs) {
        promises.push(
          apiClient.post("/admin/decorations", {
            floor_id: activeFloor.id,
            type: d.type,
            x: d.x,
            y: d.y,
            width: d.width,
            height: d.height,
            rotation: d.rotation,
            shape: d.shape,
          })
        )
      }

      for (const d of updatedDecs) {
        const id = parseInt(d.id.replace("dec-", ""))
        promises.push(
          apiClient.put(`/admin/decorations/${id}`, {
            type: d.type,
            x: d.x,
            y: d.y,
            width: d.width,
            height: d.height,
            rotation: d.rotation,
            shape: d.shape,
          })
        )
      }

      for (const id of deletedDecIds) {
        promises.push(apiClient.delete(`/admin/decorations/${id}`))
      }

      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors", branchId] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-48px)] items-center justify-center text-[#1C1C1C]/30">
        Загрузка...
      </div>
    )
  }

  if (!activeFloor && !isLoading) {
    return (
      <div className="flex h-[calc(100svh-48px)] items-center justify-center text-[#1C1C1C]/30">
        Нет данных о залах
      </div>
    )
  }

  return (
    <FloorPlanEditor
      initialObjects={initialObjects}
      onSave={(updated) => saveMutation.mutate(updated)}
    />
  )
}
