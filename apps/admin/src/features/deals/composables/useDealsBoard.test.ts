import type { Deal } from '@windkode/shared'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDealsBoard } from './useDealsBoard'

const toast = { error: vi.fn(), success: vi.fn() }

vi.mock('~/shared/composables/useAppToast', () => ({ useAppToast: () => toast }))

const moveMock = vi.fn<(id: string, input: unknown) => Promise<unknown>>()

vi.mock('../services/dealsService', () => ({
    dealsService: { move: (id: string, input: unknown) => moveMock(id, input) },
}))

const makeDeal = (id: string, stage: Deal['stage'], position: number): Deal => ({
    amount: '100.00',
    client: { company: null, id: 'c1', name: 'Cliente' },
    createdAt: '2026-01-01T00:00:00.000Z',
    currency: 'BOB',
    expectedCloseAt: null,
    id,
    owner: { email: 'a@windkode.com', id: 'u1', name: 'Ana' },
    position,
    stage,
    title: id,
    updatedAt: '2026-01-01T00:00:00.000Z',
})

describe('useDealsBoard', () => {
    beforeEach(() => {
        moveMock.mockReset()
        toast.error.mockReset()
    })

    it('mueve la tarjeta al instante y renumera ambas columnas', async () => {
        moveMock.mockResolvedValue({ data: null, success: true })
        const board = useDealsBoard()

        board.deals.value = [makeDeal('a', 'LEAD', 0), makeDeal('b', 'LEAD', 1), makeDeal('c', 'WON', 0)]
        await board.moveDeal('a', 'WON', 0)

        const won = board.columns.value.find((column) => column.stage === 'WON')
        const lead = board.columns.value.find((column) => column.stage === 'LEAD')

        expect(won?.deals.map((deal) => [deal.id, deal.position])).toEqual([
            ['a', 0],
            ['c', 1],
        ])
        expect(lead?.deals.map((deal) => [deal.id, deal.position])).toEqual([['b', 0]])
    })

    it('revierte el movimiento y avisa si la api falla', async () => {
        moveMock.mockResolvedValue({ data: null, error: 'Sin conexión', success: false })
        const board = useDealsBoard()
        const initial = [makeDeal('a', 'LEAD', 0), makeDeal('b', 'WON', 0)]

        board.deals.value = initial
        await board.moveDeal('a', 'WON', 1)

        expect(board.deals.value).toEqual(initial)
        expect(toast.error).toHaveBeenCalledWith('Sin conexión', 'No se pudo mover la oportunidad')
    })
})
