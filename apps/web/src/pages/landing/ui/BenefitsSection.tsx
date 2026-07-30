import { PhoneOff, MessageCircle, Sparkles } from 'lucide-react'

const BENEFITS = [
  {
    Icon: PhoneOff,
    title: 'Без звонков',
    text: 'Бронируйте онлайн в пару тапов — без телефонных разговоров и ожидания на линии.',
    ink: 'text-riso-pink',
  },
  {
    Icon: MessageCircle,
    title: 'Подтверждение в WhatsApp',
    text: 'Ресторан подтверждает бронь в WhatsApp — вы всегда знаете статус.',
    ink: 'text-riso-blue',
  },
  {
    Icon: Sparkles,
    title: 'Отобранные места',
    text: 'Только заведения, которые не стыдно посоветовать друзьям.',
    ink: 'text-riso-sun',
  },
]

export function BenefitsSection() {
  return (
    <section className="pt-[clamp(30px,5vw,56px)]">
      <div className="grid sm:grid-cols-3 gap-5">
        {BENEFITS.map((b) => (
          <div key={b.title} className="bg-paper-3 border-2 border-ink p-6 shadow-[7px_7px_0_#211d17]">
            <b.Icon className={`size-8 ${b.ink}`} strokeWidth={2.25} />
            <h3 className="font-display font-bold text-[20px] mt-4 tracking-[-0.02em]">{b.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[#3b352b]">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
