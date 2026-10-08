import { describe, expect, it } from 'vitest'

import { insertAtPosition } from './index.js'

describe('insertAtPosition', () => {
    it('inserta al inicio de otra columna', () => {
        expect(insertAtPosition(['a', 'b'], 'x', 0)).toEqual(['x', 'a', 'b'])
    })

    it('reordena dentro de la misma columna', () => {
        expect(insertAtPosition(['a', 'b', 'c'], 'a', 2)).toEqual(['b', 'c', 'a'])
    })

    it('acota una posición mayor que la columna al final', () => {
        expect(insertAtPosition(['a'], 'x', 99)).toEqual(['a', 'x'])
    })

    it('funciona con una columna vacía', () => {
        expect(insertAtPosition([], 'x', 3)).toEqual(['x'])
    })
})
