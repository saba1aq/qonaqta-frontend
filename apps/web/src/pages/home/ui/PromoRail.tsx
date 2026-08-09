import { Link } from '@tanstack/react-router'
import { usePromotions } from '@/entities/promotion'
import type { Promotion, PromotionKind } from '@/entities/promotion'

const KIND_LABEL: Record<PromotionKind, string> = {
  discount: 'Скидка',
  promo: 'Акция',
  event: 'Событие',
}

function PromoCard({ promo }: { promo: Promotion }) {
  return (
    <Link
      to="/restaurant/$id"
      params={{ id: String(promo.branch.id) }}
      className="w-[268px] shrink-0 flex flex-col bg-paper-3 border-2 border-ink"
    >
      <div className="flex-1 p-4">
        <span className="inline-block bg-lilac text-ink font-stamp font-semibold uppercase tracking-[0.13em] text-[11px] leading-none px-2.5 py-1">
          {KIND_LABEL[promo.kind]}
        </span>
        <h3 className="font-display font-bold tracking-[-0.035em] text-[22px] leading-[1.05] mt-[13px]">
          {promo.title}
        </h3>
        {promo.description && (
          <p className="text-[13px] text-ink-soft mt-[7px]">{promo.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t-2 border-ink px-4 py-2.5">
        <span className="font-stamp font-semibold uppercase tracking-[0.1em] text-[12.5px] truncate">
          {promo.branch.name}
        </span>
        <span aria-hidden="true" className="shrink-0 text-[13px]">
          →
        </span>
      </div>
    </Link>
  )
}

export function PromoRail({ cityId }: { cityId?: number }) {
  const { data, isLoading, isError } = usePromotions(cityId)

  if (isError) return null
  if (!isLoading && (data?.length ?? 0) === 0) return null

  return (
    <section className="mt-7">
      <h2 className="font-display font-bold tracking-[-0.035em] text-[clamp(20px,3.2vw,28px)] mb-4">
        Афиша
      </h2>

      <div className="-mx-[clamp(18px,4vw,44px)] px-[clamp(18px,4vw,44px)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 pb-2 min-w-max">
          {isLoading
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[268px] h-[150px] shrink-0 border-2 border-ink bg-paper-2 animate-pulse"
                />
              ))
            : data?.map((promo) => <PromoCard key={promo.id} promo={promo} />)}
        </div>
      </div>
    </section>
  )
}
