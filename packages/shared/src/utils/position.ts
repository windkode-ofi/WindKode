/**
 * Inserta `movedId` en `columnIds` en el índice pedido (acotado a los límites) y devuelve el orden final.
 * `columnIds` es la columna destino ya ordenada; si `movedId` estaba en ella, primero se saca.
 */
export const insertAtPosition = (columnIds: readonly string[], movedId: string, position: number): string[] => {
    const rest = columnIds.filter((id) => id !== movedId)
    const index = Math.min(Math.max(position, 0), rest.length)

    return [...rest.slice(0, index), movedId, ...rest.slice(index)]
}
