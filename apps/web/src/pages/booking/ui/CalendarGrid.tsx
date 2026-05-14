import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { BranchSchedule } from '@/entities/restaurant'
import { formatDate } from '../lib/time-slots'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const WEEK_DAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const WEEK_DAYS_MON_FIRST = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const DAYS_TO_SHOW = 14

function isSamePoint(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function CalendarGrid({
  date,
  onSelect,
  schedules,
}: {
  date: string | null
  onSelect: (date: string) => void
  schedules: BranchSchedule[] | undefined
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days: Date[] = []
  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }

  const headerDate = date ? new Date(date) : today
  const monthLabel = MONTH_NAMES[headerDate.getMonth()]

  const selectedRef = useRef<HTMLButtonElement>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }
  }, [date])

  return (
    <>
      <div className="rounded-2xl bg-white border border-neutral-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[22px] font-bold tracking-tight text-neutral-900">{monthLabel}</h3>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="size-9 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-700 active:scale-95 transition-transform"
            aria-label="Открыть календарь"
          >
            <CalendarDays className="size-[18px]" />
          </button>
        </div>

        <div
          className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {days.map((day) => {
            const dateStr = formatDate(day)
            const isSelected = dateStr === date
            const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay()
            const schedule = schedules?.find((s) => s.day_of_week === dayOfWeek)
            const isClosed = schedule?.is_closed ?? false
            const isToday = isSamePoint(day, today)

            return (
              <button
                key={dateStr}
                ref={isSelected ? selectedRef : undefined}
                disabled={isClosed}
                onClick={() => onSelect(dateStr)}
                className={
                  'shrink-0 w-12 h-[68px] rounded-2xl flex flex-col items-center justify-center transition-all ' +
                  (isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : isClosed
                      ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                      : isToday
                        ? 'bg-neutral-100 text-neutral-900 active:scale-95'
                        : 'bg-white text-neutral-900 active:scale-95')
                }
              >
                <span className={'text-[18px] font-semibold leading-tight ' + (isSelected ? 'text-white' : isClosed ? 'text-neutral-300' : 'text-neutral-900')}>
                  {day.getDate()}
                </span>
                <span className={'text-[11px] mt-0.5 ' + (isSelected ? 'text-white/80' : isClosed ? 'text-neutral-300' : 'text-neutral-400')}>
                  {WEEK_DAYS_SHORT[day.getDay()]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {modalOpen && (
        <MonthPickerModal
          initialDate={date ? new Date(date) : today}
          selectedDate={date}
          schedules={schedules}
          today={today}
          onSelect={(d) => {
            onSelect(d)
            setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

function MonthPickerModal({
  initialDate,
  selectedDate,
  schedules,
  today,
  onSelect,
  onClose,
}: {
  initialDate: Date
  selectedDate: string | null
  schedules: BranchSchedule[] | undefined
  today: Date
  onSelect: (date: string) => void
  onClose: () => void
}) {
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7

  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(viewYear, viewMonth, d))

  const navigate = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const canGoBack = !(viewYear === today.getFullYear() && viewMonth === today.getMonth())

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-3xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              disabled={!canGoBack}
              className="size-7 flex items-center justify-center text-neutral-900 disabled:text-neutral-300"
              aria-label="Предыдущий месяц"
            >
              <ChevronLeft className="size-5" />
            </button>
            <h3 className="text-[22px] font-bold tracking-tight text-neutral-900">
              {MONTH_NAMES[viewMonth]}
              {viewYear !== today.getFullYear() && (
                <span className="text-neutral-400 font-semibold ml-1.5">{viewYear}</span>
              )}
            </h3>
            <button
              onClick={() => navigate(1)}
              className="size-7 flex items-center justify-center text-neutral-900"
              aria-label="Следующий месяц"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center text-neutral-700 active:scale-95 transition-transform"
            aria-label="Закрыть"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-2 mb-1">
          {WEEK_DAYS_MON_FIRST.map((d) => (
            <div key={d} className="text-center text-[13px] font-medium text-neutral-400 pb-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="h-11" />

            const dateStr = formatDate(day)
            const isSelected = dateStr === selectedDate
            const isPast = day < today
            const isToday = isSamePoint(day, today)
            const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay()
            const schedule = schedules?.find((s) => s.day_of_week === dayOfWeek)
            const isClosed = schedule?.is_closed ?? false
            const disabled = isPast || isClosed

            return (
              <div key={dateStr} className="flex items-center justify-center h-11">
                <button
                  disabled={disabled}
                  onClick={() => onSelect(dateStr)}
                  className={
                    'size-10 rounded-full text-[15px] font-medium flex items-center justify-center transition-colors ' +
                    (isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : isToday
                        ? 'bg-neutral-100 text-neutral-900'
                        : disabled
                          ? 'text-neutral-300 cursor-not-allowed'
                          : 'text-neutral-900 hover:bg-neutral-50 active:scale-95')
                  }
                >
                  {day.getDate()}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
