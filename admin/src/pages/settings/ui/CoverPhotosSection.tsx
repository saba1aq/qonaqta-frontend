import { useRef } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { API_URL } from "@/shared/api";

interface CoverPhotosSectionProps {
  photos: string[];
  onFilesSelected: (files: FileList | null) => void;
  onRemovePhoto: (index: number) => void;
}

function getPhotoSrc(url: string): string {
  if (url.startsWith("blob:") || url.startsWith("http")) return url;
  return `${API_URL.replace("/api/v1", "")}/files/${url}`;
}

export function CoverPhotosSection({ photos, onFilesSelected, onRemovePhoto }: CoverPhotosSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl bg-[#FEFEFE] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[15px] font-medium text-[#1C1C1C]">Фотографии</h3>
        <span className="text-xs text-[#1C1C1C]/35">До 8 фото · Первое — обложка</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onFilesSelected(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="mt-4 grid grid-cols-4 gap-2">
        {photos.map((photo, i) => (
          <div
            key={photo}
            className={cn(
              "group relative overflow-hidden rounded-[10px] bg-[#F3F3F3]",
              i === 0 ? "col-span-2 h-[160px]" : "h-[100px]",
            )}
          >
            <img
              src={getPhotoSrc(photo)}
              alt=""
              className="size-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity bg-[#1C1C1C]/40 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onRemovePhoto(i)}
                className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-red-500 transition-colors hover:bg-white"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            {i === 0 && (
              <span className="absolute left-2 top-2 rounded bg-[#232323] px-1.5 py-0.5 text-[10px] font-medium text-white">
                Обложка
              </span>
            )}
            <div className="absolute right-1.5 top-1.5 cursor-grab opacity-0 transition-opacity group-hover:opacity-60">
              <GripVertical className="size-4 text-white" />
            </div>
          </div>
        ))}

        {photos.length < 8 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-[100px] flex-col items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-[#1C1C1C]/10 transition-colors hover:border-[#1C1C1C]/20 hover:bg-[#F3F3F3]/50"
          >
            <Plus className="size-5 text-[#1C1C1C]/25" />
            <span className="text-[11px] text-[#1C1C1C]/25">Загрузить</span>
          </button>
        )}
      </div>

      <p className="mt-2 text-[11px] text-[#1C1C1C]/25">Перетащите для изменения порядка</p>
    </div>
  );
}
