import { useEffect, useRef } from 'react'

const TWO_GIS_KEY = import.meta.env.VITE_TWO_GIS_API_KEY as string | undefined

export function LocationCard({
  twoGis,
  latitude,
  longitude,
}: {
  address: string
  city: string
  twoGis: string | null
  latitude: number | null
  longitude: number | null
}) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const hasMap = latitude !== null && longitude !== null && !!TWO_GIS_KEY

  useEffect(() => {
    if (!hasMap || !mapContainer.current) return

    let cancelled = false
    let mapInstance: { destroy: () => void } | null = null

    ;(async () => {
      const { load } = await import('@2gis/mapgl')
      const mapgl = await load()
      if (cancelled || !mapContainer.current) return

      const map = new mapgl.Map(mapContainer.current, {
        center: [longitude as number, latitude as number],
        zoom: 15.5,
        key: TWO_GIS_KEY as string,
        disableRotationByUserInteraction: true,
        disablePitchByUserInteraction: true,
        zoomControl: false,
      })

      new mapgl.Marker(map, {
        coordinates: [longitude as number, latitude as number],
      })

      mapInstance = map
    })()

    return () => {
      cancelled = true
      mapInstance?.destroy()
    }
  }, [hasMap, latitude, longitude])

  if (!hasMap) return null

  return (
    <div>
      <h3 className="text-[15px] font-semibold text-neutral-900 mb-3">Как добраться</h3>
      <a
        href={twoGis ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl border border-neutral-100 bg-white overflow-hidden active:scale-[0.99] transition-transform"
      >
        <div className="relative h-40">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </a>
    </div>
  )
}
