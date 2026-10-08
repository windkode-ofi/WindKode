import type { Deal, DealCreateRequest, DealMoveInput, DealUpdateRequest, GenericResponse } from '@windkode/shared'

import { httpClient } from '~/shared/services/httpClient'

export const dealsService = {
    create: (input: DealCreateRequest): Promise<GenericResponse<Deal>> => httpClient.post<Deal>('/deals', input),
    findAll: (query: { clientId?: string } = {}): Promise<GenericResponse<Deal[]>> =>
        httpClient.get<Deal[]>('/deals', query),
    move: (id: string, input: DealMoveInput): Promise<GenericResponse<Deal>> =>
        httpClient.patch<Deal>(`/deals/${id}/move`, input),
    remove: (id: string): Promise<GenericResponse> => httpClient.delete(`/deals/${id}`),
    update: (id: string, input: DealUpdateRequest): Promise<GenericResponse<Deal>> =>
        httpClient.patch<Deal>(`/deals/${id}`, input),
}
