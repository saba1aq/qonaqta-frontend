export function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function generateTimeSlots(openTime: string, closeTime: string): string[] {
  const slots: string[] = []
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)

  let current = openH * 60 + openM
  const end = closeH * 60 + closeM
  const adjustedEnd = end <= current ? end + 24 * 60 : end

  while (current < adjustedEnd - 30) {
    const h = Math.floor(current / 60) % 24
    const m = current % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    current += 30
  }
  return slots
}
