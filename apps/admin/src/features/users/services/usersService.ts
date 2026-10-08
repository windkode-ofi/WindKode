import type { GenericResponse, User, UserCreateInput, UserUpdateInput } from '@windkode/shared'

import { httpClient } from '~/shared/services/httpClient'

export const usersService = {
    create: (input: UserCreateInput): Promise<GenericResponse<User>> => httpClient.post<User>('/users', input),
    findAll: (): Promise<GenericResponse<User[]>> => httpClient.get<User[]>('/users'),
    update: (id: string, input: UserUpdateInput): Promise<GenericResponse<User>> =>
        httpClient.patch<User>(`/users/${id}`, input),
}
