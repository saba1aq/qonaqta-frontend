import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { ProfileData } from "../model/types";
import { CUISINE_OPTIONS } from "../model/constants";

interface BasicInfoSectionProps {
  profile: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function BasicInfoSection({ profile, onChange }: BasicInfoSectionProps) {
  const [cuisineOpen, setCuisineOpen] = useState(false);

  const removeCuisine = (c: string) => {
    onChange({ cuisineTypes: profile.cuisineTypes.filter((t) => t !== c) });
  };

  const addCuisine = (c: string) => {
    if (!profile.cuisineTypes.includes(c)) {
      onChange({ cuisineTypes: [...profile.cuisineTypes, c] });
    }
    setCuisineOpen(false);
  };

  return (
    <div className="rounded-2xl bg-[#FEFEFE] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-medium text-[#1C1C1C]">Основная информация</h3>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Название ресторана</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="h-12 w-full rounded-xl bg-[#F3F3F3] px-4 text-[15px] font-medium text-[#1C1C1C] outline-none transition-colors focus:ring-2 focus:ring-[#EEC0FF]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Описание</label>
          <textarea
            value={profile.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
            className="w-full resize-none rounded-xl bg-[#F3F3F3] px-4 py-3 text-sm leading-relaxed text-[#1C1C1C] outline-none transition-colors focus:ring-2 focus:ring-[#EEC0FF]"
          />
        </div>

        <div className="relative">
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Тип кухни</label>
          <div
            onClick={() => setCuisineOpen(!cuisineOpen)}
            className="flex min-h-12 cursor-pointer flex-wrap items-center gap-1.5 rounded-xl bg-[#F3F3F3] px-3 py-2"
          >
            {profile.cuisineTypes.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1 rounded-lg bg-[#232323] px-2.5 py-1 text-xs font-medium text-white"
              >
                {c}
                <button onClick={(e) => { e.stopPropagation(); removeCuisine(c); }}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <ChevronDown className="ml-auto size-4 text-[#1C1C1C]/30" />
          </div>
          {cuisineOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setCuisineOpen(false)} />
              <div className="absolute z-20 mt-1 w-full rounded-xl border border-[#F3F3F3] bg-[#FEFEFE] py-1 shadow-lg">
                {CUISINE_OPTIONS.filter((c) => !profile.cuisineTypes.includes(c)).map((c) => (
                  <button
                    key={c}
                    onClick={() => addCuisine(c)}
                    className="w-full px-4 py-2 text-left text-sm text-[#1C1C1C] transition-colors hover:bg-[#F3F3F3]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
