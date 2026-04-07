import {
  type ReactNode,
  type ComponentProps,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"

import { cn } from "@/shared/lib/utils"

type DialogContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType>({
  open: false,
  setOpen: () => {},
})

function Dialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = useCallback(
    (value: boolean) => {
      setInternalOpen(value)
      onOpenChange?.(value)
    },
    [onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useContext(DialogContext)
  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { open, setOpen } = useContext(DialogContext)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "bg-background relative z-50 w-full max-w-lg rounded-lg border p-6 shadow-lg",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2", className)}
      {...props}
    />
  )
}

function DialogClose({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  const { setOpen } = useContext(DialogContext)
  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
