const DATE_FORMATTER = new Intl.DateTimeFormat('es-BO', { day: 'numeric', month: 'short', year: 'numeric' })
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('es-BO', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
})

/** Fecha corta en español. Acepta ISO completo o solo fecha (YYYY-MM-DD, que se interpreta a mediodía para no cambiar de día). */
export const formatDate = (iso: null | string): string =>
    iso ? DATE_FORMATTER.format(new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)) : '—'

export const formatDateTime = (iso: string): string => DATE_TIME_FORMATTER.format(new Date(iso))

/** Valor para un <input type="datetime-local"> con la hora local. */
export const toDateTimeLocalValue = (date: Date): string =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
