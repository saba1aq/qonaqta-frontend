import { Globe, Instagram, MapPin } from "lucide-react";
import type { ProfileData } from "../model/types";

interface SocialLinksSectionProps {
  profile: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

const fields: {
  key: keyof ProfileData;
  label: string;
  icon: typeof Instagram;
  placeholder: string;
}[] = [
  { key: "socialInstagram", label: "Instagram", icon: Instagram, placeholder: "@username" },
  { key: "socialWebsite", label: "Вебсайт", icon: Globe, placeholder: "www.example.com" },
  { key: "social2gis", label: "2ГИС", icon: MapPin, placeholder: "Вставьте ссылку 2ГИС" },
  { key: "socialGoogleMaps", label: "Google Maps", icon: MapPin, placeholder: "Вставьте ссылку Google Maps" },
];

export function SocialLinksSection({ profile, onChange }: SocialLinksSectionProps) {
  return (
    <div className="rounded-2xl bg-[#FEFEFE] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-medium text-[#1C1C1C]">Ссылки</h3>

      <div className="mt-4 space-y-3">
        {fields.map(({ key, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F3F3F3]">
              <Icon className="size-4 text-[#1C1C1C]/40" />
            </div>
            <input
              type="text"
              value={profile[key] as string}
              onChange={(e) => onChange({ [key]: e.target.value })}
              placeholder={placeholder}
              className="h-12 flex-1 rounded-xl bg-[#F3F3F3] px-4 text-sm text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C]/20 focus:ring-2 focus:ring-[#EEC0FF]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
