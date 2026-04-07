import { Separator } from "@qonaqta/ui/components/separator";
import type { ContactsData, WorkingHoursData } from "../model/types";
import { ContactsSection } from "./ContactsSection";
import { WorkingHoursSection } from "./WorkingHoursSection";

interface HoursContactsTabProps {
  contacts: ContactsData;
  workingHours: WorkingHoursData;
  onContactsChange: (data: ContactsData) => void;
  onWorkingHoursChange: (data: WorkingHoursData) => void;
}

export function HoursContactsTab({
  contacts,
  workingHours,
  onContactsChange,
  onWorkingHoursChange,
}: HoursContactsTabProps) {
  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl bg-[#FEFEFE] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <ContactsSection contacts={contacts} onChange={onContactsChange} />
        <Separator />
        <WorkingHoursSection workingHours={workingHours} onChange={onWorkingHoursChange} />
      </div>
    </div>
  );
}
