import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Badge } from "@/shared/ui/badge"
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
import { useCities, useCreateCity, useUpdateCity, useDeleteCity } from "@/entities/city"
import type { City } from "@/entities/city"

function CreateCityDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const createCity = useCreateCity()

  function handleSubmit() {
    if (!name || !slug) return
    createCity.mutate(
      { name, slug, sort_order: sortOrder ? Number(sortOrder) : undefined },
      {
        onSuccess: () => {
          setOpen(false)
          setName("")
          setSlug("")
          setSortOrder("")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2">
        <Button>
          <Plus className="size-4" />
          Добавить город
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый город</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Название</Label>
            <Input
              placeholder="Название города"
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
          <div className="flex flex-col gap-2">
            <Label>Порядок сортировки</Label>
            <Input
              type="number"
              placeholder="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={createCity.isPending}>
            {createCity.isPending ? "Создание..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditCityDialog({ city, onClose }: { city: City; onClose: () => void }) {
  const [name, setName] = useState(city.name)
  const [slug, setSlug] = useState(city.slug)
  const [sortOrder, setSortOrder] = useState(String(city.sort_order))
  const updateCity = useUpdateCity()

  function handleSubmit() {
    updateCity.mutate(
      { id: city.id, name, slug, sort_order: Number(sortOrder) },
      { onSuccess: onClose }
    )
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Редактировать город</DialogTitle>
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
        <div className="flex flex-col gap-2">
          <Label>Порядок сортировки</Label>
          <Input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} disabled={updateCity.isPending}>
          {updateCity.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function CityRow({ city }: { city: City }) {
  const [editOpen, setEditOpen] = useState(false)
  const updateCity = useUpdateCity()
  const deleteCity = useDeleteCity()

  function toggleActive() {
    updateCity.mutate({ id: city.id, is_active: !city.is_active })
  }

  function handleDelete() {
    deleteCity.mutate(city.id)
  }

  return (
    <TableRow key={city.id}>
      <TableCell className="font-medium">{city.name}</TableCell>
      <TableCell className="font-mono text-sm">{city.slug}</TableCell>
      <TableCell>
        <Badge variant={city.is_active ? "default" : "secondary"}>
          {city.is_active ? "Активен" : "Неактивен"}
        </Badge>
      </TableCell>
      <TableCell>{city.sort_order}</TableCell>
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
              <DropdownMenuItem onClick={toggleActive}>
                {city.is_active ? "Деактивировать" : "Активировать"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {editOpen && (
            <EditCityDialog city={city} onClose={() => setEditOpen(false)} />
          )}
        </Dialog>
      </TableCell>
    </TableRow>
  )
}

export function CitiesPage() {
  const { data: cities, isLoading, isError } = useCities()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Города</h1>
          <p className="text-muted-foreground">Управление городами платформы</p>
        </div>
        <CreateCityDialog />
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

      {cities && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Сортировка</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <CityRow key={city.id} city={city} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
