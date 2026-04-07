import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/shared/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Plus, MoreHorizontal } from "lucide-react"
import { useCuisines, useCreateCuisine, useUpdateCuisine, useDeleteCuisine } from "@/entities/cuisine"
import type { Cuisine } from "@/entities/cuisine"

function CreateCuisineDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const createCuisine = useCreateCuisine()

  function handleSubmit() {
    if (!name || !slug) return
    createCuisine.mutate(
      { name, slug },
      {
        onSuccess: () => {
          setOpen(false)
          setName("")
          setSlug("")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2">
        <Button>
          <Plus className="size-4" />
          Добавить кухню
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая кухня</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Название</Label>
            <Input
              placeholder="Название кухни"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Slug</Label>
            <Input
              placeholder="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={createCuisine.isPending}>
            {createCuisine.isPending ? "Создание..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditCuisineDialog({ cuisine, onClose }: { cuisine: Cuisine; onClose: () => void }) {
  const [name, setName] = useState(cuisine.name)
  const [slug, setSlug] = useState(cuisine.slug)
  const updateCuisine = useUpdateCuisine()

  function handleSubmit() {
    updateCuisine.mutate(
      { id: cuisine.id, name, slug },
      { onSuccess: onClose }
    )
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Редактировать кухню</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label>Название</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} disabled={updateCuisine.isPending}>
          {updateCuisine.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function CuisineRow({ cuisine }: { cuisine: Cuisine }) {
  const [editOpen, setEditOpen] = useState(false)
  const deleteCuisine = useDeleteCuisine()

  return (
    <TableRow>
      <TableCell className="font-medium">{cuisine.name}</TableCell>
      <TableCell className="font-mono text-sm">{cuisine.slug}</TableCell>
      <TableCell>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Редактировать
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                onClick={() => deleteCuisine.mutate(cuisine.id)}
                className="text-destructive"
              >
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {editOpen && (
            <EditCuisineDialog cuisine={cuisine} onClose={() => setEditOpen(false)} />
          )}
        </Dialog>
      </TableCell>
    </TableRow>
  )
}

export function CuisinesPage() {
  const { data: cuisines, isLoading, isError } = useCuisines()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Кухни</h1>
          <p className="text-muted-foreground">Управление типами кухонь</p>
        </div>
        <CreateCuisineDialog />
      </div>

      {isLoading && (
        <div className="text-muted-foreground py-8 text-center text-sm">
          Загрузка...
        </div>
      )}

      {isError && (
        <div className="text-destructive py-8 text-center text-sm">
          Ошибка загрузки данных
        </div>
      )}

      {cuisines && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {cuisines.map((cuisine) => (
              <CuisineRow key={cuisine.id} cuisine={cuisine} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
