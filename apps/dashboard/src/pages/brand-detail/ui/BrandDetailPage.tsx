import { Link, useParams } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@qonaqta/ui/components/tabs"
import { useBrand } from "@/features/brands"
import { useBranchesByBrand } from "@/features/branches"
import { useStaffByBrand } from "@/features/staff"
import { BasicInfoTab } from "./BasicInfoTab"
import { BranchesTab } from "./BranchesTab"
import { AdminsTab } from "./AdminsTab"

export function BrandDetailPage() {
  const { brandId } = useParams({ from: "/layout/brands/$brandId" })
  const id = Number(brandId)

  const { data: brand, isLoading } = useBrand(id)
  const { data: branches } = useBranchesByBrand(id)
  const { data: staff } = useStaffByBrand(id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-60 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
        <p className="text-[15px] font-semibold text-neutral-900">Бренд не найден</p>
        <Link to="/brands" className="mt-3 text-[13px] text-neutral-500 underline underline-offset-4">
          Все бренды
        </Link>
      </div>
    )
  }

  const branchCount = branches?.length ?? 0
  const staffCount = staff?.length ?? 0

  return (
    <div>
      <Link
        to="/brands"
        className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="size-4" />
        Все бренды
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-900">
          <span className="text-[18px] font-bold text-white">
            {brand.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              {brand.name}
            </h1>
            {!brand.is_active && (
              <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-500">
                неактивен
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[13px] text-neutral-400 font-mono">{brand.slug}</p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="mt-6">
        <TabsList variant="line" className="border-b border-neutral-100">
          <TabsTrigger value="basic">Основное</TabsTrigger>
          <TabsTrigger value="branches">
            Филиалы
            {branchCount > 0 && (
              <span className="ml-1 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                {branchCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="admins">
            Админы
            {staffCount > 0 && (
              <span className="ml-1 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                {staffCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <BasicInfoTab brand={brand} />
        </TabsContent>
        <TabsContent value="branches" className="mt-6">
          <BranchesTab brandId={id} />
        </TabsContent>
        <TabsContent value="admins" className="mt-6">
          <AdminsTab brandId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
