import type { AuthLoginInput, AuthSession, GenericResponse } from '@windkode/shared'

import { httpClient } from '~/shared/services/httpClient'

export const authService = {
    login: (input: AuthLoginInput): Promise<GenericResponse<AuthSession>> =>
        httpClient.post<AuthSession>('/auth/login', input),
    logout: (): Promise<GenericResponse> => httpClient.post<null>('/auth/logout'),
}
