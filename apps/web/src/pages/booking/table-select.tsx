import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useFloors } from '@/entities/restaurant'
import type { Table, FloorDecoration } from '@/entities/restaurant'
import { useBookingFormStore } from '@/features/book-table'
import { Button } from '@qonaqta/ui/components/button'

function DecorationIcon({ type }: { type: FloorDecoration['type'] }) {
  switch (type) {
    case 'wc':
      return <span className="text-[10px] font-bold">WC</span>
    case 'plant':
      return <span className="text-xs">🌿</span>
    case 'bar':
      return <span className="text-[10px] font-bold">BAR</span>
    case 'entrance':
      return <span className="text-[10px] font-bold">→</span>
    case 'stage':
      return <span className="text-[10px] font-bold">🎤</span>
    case 'wall':
      return null
  }
}

function TableElement({
  table,
  isSelected,
  onSelect,
  guestCount,
}: {
  table: Table
  isSelected: boolean
  onSelect: () => void
  guestCount: number
}) {
  const isAvailable = table.is_active && table.booking_enabled && table.seats >= guestCount
  const shapeClass = table.shape === 'circle' ? 'rounded-full' : 'rounded-lg'

  return (
    <button
      disabled={!isAvailable}
      onClick={onSelect}
      className={`absolute flex items-center justify-center text-[10px] font-medium transition-all border-2 ${shapeClass} ${
        isSelected
          ? 'bg-foreground text-white border-foreground shadow-lg z-10'
          : isAvailable
            ? 'bg-white border-border hover:border-foreground/50 text-foreground'
            : 'bg-muted/50 border-muted text-muted-foreground/50'
      }`}
      style={{
        left: table.x,
        top: table.y,
        width: table.width,
        height: table.height,
        transform: table.rotation ? `rotate(${table.rotation}deg)` : undefined,
      }}
    >
      <div className="flex flex-col items-center leading-tight">
        <span>{table.label}</span>
        <span className="text-[8px] opacity-70">{table.seats}м</span>
      </div>
    </button>
  )
}

export function TableSelectPage() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const navigate = useNavigate()
  const { data: floors, isLoading } = useFloors(slug)
  const { selectedTableId, selectTable, guestCount } = useBookingFormStore()
  const [activeFloorIdx, setActiveFloorIdx] = useState(0)

  const activeFloor = floors?.[activeFloorIdx]

  const selectedTable = useMemo(() => {
    if (!activeFloor || !selectedTableId) return null
    return activeFloor.tables.find((t) => t.id === selectedTableId) ?? null
  }, [activeFloor, selectedTableId])

  const floorBounds = useMemo(() => {
    if (!activeFloor) return { width: 400, height: 400 }
    let maxX = 400
    let maxY = 400
    for (const t of activeFloor.tables) {
      maxX = Math.max(maxX, t.x + t.width + 20)
      maxY = Math.max(maxY, t.y + t.height + 20)
    }
    for (const d of activeFloor.decorations) {
      maxX = Math.max(maxX, d.x + d.width + 20)
      maxY = Math.max(maxY, d.y + d.height + 20)
    }
    return { width: maxX, height: maxY }
  }, [activeFloor])

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Link
          to="/restaurant/$slug/book"
          params={{ slug }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-semibold">Выбор столика</h1>
      </div>

      {floors && floors.length > 1 && (
        <div className="flex gap-2 px-4 pt-3 overflow-x-auto scrollbar-none">
          {floors.map((floor, idx) => (
            <button
              key={floor.id}
              onClick={() => {
                setActiveFloorIdx(idx)
                selectTable(null)
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                idx === activeFloorIdx
                  ? 'bg-foreground text-white border-foreground'
                  : 'bg-white text-foreground border-border'
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {isLoading ? (
          <div className="h-[400px] bg-muted rounded-xl animate-pulse" />
        ) : activeFloor ? (
          <div className="overflow-auto rounded-xl border border-border bg-secondary/30">
            <div
              className="relative"
              style={{ width: floorBounds.width, height: floorBounds.height, minWidth: '100%' }}
            >
              {activeFloor.decorations.map((deco) => (
                <div
                  key={deco.id}
                  className={`absolute flex items-center justify-center text-muted-foreground ${
                    deco.type === 'wall'
                      ? 'bg-muted-foreground/20'
                      : 'bg-secondary border border-border rounded-lg'
                  }`}
                  style={{
                    left: deco.x,
                    top: deco.y,
                    width: deco.width,
                    height: deco.height,
                    transform: deco.rotation ? `rotate(${deco.rotation}deg)` : undefined,
                  }}
                >
                  <DecorationIcon type={deco.type} />
                </div>
              ))}

              {activeFloor.tables.map((table) => (
                <TableElement
                  key={table.id}
                  table={table}
                  isSelected={table.id === selectedTableId}
                  onSelect={() => selectTable(table.id)}
                  guestCount={guestCount}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Нет данных о зале</p>
        )}

        {selectedTable && (
          <div className="mt-4 p-3 bg-secondary rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold">{selectedTable.label}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {selectedTable.seats} мест
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-4 bg-white border-t">
        <Button
          className="w-full h-12 rounded-xl text-sm font-semibold"
          disabled={!selectedTableId}
          onClick={() => navigate({ to: '/restaurant/$slug/book/confirm', params: { slug } })}
        >
          Забронировать столик
        </Button>
      </div>
    </div>
  )
}
