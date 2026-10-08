import type { Currency } from '../types/deal.js'

const MONEY_FORMATTERS: Record<Currency, Intl.NumberFormat> = {
    BOB: new Intl.NumberFormat('es-BO', { currency: 'BOB', minimumFractionDigits: 2, style: 'currency' }),
    USD: new Intl.NumberFormat('es-BO', { currency: 'USD', minimumFractionDigits: 2, style: 'currency' }),
}

/** Formatea un monto decimal (string o number) en la moneda dada con el locale de Bolivia. */
export const formatMoney = (amount: number | string, currency: Currency): string => {
    const value = typeof amount === 'string' ? Number(amount) : amount

    return Number.isFinite(value) ? MONEY_FORMATTERS[currency].format(value) : '—'
}

/** Suma montos decimales en centavos para no acumular error de coma flotante. */
export const sumAmounts = (amounts: readonly string[]): string => {
    const cents = amounts.reduce((total, amount) => total + Math.round(Number(amount) * 100), 0)

    return (cents / 100).toFixed(2)
}
