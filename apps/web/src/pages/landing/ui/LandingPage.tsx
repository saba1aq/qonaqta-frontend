import { Link } from '@tanstack/react-router'
import { Misreg } from '@/shared/ui/misreg'
import { BenefitsSection } from './BenefitsSection'
import { FeaturedSection } from './FeaturedSection'
import { FaqSection } from './FaqSection'

const STEPS = [
  {
    n: '01',
    title: 'Найдите место',
    text: 'Отобранные вручную рестораны города — по кухне, району и свободным столам.',
    ink: 'text-riso-pink',
  },
  {
    n: '02',
    title: 'Выберите время',
    text: 'Дата, время и число гостей — отмечаете в пару тапов, без звонков.',
    ink: 'text-riso-blue',
  },
  {
    n: '03',
    title: 'Готово',
    text: 'Подтверждение брони приходит в WhatsApp — ресторан свяжется с вами.',
    ink: 'text-riso-sun',
  },
]

export function LandingPage() {
  return (
    <div className="mx-auto max-w-[1140px] px-[clamp(18px,4vw,44px)]">
      {/* COVER */}
      <section className="pt-[clamp(28px,5vw,64px)] pb-[clamp(24px,4vw,44px)]">
        <div className="h-0.5 bg-ink mb-[clamp(18px,3vw,26px)] riso-settle" style={{ animationDelay: '0.04s' }} />

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-[clamp(20px,4vw,44px)] items-end">
          <div>
            <h1
              className="font-display font-extrabold tracking-[-0.045em] leading-[0.86] text-[clamp(46px,10vw,120px)] riso-settle"
              style={{ animationDelay: '0.06s' }}
            >
              Где
              <br />
              сегодня
              <br />
              <Misreg color="blue" className="text-riso-pink">
                вкусно
              </Misreg>
            </h1>
            <p
              className="mt-5 text-[clamp(15px,2.3vw,19px)] leading-relaxed max-w-[40ch] text-[#3b352b] riso-settle"
              style={{ animationDelay: '0.12s' }}
            >
              Отобранные вручную рестораны города — без звонков и ожидания. Смотри подборку и
              бронируй в два тапа.
            </p>
            <div className="mt-7 flex gap-3 flex-wrap items-center riso-settle" style={{ animationDelay: '0.18s' }}>
              <Link
                to="/restaurants"
                className="font-display font-bold text-[15px] bg-ink text-paper-3 px-6 py-4 shadow-[6px_6px_0_#f2315d] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#f2315d] active:translate-x-0 active:translate-y-0 transition-all"
              >
                Найти стол →
              </Link>
              <a
                href="#how"
                className="font-display font-bold text-[15px] border-2 border-ink text-ink px-6 py-[14px] shadow-[6px_6px_0_#2331b4] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#2331b4] transition-all"
              >
                Как это работает
              </a>
            </div>
          </div>

          <div
            className="relative border-2 border-ink overflow-hidden aspect-[4/5] bg-riso-sun shadow-[10px_10px_0_#211d17] riso-settle"
            style={{ animationDelay: '0.1s' }}
          >
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=70"
              alt="Ресторан в Алматы"
              className="w-full h-full object-cover"
            />
            <span className="absolute left-0 bottom-3.5 bg-ink text-paper-3 font-stamp uppercase tracking-[0.12em] text-[12px] px-3.5 py-2">
              Место недели · Auyl
            </span>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <BenefitsSection />

      {/* FEATURED — реальные рестораны из API */}
      <FeaturedSection />

      {/* HOW IT WORKS */}
      <section id="how" className="pt-[clamp(30px,5vw,56px)]">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-6">
          <h2 className="font-display font-bold tracking-[-0.035em] text-[clamp(24px,4.5vw,40px)]">
            Как это работает
          </h2>
          <span className="font-stamp uppercase tracking-[0.1em] text-[13px] text-ink-soft">
            три шага
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="bg-paper-3 border-2 border-ink p-6 shadow-[7px_7px_0_#211d17]"
            >
              <div className={`font-display font-extrabold text-[40px] leading-none ${s.ink}`}>
                {s.n}
              </div>
              <h3 className="font-display font-bold text-[20px] mt-3 tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#3b352b]">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CLOSING CTA */}
      <section className="mt-[clamp(38px,6vw,72px)] mb-[clamp(38px,6vw,72px)]">
        <div className="bg-ink text-paper-3 px-[clamp(24px,5vw,56px)] py-[clamp(32px,5vw,56px)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-stamp uppercase tracking-[0.14em] text-[12px] text-riso-sun">
              Qonaqta · Алматы
            </div>
            <p className="font-display font-extrabold tracking-[-0.04em] leading-[0.92] text-[clamp(30px,6vw,56px)] mt-2">
              Стол ждёт.
            </p>
          </div>
          <Link
            to="/restaurants"
            className="self-start md:self-auto shrink-0 font-display font-bold text-[15px] bg-riso-pink text-paper-3 px-7 py-4 shadow-[6px_6px_0_#f4b71a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#f4b71a] transition-all"
          >
            Смотреть рестораны →
          </Link>
        </div>
      </section>

      {/* COLOPHON */}
      <footer className="border-t-2 border-ink py-6 mb-10 flex justify-between gap-4 flex-wrap text-[13px] text-ink-soft">
        <span className="font-display font-extrabold text-ink">QONAQTA</span>
        <span>© Qonaqta · Бронирование столиков · Казахстан</span>
      </footer>
    </div>
  )
}
