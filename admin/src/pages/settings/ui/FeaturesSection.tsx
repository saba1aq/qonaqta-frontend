import {
  Wifi, Music, Sun, Car, Check, Cloud,
  PawPrint, Baby, Accessibility, DoorClosed, Leaf, WheatOff,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ProfileData } from "../model/types";
import { FEATURES_LIST } from "../model/constants";

const ICON_MAP: Record<string, typeof Wifi> = {
  wifi: Wifi,
  music: Music,
  sun: Sun,
  car: Car,
  check: Check,
  cloud: Cloud,
  paw: PawPrint,
  baby: Baby,
  accessibility: Accessibility,
  "door-closed": DoorClosed,
  leaf: Leaf,
  "wheat-off": WheatOff,
};

interface FeaturesSectionProps {
  profile: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function FeaturesSection({ profile, onChange }: FeaturesSectionProps) {
  const toggle = (id: string) => {
    const features = profile.features.includes(id)
      ? profile.features.filter((f) => f !== id)
      : [...profile.features, id];
    onChange({ features });
  };

  return (
    <div className="rounded-2xl bg-[#FEFEFE] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-medium text-[#1C1C1C]">Особенности</h3>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {FEATURES_LIST.map(({ id, label, icon }) => {
          const Icon = ICON_MAP[icon] || Check;
          const active = profile.features.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-[10px] px-3 text-xs font-medium transition-colors",
                active
                  ? "border border-[#EEC0FF] bg-[#F9E7FF] text-[#232323]"
                  : "bg-[#F3F3F3] text-[#1C1C1C]/45 hover:bg-[#EBEBEB]",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
