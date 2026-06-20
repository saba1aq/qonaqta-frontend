import { Link } from '@tanstack/react-router'
import { Button } from '@qonaqta/ui/components/button'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-svh bg-white">
      <header className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <span className="text-[18px] font-bold tracking-tight">Qonaqta</span>
        <Link
          to="/restaurants"
          className="text-[13px] font-medium text-neutral-900 underline underline-offset-4"
        >
          К ресторанам
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-[40px] leading-tight font-bold tracking-tight text-neutral-900">
          Бронируй столик
          <br />
          за пару кликов
        </h1>
        <p className="mt-4 text-[15px] text-neutral-500 max-w-md">
          Лучшие рестораны Казахстана в одном приложении. Без звонков, без ожидания.
        </p>

        <Link to="/restaurants" className="mt-8">
          <Button className="h-12 px-8 rounded-full text-[15px] font-semibold bg-neutral-900 text-white hover:bg-neutral-800">
            Выбрать ресторан
          </Button>
        </Link>
      </main>

      <footer className="px-5 py-6 text-center text-[12px] text-neutral-400 border-t border-neutral-100">
        © Qonaqta · Казахстан
      </footer>
    </div>
  )
}
