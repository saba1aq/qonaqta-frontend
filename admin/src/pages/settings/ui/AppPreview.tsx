import type { ProfileData } from "../model/types";

interface AppPreviewProps {
  profile: ProfileData;
}

export function AppPreview({ profile }: AppPreviewProps) {
  const firstPhoto = profile.photos[0];

  return (
    <div className="sticky top-8 rounded-2xl bg-[#FEFEFE] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#1C1C1C]/40">Превью</span>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-green-400" />
          <span className="text-[11px] text-[#1C1C1C]/30">Live</span>
        </div>
      </div>

      <div className="mx-auto w-[280px] overflow-hidden rounded-3xl border border-[#1C1C1C]/[0.08]">
        {firstPhoto ? (
          <img src={firstPhoto} alt="" className="h-[140px] w-full object-cover" />
        ) : (
          <div className="h-[140px] bg-gradient-to-br from-amber-200 to-orange-300" />
        )}

        <div className="space-y-3 p-4">
          <h4 className="text-[17px] font-medium text-[#1C1C1C]">
            {profile.name || "Название ресторана"}
          </h4>

          {profile.description && (
            <p className="line-clamp-2 text-[13px] leading-snug text-[#1C1C1C]/50">
              {profile.description}
            </p>
          )}

          {profile.cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.cuisineTypes.map((c) => (
                <span key={c} className="rounded-md bg-[#F3F3F3] px-2 py-0.5 text-[11px] text-[#1C1C1C]/60">
                  {c}
                </span>
              ))}
            </div>
          )}

          <button className="flex h-11 w-full items-center justify-center rounded-xl bg-[#232323] text-sm font-medium text-white">
            Забронировать
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-[#1C1C1C]/25">
        Так гости увидят ваш ресторан
      </p>
    </div>
  );
}
