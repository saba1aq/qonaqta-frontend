export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 1) return `+${digits}`
  if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`
  if (digits.length <= 7)
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`
  if (digits.length <= 9)
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
}

export function normalizePhone(formatted: string): string {
  const digits = formatted.replace(/\D/g, "")
  if (!digits) return ""
  return `+${digits}`
}
