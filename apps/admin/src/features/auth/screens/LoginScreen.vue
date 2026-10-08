<script setup lang="ts">
    import type { AuthLoginInput } from '@windkode/shared'

    import { useTemplateRef } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import { useAuthStore } from '~/shared/stores/authStore'

    import AuthLoginForm from '../components/AuthLoginForm.vue'

    const auth = useAuthStore()
    const route = useRoute()
    const router = useRouter()
    const form = useTemplateRef('form')

    const isExpired = route.query.expirada === '1'

    const handleSubmit = async (input: AuthLoginInput) => {
        const result = await auth.login(input)

        if (!result.success) {
            if (result.fieldErrors) form.value?.setFieldErrors(result.fieldErrors)

            return
        }

        const redirect =
            typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
                ? route.query.redirect
                : '/'

        await router.replace(redirect)
    }
</script>

<template>
    <main class="flex min-h-dvh items-center justify-center bg-default px-4">
        <UCard class="w-full max-w-sm">
            <template #header>
                <div class="space-y-1 text-center">
                    <p class="text-xl font-bold tracking-wide">WIND<span class="text-primary">KODE</span></p>
                    <p class="text-sm text-muted">Panel interno del equipo</p>
                </div>
            </template>

            <div class="space-y-4">
                <UAlert
                    v-if="isExpired && !auth.error"
                    color="warning"
                    description="Tu sesión expiró. Inicia sesión de nuevo."
                    icon="i-lucide-clock"
                    variant="subtle"
                />
                <UAlert
                    v-if="auth.error"
                    close
                    color="error"
                    :description="auth.error"
                    icon="i-lucide-circle-alert"
                    variant="subtle"
                    @update:open="auth.clearError"
                />
                <AuthLoginForm
                    ref="form"
                    :isLoading="auth.isLoading"
                    @submit="handleSubmit"
                />
            </div>
        </UCard>
    </main>
</template>
