import type {
    Client,
    ClientActivity,
    ClientActivityCreateRequest,
    ClientCreateRequest,
    ClientListQueryInput,
    ClientSummary,
    ClientUpdateRequest,
    GenericResponse,
    Paginated,
} from '@windkode/shared'

import { httpClient } from '~/shared/services/httpClient'

export const clientsService = {
    addActivity: (id: string, input: ClientActivityCreateRequest): Promise<GenericResponse<ClientActivity>> =>
        httpClient.post<ClientActivity>(`/clients/${id}/activities`, input),
    create: (input: ClientCreateRequest): Promise<GenericResponse<Client>> =>
        httpClient.post<Client>('/clients', input),
    findActivities: (id: string): Promise<GenericResponse<ClientActivity[]>> =>
        httpClient.get<ClientActivity[]>(`/clients/${id}/activities`),
    findAll: (query: Partial<ClientListQueryInput>): Promise<GenericResponse<Paginated<Client>>> =>
        httpClient.get<Paginated<Client>>('/clients', { ...query }),
    findOne: (id: string): Promise<GenericResponse<Client>> => httpClient.get<Client>(`/clients/${id}`),
    findOptions: (): Promise<GenericResponse<ClientSummary[]>> => httpClient.get<ClientSummary[]>('/clients/options'),
    remove: (id: string): Promise<GenericResponse> => httpClient.delete(`/clients/${id}`),
    update: (id: string, input: ClientUpdateRequest): Promise<GenericResponse<Client>> =>
        httpClient.patch<Client>(`/clients/${id}`, input),
}
