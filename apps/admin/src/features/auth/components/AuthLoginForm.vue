<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'
    import type { AuthLoginInput } from '@windkode/shared'

    import { authLoginSchema } from '@windkode/shared'
    import { reactive, useTemplateRef } from 'vue'

    const { isLoading = false } = defineProps<{ isLoading?: boolean }>()

    const emit = defineEmits<{ submit: [input: AuthLoginInput] }>()

    const state = reactive({ email: '', password: '' })
    const form = useTemplateRef('form')

    const handleSubmit = (event: FormSubmitEvent<AuthLoginInput>) => emit('submit', event.data)

    /** La pantalla devuelve aquí los errores de campo del servidor. */
    const setFieldErrors = (fieldErrors: Record<string, string[]>) =>
        form.value?.setErrors(
            Object.entries(fieldErrors).flatMap(([name, messages]) => messages.map((message) => ({ message, name }))),
        )

    defineExpose({ setFieldErrors })
</script>

<template>
    <UForm
        ref="form"
        class="space-y-4"
        :schema="authLoginSchema"
        :state="state"
        @submit="handleSubmit"
    >
        <UFormField
            label="Correo"
            name="email"
        >
            <UInput
                v-model="state.email"
                autocomplete="email"
                class="w-full"
                icon="i-lucide-mail"
                placeholder="tu@windkode.com"
                type="email"
            />
        </UFormField>

        <UFormField
            label="Contraseña"
            name="password"
        >
            <UInput
                v-model="state.password"
                autocomplete="current-password"
                class="w-full"
                icon="i-lucide-lock"
                type="password"
            />
        </UFormField>

        <UButton
            block
            :loading="isLoading"
            type="submit"
        >
            Iniciar sesión
        </UButton>
    </UForm>
</template>
