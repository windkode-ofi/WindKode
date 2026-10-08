<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'
    import type { UserCreateInput, UserRole } from '@windkode/shared'

    import { PASSWORD_MIN_LENGTH, USER_ROLE_LABEL, USER_ROLES, userCreateSchema } from '@windkode/shared'
    import { reactive, useTemplateRef } from 'vue'

    const { isLoading = false } = defineProps<{ isLoading?: boolean }>()

    const emit = defineEmits<{ submit: [input: UserCreateInput] }>()

    const state = reactive<{ email: string; name: string; password: string; role: UserRole }>({
        email: '',
        name: '',
        password: '',
        role: 'SELLER',
    })
    const form = useTemplateRef('form')

    const roleItems = USER_ROLES.map((value) => ({ label: USER_ROLE_LABEL[value], value }))

    const handleSubmit = (event: FormSubmitEvent<UserCreateInput>) => emit('submit', event.data)

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
        :schema="userCreateSchema"
        :state="state"
        @submit="handleSubmit"
    >
        <UFormField
            label="Nombre"
            name="name"
            required
        >
            <UInput
                v-model="state.name"
                class="w-full"
            />
        </UFormField>
        <UFormField
            label="Correo"
            name="email"
            required
        >
            <UInput
                v-model="state.email"
                autocomplete="off"
                class="w-full"
                type="email"
            />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
                :description="`Mínimo ${PASSWORD_MIN_LENGTH} caracteres`"
                label="Contraseña inicial"
                name="password"
                required
            >
                <UInput
                    v-model="state.password"
                    autocomplete="new-password"
                    class="w-full"
                    type="password"
                />
            </UFormField>
            <UFormField
                label="Rol"
                name="role"
            >
                <USelect
                    v-model="state.role"
                    class="w-full"
                    :items="roleItems"
                />
            </UFormField>
        </div>
        <div class="flex justify-end">
            <UButton
                :loading="isLoading"
                type="submit"
            >
                Crear usuario
            </UButton>
        </div>
    </UForm>
</template>
