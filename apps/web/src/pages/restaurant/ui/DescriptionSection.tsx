import { useState } from 'react'

export function DescriptionSection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <h3 className="font-stamp uppercase tracking-[0.12em] text-[12px] text-ink-soft mb-3">
        О заведении
      </h3>
      <p className={`text-[15px] text-[#3b352b] leading-relaxed ${!expanded ? 'line-clamp-4' : ''}`}>
        {description}
      </p>
      {description.length > 180 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-stamp uppercase text-[12px] tracking-[0.08em] text-ink mt-2 underline underline-offset-4 decoration-riso-pink decoration-2"
        >
          {expanded ? 'Свернуть' : 'Подробнее'}
        </button>
      )}
    </div>
  )
}
