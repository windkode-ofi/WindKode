import type { UIColor } from '../types/common.js'
import type { Currency, DealStage } from '../types/deal.js'

/** Etapas en el orden del embudo: la posición es un dato (columnas del kanban), no se ordena alfabéticamente. */
export const DEAL_STAGES = [
    'LEAD',
    'CONTACTED',
    'PROPOSAL',
    'NEGOTIATION',
    'WON',
    'LOST',
] as const satisfies readonly DealStage[]

export const DEAL_STAGE_LABEL: Record<DealStage, string> = {
    CONTACTED: 'Contactado',
    LEAD: 'Lead',
    LOST: 'Perdido',
    NEGOTIATION: 'Negociación',
    PROPOSAL: 'Propuesta',
    WON: 'Ganado',
}

export const DEAL_STAGE_COLOR: Record<DealStage, UIColor> = {
    CONTACTED: 'info',
    LEAD: 'neutral',
    LOST: 'error',
    NEGOTIATION: 'warning',
    PROPOSAL: 'secondary',
    WON: 'success',
}

/** Etapas que cierran la oportunidad: no cuentan como embudo abierto. */
export const DEAL_CLOSED_STAGES = ['LOST', 'WON'] as const satisfies readonly DealStage[]

export const CURRENCIES = ['BOB', 'USD'] as const satisfies readonly Currency[]

export const CURRENCY_LABEL: Record<Currency, string> = {
    BOB: 'Bolivianos (Bs)',
    USD: 'Dólares (USD)',
}
