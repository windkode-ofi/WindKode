<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'
    import type { Client, ClientCreateInput, ClientSource, ClientStatus } from '@windkode/shared'

    import {
        CLIENT_SOURCE_LABEL,
        CLIENT_SOURCES,
        CLIENT_STATUS_LABEL,
        CLIENT_STATUSES,
        clientCreateSchema,
    } from '@windkode/shared'
    import { reactive, useTemplateRef } from 'vue'

    /** Formulario tonto: valida con el schema compartido y emite `submit`; quien lo usa llama a la api. */
    const { client = null, isLoading = false } = defineProps<{ client?: Client | null; isLoading?: boolean }>()

    const emit = defineEmits<{ submit: [input: ClientCreateInput] }>()

    const state = reactive<{
        company: string
        email: string
        jobTitle: string
        name: string
        notes: string
        phone: string
        source: ClientSource
        status: ClientStatus
        valueProposition: string
    }>({
        company: client?.company ?? '',
        email: client?.email ?? '',
        jobTitle: client?.jobTitle ?? '',
        name: client?.name ?? '',
        notes: client?.notes ?? '',
        phone: client?.phone ?? '',
        source: client?.source ?? 'WEB',
        status: client?.status ?? 'NEW',
        valueProposition: client?.valueProposition ?? '',
    })

    const form = useTemplateRef('form')

    const sourceItems = CLIENT_SOURCES.map((value) => ({ label: CLIENT_SOURCE_LABEL[value], value }))
    const statusItems = CLIENT_STATUSES.map((value) => ({ label: CLIENT_STATUS_LABEL[value], value }))

    const handleSubmit = (event: FormSubmitEvent<ClientCreateInput>) => emit('submit', event.data)

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
        :schema="clientCreateSchema"
        :state="state"
        @submit="handleSubmit"
    >
        <UFormField
            label="Nombre de la persona"
            name="name"
            required
        >
            <UInput
                v-model="state.name"
                class="w-full"
                placeholder="Mariana Rojas"
            />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
                label="Cargo en la empresa"
                name="jobTitle"
            >
                <UInput
                    v-model="state.jobTitle"
                    class="w-full"
                    placeholder="Gerente general"
                />
            </UFormField>
            <UFormField
                label="Empresa"
                name="company"
            >
                <UInput
                    v-model="state.company"
                    class="w-full"
                    placeholder="Café Altura"
                />
            </UFormField>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
                label="Correo"
                name="email"
            >
                <UInput
                    v-model="state.email"
                    class="w-full"
                    type="email"
                />
            </UFormField>
            <UFormField
                label="Teléfono / WhatsApp"
                name="phone"
            >
                <UInput
                    v-model="state.phone"
                    class="w-full"
                    placeholder="+591 75904262"
                />
            </UFormField>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
                label="Estado"
                name="status"
                required
            >
                <USelect
                    v-model="state.status"
                    class="w-full"
                    :items="statusItems"
                />
            </UFormField>
            <UFormField
                label="¿Cómo llegó?"
                name="source"
                required
            >
                <USelect
                    v-model="state.source"
                    class="w-full"
                    :items="sourceItems"
                />
            </UFormField>
        </div>

        <UFormField
            description="Qué le aporta WindKode: la base para armar la propuesta."
            label="Valor a agregar"
            name="valueProposition"
        >
            <UTextarea
                v-model="state.valueProposition"
                autoresize
                class="w-full"
                :rows="3"
            />
        </UFormField>

        <UFormField
            label="Notas internas"
            name="notes"
        >
            <UTextarea
                v-model="state.notes"
                autoresize
                class="w-full"
                :rows="2"
            />
        </UFormField>

        <div class="flex justify-end">
            <UButton
                :loading="isLoading"
                type="submit"
            >
                {{ client ? 'Guardar cambios' : 'Crear cliente' }}
            </UButton>
        </div>
    </UForm>
</template>
