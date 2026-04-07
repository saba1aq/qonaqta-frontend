import { Instagram, Phone } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { ContactsData } from "../model/types";

interface ContactsSectionProps {
  contacts: ContactsData;
  onChange: (contacts: ContactsData) => void;
}

export function ContactsSection({ contacts, onChange }: ContactsSectionProps) {
  const update = (field: keyof ContactsData, value: string) => {
    onChange({ ...contacts, [field]: value });
  };

  return (
    <div className="p-5">
      <h2 className="text-[14px] font-medium text-neutral-900">Контакты</h2>
      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Phone className="size-3.5" />
            Номер телефона
          </Label>
          <Input
            type="tel"
            placeholder="+7 700 000 00 00"
            value={contacts.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs text-neutral-500">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.54-1.472A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.326-.726-6.016-1.956l-.42-.312-2.69.872.896-2.632-.344-.446A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp
          </Label>
          <Input
            type="tel"
            placeholder="+7 700 000 00 00"
            value={contacts.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Instagram className="size-3.5" />
            Instagram
          </Label>
          <Input
            placeholder="@username"
            value={contacts.instagram}
            onChange={(e) => update("instagram", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs text-neutral-500">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.55a8.17 8.17 0 004.76 1.52V6.69h-1z" />
            </svg>
            TikTok
          </Label>
          <Input
            placeholder="@username"
            value={contacts.tiktok}
            onChange={(e) => update("tiktok", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
