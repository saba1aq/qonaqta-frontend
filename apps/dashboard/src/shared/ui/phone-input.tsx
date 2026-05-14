import { forwardRef } from "react"
import { Input } from "@qonaqta/ui/components/input"
import { formatPhone } from "@/shared/lib/format-phone"

type Props = Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: string
  onChange: (formatted: string) => void
}

export const PhoneInput = forwardRef<HTMLInputElement, Props>(function PhoneInput(
  { value, onChange, placeholder = "+7 (700) 000-00-00", ...rest },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="tel"
      inputMode="tel"
      placeholder={placeholder}
      value={formatPhone(value)}
      onChange={(e) => onChange(formatPhone(e.target.value))}
      {...rest}
    />
  )
})
