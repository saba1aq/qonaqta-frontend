import { Separator } from "@qonaqta/ui/components/separator";
import type { ContactsData, ProfileData, WorkingHoursData } from "../model/types";
import { CoverPhotosSection } from "./CoverPhotosSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { AppPreview } from "./AppPreview";
import { ContactsAndLinksSection } from "./ContactsAndLinksSection";
import { WorkingHoursSection } from "./WorkingHoursSection";

interface ProfileTabProps {
  profile: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  contacts: ContactsData;
  workingHours: WorkingHoursData;
  onContactsChange: (data: ContactsData) => void;
  onWorkingHoursChange: (data: WorkingHoursData) => void;
  onFilesSelected: (files: FileList | null) => void;
  onRemovePhoto: (index: number) => void;
}

export function ProfileTab({ profile, onChange, contacts, workingHours, onContactsChange, onWorkingHoursChange, onFilesSelected, onRemovePhoto }: ProfileTabProps) {
  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-[3] space-y-4">
        <CoverPhotosSection
          photos={profile.photos}
          onFilesSelected={onFilesSelected}
          onRemovePhoto={onRemovePhoto}
        />
        <BasicInfoSection profile={profile} onChange={onChange} />
        <div className="rounded-2xl bg-[#FEFEFE] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <ContactsAndLinksSection
            profile={profile}
            onProfileChange={onChange}
            contacts={contacts}
            onContactsChange={onContactsChange}
          />
          <Separator />
          <WorkingHoursSection workingHours={workingHours} onChange={onWorkingHoursChange} />
        </div>
      </div>

      <div className="flex-[2]">
        <AppPreview profile={profile} />
      </div>
    </div>
  );
}
