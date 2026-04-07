import { MapPin } from "lucide-react";
import type { ProfileData } from "../model/types";

interface LocationSectionProps {
  profile: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function LocationSection({ profile, onChange }: LocationSectionProps) {
  return (
    <div className="rounded-2xl bg-[#FEFEFE] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-medium text-[#1C1C1C]">Местоположение</h3>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Адрес</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1C1C1C]/30" />
            <input
              type="text"
              value={profile.address}
              onChange={(e) => onChange({ address: e.target.value })}
              className="h-12 w-full rounded-xl bg-[#F3F3F3] pl-11 pr-4 text-sm text-[#1C1C1C] outline-none focus:ring-2 focus:ring-[#EEC0FF]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
