import { useState, useRef, useCallback } from 'react'
import type { BranchPhoto } from '@/entities/restaurant'

export function PhotoCarousel({
  photos,
  branchName,
}: {
  photos: BranchPhoto[]
  branchName: string
}) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const touchStartX = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      setPhotoIdx((prev) => {
        if (diff > 0) return Math.min(prev + 1, photos.length - 1)
        return Math.max(prev - 1, 0)
      })
    }
  }, [photos.length])

  return (
    <>
      {photos.length > 0 ? (
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${photoIdx * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.image_url}
              alt={branchName}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
      )}

      {photos.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhotoIdx(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === photoIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}
