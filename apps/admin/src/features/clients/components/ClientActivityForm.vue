<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'
    import type { ClientActivityCreateInput, ClientActivityType } from '@windkode/shared'

    import { CLIENT_ACTIVITY_TYPE_LABEL, CLIENT_ACTIVITY_TYPES, clientActivityCreateSchema } from '@windkode/shared'
    import { reactive } from 'vue'

    import { toDateTimeLocalValue } from '~/shared/utils/date'

    const { isLoading = false } = defineProps<{ isLoading?: boolean }>()

    const emit = defineEmits<{ submit: [input: ClientActivityCreateInput] }>()

    const initialState = (): { occurredAt: string; summary: string; type: ClientActivityType } => ({
        occurredAt: toDateTimeLocalValue(new Date()),
        summary: '',
        type: 'WHATSAPP',
    })

    const state = reactive(initialState())

    const typeItems = CLIENT_ACTIVITY_TYPES.map((value) => ({ label: CLIENT_ACTIVITY_TYPE_LABEL[value], value }))

    const handleSubmit = (event: FormSubmitEvent<ClientActivityCreateInput>) => emit('submit', event.data)

    /** La pantalla lo llama cuando la api confirmó el registro. */
    const reset = () => Object.assign(state, initialState())

    defineExpose({ reset })
</script>

<template>
    <UForm
        class="space-y-3"
        :schema="clientActivityCreateSchema"
        :state="state"
        @submit="handleSubmit"
    >
        <div class="grid gap-3 sm:grid-cols-2">
            <UFormField
                label="Tipo"
                name="type"
            >
                <USelect
                    v-model="state.type"
                    class="w-full"
                    :items="typeItems"
                />
            </UFormField>
            <UFormField
                label="Fecha"
                name="occurredAt"
            >
                <UInput
                    v-model="state.occurredAt"
                    class="w-full"
                    type="datetime-local"
                />
            </UFormField>
        </div>
        <UFormField
            label="¿Qué se habló?"
            name="summary"
        >
            <UTextarea
                v-model="state.summary"
                autoresize
                class="w-full"
                placeholder="Le interesa una demo la próxima semana…"
                :rows="2"
            />
        </UFormField>
        <div class="flex justify-end">
            <UButton
                icon="i-lucide-plus"
                :loading="isLoading"
                type="submit"
            >
                Registrar interacción
            </UButton>
        </div>
    </UForm>
</template>
