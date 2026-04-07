import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { apiClient } from '@/shared/api'
import { useAuthStore } from '@/entities/user'
import type { TokenResponse } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

export function AuthPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async () => {
    if (!phone.trim()) return
    setError('')
    setLoading(true)
    try {
      await apiClient.post('/auth/send-code', { phone })
      setStep('otp')
    } catch {
      setError('Не удалось отправить код')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!otp.trim()) return
    setError('')
    setLoading(true)
    try {
      const { data } = await apiClient.post<TokenResponse>('/auth/verify-code', { phone, code: otp })
      login(data)
      navigate({ to: '/' })
    } catch {
      setError('Неверный код')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <button
          onClick={() => {
            if (step === 'otp') {
              setStep('phone')
              setOtp('')
              setError('')
            } else {
              navigate({ to: '/' })
            }
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold">Вход</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6">
        <h2 className="text-2xl font-bold mb-2">
          {step === 'phone' ? 'Введите номер' : 'Введите код'}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {step === 'phone'
            ? 'Мы отправим вам SMS с кодом подтверждения'
            : `Код отправлен на ${phone}`}
        </p>

        {step === 'phone' ? (
          <div className="space-y-4">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
                const d = digits.startsWith('7') ? digits : '7' + digits.replace(/^[78]/, '')
                let formatted = '+7'
                if (d.length > 1) formatted += ' (' + d.slice(1, 4)
                if (d.length > 4) formatted += ') ' + d.slice(4, 7)
                if (d.length > 7) formatted += '-' + d.slice(7, 9)
                if (d.length > 9) formatted += '-' + d.slice(9, 11)
                setPhone(formatted)
              }}
              placeholder="+7 (___) ___-__-__"
              className="h-12 rounded-xl text-base"
              autoFocus
            />
            <Button
              className="w-full h-12 rounded-xl text-sm font-semibold"
              disabled={!phone.trim() || loading}
              onClick={handleSendCode}
            >
              {loading ? 'Отправка...' : 'Получить код'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="h-12 rounded-xl text-base text-center tracking-[0.5em]"
              autoFocus
            />
            <Button
              className="w-full h-12 rounded-xl text-sm font-semibold"
              disabled={!otp.trim() || loading}
              onClick={handleVerifyCode}
            >
              {loading ? 'Проверка...' : 'Подтвердить'}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive text-center mt-3">{error}</p>}
      </div>
    </div>
  )
}
