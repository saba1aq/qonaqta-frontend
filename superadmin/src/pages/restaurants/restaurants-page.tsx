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
} from "@/shared/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { ChevronDown, ChevronRight, MoreHorizontal, Loader2 } from "lucide-react"
import {
  useRestaurants,
  useRestaurantBranches,
  useUpdateRestaurant,
  useUpdateBranch,
} from "@/entities/restaurant"
import type { Restaurant, Branch } from "@/entities/restaurant"

function EditRestaurantDialog({
  restaurant,
  onClose,
}: {
  restaurant: Restaurant
  onClose: () => void
}) {
  const [name, setName] = useState(restaurant.name)
  const [description, setDescription] = useState(restaurant.description ?? "")
  const updateRestaurant = useUpdateRestaurant()

  function handleSubmit() {
    updateRestaurant.mutate(
      { id: restaurant.id, name, description },
      { onSuccess: onClose }
    )
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Редактировать ресторан</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label>Название</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Описание</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} disabled={updateRestaurant.isPending}>
          {updateRestaurant.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function EditBranchDialog({
  branch,
  restaurantId,
  onClose,
}: {
  branch: Branch
  restaurantId: string
  onClose: () => void
}) {
  const [name, setName] = useState(branch.name)
  const [address, setAddress] = useState(branch.address)
  const updateBranch = useUpdateBranch()

  function handleSubmit() {
    updateBranch.mutate(
      { id: branch.id, restaurantId, name, address },
      { onSuccess: onClose }
    )
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Редактировать филиал</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label>Название</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Адрес</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} disabled={updateBranch.isPending}>
          {updateBranch.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function BranchRows({
  restaurantId,
}: {
  restaurantId: string
}) {
  const { data: branches, isLoading } = useRestaurantBranches(restaurantId)
  const updateBranch = useUpdateBranch()
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)

  if (isLoading) {
    return (
      <TableRow className="bg-muted/30">
        <TableCell colSpan={7} className="pl-8 py-3">
          <Loader2 className="size-4 animate-spin" />
        </TableCell>
      </TableRow>
    )
  }

  if (!branches || branches.length === 0) {
    return (
      <TableRow className="bg-muted/30">
        <TableCell colSpan={7} className="text-muted-foreground pl-8 py-3 text-sm">
          Нет филиалов
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {branches.map((branch) => (
        <TableRow key={branch.id} className="bg-muted/30">
          <TableCell />
          <TableCell className="pl-8 text-sm">{branch.name}</TableCell>
          <TableCell />
          <TableCell className="text-sm">{branch.address}</TableCell>
          <TableCell>
            <Badge variant={branch.is_active ? "default" : "secondary"}>
              {branch.is_active ? "Активен" : "Неактивен"}
            </Badge>
          </TableCell>
          <TableCell />
          <TableCell>
            <Dialog
              open={editingBranch?.id === branch.id}
              onOpenChange={(open) => {
                if (!open) setEditingBranch(null)
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DialogTrigger>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setEditingBranch(branch)
                      }}
                    >
                      Редактировать
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem
                    onClick={() =>
                      updateBranch.mutate({
                        id: branch.id,
                        restaurantId,
                        is_active: !branch.is_active,
                      })
                    }
                  >
                    {branch.is_active ? "Деактивировать" : "Активировать"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {editingBranch?.id === branch.id && (
                <EditBranchDialog
                  branch={branch}
                  restaurantId={restaurantId}
                  onClose={() => setEditingBranch(null)}
                />
              )}
            </Dialog>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function RestaurantRow({ restaurant }: { restaurant: Restaurant }) {
  const [expanded, setExpanded] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const updateRestaurant = useUpdateRestaurant()

  return (
    <>
      <TableRow>
        <TableCell>
          <button onClick={() => setExpanded((v) => !v)}>
            {expanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        </TableCell>
        <TableCell className="font-medium">{restaurant.name}</TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {restaurant.description ?? "-"}
        </TableCell>
        <TableCell />
        <TableCell>
          <Badge variant={restaurant.is_active ? "default" : "secondary"}>
            {restaurant.is_active ? "Активен" : "Неактивен"}
          </Badge>
        </TableCell>
        <TableCell />
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
                  onClick={() =>
                    updateRestaurant.mutate({
                      id: restaurant.id,
                      is_active: !restaurant.is_active,
                    })
                  }
                >
                  {restaurant.is_active ? "Деактивировать" : "Активировать"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {editOpen && (
              <EditRestaurantDialog
                restaurant={restaurant}
                onClose={() => setEditOpen(false)}
              />
            )}
          </Dialog>
        </TableCell>
      </TableRow>
      {expanded && <BranchRows restaurantId={restaurant.id} />}
    </>
  )
}

export function RestaurantsPage() {
  const { data: restaurants, isLoading, isError } = useRestaurants()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Рестораны</h1>
          <p className="text-muted-foreground">Управление ресторанами платформы</p>
        </div>
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

      {restaurants && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Название</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Филиалы</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.map((restaurant) => (
              <RestaurantRow key={restaurant.id} restaurant={restaurant} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
