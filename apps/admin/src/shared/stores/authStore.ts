import type { AuthLoginInput, AuthSession, User } from '@windkode/shared'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { authService } from '~/features/auth/services/authService'
import { refreshSession, registerSessionBridge } from '~/shared/services/httpClient'

/** Sesión del panel. El access token vive solo en memoria; el refresh token, en una cookie httpOnly. */
export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<null | string>(null)
    const user = ref<null | User>(null)
    const isLoading = ref(false)
    const error = ref<null | string>(null)
    /** Se intentó recuperar la sesión al arrancar (con la cookie de refresh). */
    const isRestored = ref(false)
    /** Promesa compartida para que el router y la app no lancen dos restauraciones a la vez. */
    const restoring = ref<null | Promise<void>>(null)

    const isAuthenticated = computed(() => user.value !== null)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')

    const applySession = (session: AuthSession): void => {
        accessToken.value = session.accessToken
        user.value = session.user
    }

    const reset = (): void => {
        accessToken.value = null
        user.value = null
    }

    registerSessionBridge({
        getAccessToken: () => accessToken.value,
        onRefreshed: applySession,
        onSessionExpired: () => {
            reset()
            window.location.assign('/login?expirada=1')
        },
    })

    const clearError = (): void => {
        error.value = null
    }

    const login = async (
        input: AuthLoginInput,
    ): Promise<{ error?: string; fieldErrors?: Record<string, string[]>; success: boolean }> => {
        isLoading.value = true
        error.value = null

        const result = await authService.login(input)

        isLoading.value = false

        if (!result.success) {
            error.value = result.error

            return {
                error: result.error,
                ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
                success: false,
            }
        }

        applySession(result.data)

        return { success: true }
    }

    const logout = async (): Promise<void> => {
        await authService.logout()
        reset()
    }

    const restore = (): Promise<void> => {
        restoring.value ??= refreshSession().then(() => {
            isRestored.value = true
        })

        return restoring.value
    }

    return {
        accessToken,
        clearError,
        error,
        isAdmin,
        isAuthenticated,
        isLoading,
        isRestored,
        login,
        logout,
        restore,
        user,
    }
})
