import {
  type ReactNode,
  type ComponentProps,
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react"

import { cn } from "@/shared/lib/utils"

type DropdownContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextType>({
  open: false,
  setOpen: () => {},
})

function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

function DropdownMenuTrigger({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  const { open, setOpen } = useContext(DropdownContext)
  return (
    <button
      type="button"
      aria-expanded={open}
      className={className}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({
  children,
  className,
  align = "end",
}: {
  children: ReactNode
  className?: string
  align?: "start" | "end"
}) {
  const { open } = useContext(DropdownContext)
  if (!open) return null

  return (
    <div
      className={cn(
        "bg-popover text-popover-foreground absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useContext(DropdownContext)
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(false)
      }}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("bg-border -mx-1 my-1 h-px", className)} />
}

function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
