import { Plus } from 'lucide-react'

const FAQ = [
  {
    q: 'Нужно ли платить за бронирование?',
    a: 'Нет, бронь бесплатная. Вы оплачиваете только счёт в самом ресторане.',
  },
  {
    q: 'Нужна ли предоплата за столик?',
    a: 'Нет, предоплата не требуется.',
  },
  {
    q: 'Как я узнаю, что бронь подтверждена?',
    a: 'Подтверждение придёт в WhatsApp. При необходимости ресторан свяжется с вами.',
  },
  {
    q: 'Нужен ли аккаунт, чтобы забронировать?',
    a: 'Нет — достаточно указать имя и телефон.',
  },
  {
    q: 'Как отменить или перенести бронь?',
    a: 'Свяжитесь с рестораном по контакту из подтверждения — вам помогут отменить или перенести.',
  },
  {
    q: 'Что если на нужное время нет мест?',
    a: 'Выберите другое время в форме бронирования или другое заведение из каталога.',
  },
]

export function FaqSection() {
  return (
    <section className="pt-[clamp(30px,5vw,56px)]">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-6">
        <h2 className="font-display font-bold tracking-[-0.035em] text-[clamp(24px,4.5vw,40px)]">
          Частые вопросы
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-start">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group bg-paper-3 border-2 border-ink shadow-[5px_5px_0_#1c1c1c] open:shadow-[7px_7px_0_#eec0ff] transition-shadow"
          >
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4">
              <span className="font-display font-bold text-[16px] tracking-[-0.02em]">{item.q}</span>
              <Plus className="size-5 shrink-0 text-ink transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="px-5 pb-4 -mt-1 text-[14.5px] leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
