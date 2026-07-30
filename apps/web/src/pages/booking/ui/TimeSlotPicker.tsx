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
      <h3 className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft mb-3">
        Время
      </h3>
      {slots.length === 0 ? (
        <p className="text-[14px] text-ink-soft border-2 border-dashed border-ink px-4 py-5 text-center">
          Нет доступного времени на этот день
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => onSelect(slot)}
              className={`font-stamp font-medium text-[15px] tracking-[0.03em] px-4 py-2.5 border-2 transition-all ${
                slot === selected
                  ? 'bg-riso-pink text-paper-3 border-riso-pink'
                  : 'bg-paper-3 border-ink hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_#f4b71a]'
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
