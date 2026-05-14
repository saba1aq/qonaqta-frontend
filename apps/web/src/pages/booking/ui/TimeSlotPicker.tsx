export function TimeSlotPicker({
  slots,
  selected,
  onSelect,
}: {
  slots: string[]
  selected: string | null
  onSelect: (slot: string) => void
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Время</h3>
      {slots.length === 0 ? (
        <p className="text-sm text-muted-foreground">Нет доступного времени</p>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => onSelect(slot)}
              className={`h-10 rounded-lg text-sm font-medium border transition-colors ${
                slot === selected
                  ? 'bg-foreground text-white border-foreground'
                  : 'bg-white text-foreground border-border hover:bg-secondary'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
