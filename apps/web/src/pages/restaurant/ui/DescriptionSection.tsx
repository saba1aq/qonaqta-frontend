import { useState } from 'react'

export function DescriptionSection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <h3 className="text-[15px] font-semibold text-neutral-900 mb-2">О заведении</h3>
      <p className={`text-sm text-neutral-500 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
        {description}
      </p>
      {description.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-neutral-900 mt-1.5 underline underline-offset-2"
        >
          {expanded ? 'Свернуть' : 'Подробнее'}
        </button>
      )}
    </div>
  )
}
