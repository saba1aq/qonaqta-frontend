import { useState } from "react"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Search } from "lucide-react"
import { useUsers } from "@/entities/user"

export function UsersPage() {
  const [search, setSearch] = useState("")
  const { data: users, isLoading, isError } = useUsers()

  const filtered = users?.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Пользователи</h1>
          <p className="text-muted-foreground">
            Управление пользователями платформы
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Поиск по имени или телефону..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
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

      {filtered && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Телефон</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Дата регистрации</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.phone}</TableCell>
                <TableCell className="font-medium">{user.name ?? "-"}</TableCell>
                <TableCell>
                  {user.is_superadmin && <Badge>Суперадмин</Badge>}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("ru-RU")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
