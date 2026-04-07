import { Globe, Instagram, Map, MapPin, Phone } from "lucide-react";
import type { ContactsData, ProfileData } from "../model/types";

interface ContactsAndLinksSectionProps {
  profile: ProfileData;
  onProfileChange: (updates: Partial<ProfileData>) => void;
  contacts: ContactsData;
  onContactsChange: (contacts: ContactsData) => void;
}

const WhatsAppIcon = () => (
  <svg className="size-4 text-[#1C1C1C]/30" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.54-1.472A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.326-.726-6.016-1.956l-.42-.312-2.69.872.896-2.632-.344-.446A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="size-4 text-[#1C1C1C]/30" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.55a8.17 8.17 0 004.76 1.52V6.69h-1z" />
  </svg>
);

export function ContactsAndLinksSection({
  profile,
  onProfileChange,
  contacts,
  onContactsChange,
}: ContactsAndLinksSectionProps) {
  const updateContact = (field: keyof ContactsData, value: string) => {
    onContactsChange({ ...contacts, [field]: value });
  };

  const inputClass = "h-12 w-full rounded-xl bg-[#F3F3F3] pl-11 pr-4 text-sm text-[#1C1C1C] outline-none focus:ring-2 focus:ring-[#EEC0FF]";
  const iconClass = "absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1C1C1C]/30";

  return (
    <div className="p-5">
      <h3 className="text-[15px] font-medium text-[#1C1C1C]">Контакты и ссылки</h3>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Адрес</label>
          <div className="relative">
            <MapPin className={iconClass} />
            <input
              type="text"
              placeholder="ул. Абылай хана 52, Алматы"
              value={profile.address}
              onChange={(e) => onProfileChange({ address: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Номер телефона</label>
          <div className="relative">
            <Phone className={iconClass} />
            <input
              type="tel"
              placeholder="+7 700 000 00 00"
              value={contacts.phone}
              onChange={(e) => updateContact("phone", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">WhatsApp</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2"><WhatsAppIcon /></span>
            <input
              type="tel"
              placeholder="+7 700 000 00 00"
              value={contacts.whatsapp}
              onChange={(e) => updateContact("whatsapp", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Instagram</label>
          <div className="relative">
            <Instagram className={iconClass} />
            <input
              placeholder="@username"
              value={contacts.instagram}
              onChange={(e) => updateContact("instagram", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">TikTok</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2"><TikTokIcon /></span>
            <input
              placeholder="@username"
              value={contacts.tiktok}
              onChange={(e) => updateContact("tiktok", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">Вебсайт</label>
          <div className="relative">
            <Globe className={iconClass} />
            <input
              type="text"
              placeholder="www.example.com"
              value={profile.socialWebsite}
              onChange={(e) => onProfileChange({ socialWebsite: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#1C1C1C]/50">2ГИС</label>
          <div className="relative">
            <Map className={iconClass} />
            <input
              type="text"
              placeholder="Ссылка на 2ГИС"
              value={profile.social2gis}
              onChange={(e) => onProfileChange({ social2gis: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
