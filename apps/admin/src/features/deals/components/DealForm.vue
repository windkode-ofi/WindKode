<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'
    import type { ClientSummary, Currency, Deal, DealCreateInput, DealStage } from '@windkode/shared'

    import { CURRENCIES, CURRENCY_LABEL, DEAL_STAGE_LABEL, DEAL_STAGES, dealCreateSchema } from '@windkode/shared'
    import { computed, reactive, useTemplateRef } from 'vue'

    /** Formulario tonto de oportunidad. Al editar no cambia la etapa: eso se hace arrastrando en el tablero. */
    const {
        clients,
        deal = null,
        isLoading = false,
    } = defineProps<{ clients: ClientSummary[]; deal?: Deal | null; isLoading?: boolean }>()

    const emit = defineEmits<{ submit: [input: DealCreateInput] }>()

    const state = reactive<{
        amount: string
        clientId: string
        currency: Currency
        expectedCloseAt: string
        stage: DealStage
        title: string
    }>({
        amount: deal?.amount ?? '',
        clientId: deal?.client.id ?? '',
        currency: deal?.currency ?? 'BOB',
        expectedCloseAt: deal?.expectedCloseAt ?? '',
        stage: deal?.stage ?? 'LEAD',
        title: deal?.title ?? '',
    })

    const form = useTemplateRef('form')

    const clientItems = computed(() =>
        clients.map((client) => ({
            label: client.company ? `${client.name} · ${client.company}` : client.name,
            value: client.id,
        })),
    )
    const currencyItems = CURRENCIES.map((value) => ({ label: CURRENCY_LABEL[value], value }))
    const stageItems = DEAL_STAGES.map((value) => ({ label: DEAL_STAGE_LABEL[value], value }))

    // Fecha vacía = sin fecha: el schema la recibe como null.
    const formState = computed(() => ({ ...state, expectedCloseAt: state.expectedCloseAt || null }))

    const handleSubmit = (event: FormSubmitEvent<DealCreateInput>) => emit('submit', event.data)

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
        :schema="dealCreateSchema"
        :state="formState"
        @submit="handleSubmit"
    >
        <UFormField
            label="Título"
            name="title"
            required
        >
            <UInput
                v-model="state.title"
                class="w-full"
                placeholder="Landing + automatización de pedidos"
            />
        </UFormField>

        <UFormField
            label="Cliente"
            name="clientId"
            required
        >
            <USelectMenu
                v-model="state.clientId"
                class="w-full"
                :items="clientItems"
                placeholder="Busca un cliente"
                valueKey="value"
            />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
                label="Monto"
                name="amount"
                required
            >
                <UInput
                    v-model="state.amount"
                    class="w-full"
                    inputmode="decimal"
                    placeholder="4500.00"
                />
            </UFormField>
            <UFormField
                label="Moneda"
                name="currency"
            >
                <USelect
                    v-model="state.currency"
                    class="w-full"
                    :items="currencyItems"
                />
            </UFormField>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
                v-if="!deal"
                label="Etapa"
                name="stage"
            >
                <USelect
                    v-model="state.stage"
                    class="w-full"
                    :items="stageItems"
                />
            </UFormField>
            <UFormField
                label="Cierre estimado"
                name="expectedCloseAt"
            >
                <UInput
                    v-model="state.expectedCloseAt"
                    class="w-full"
                    type="date"
                />
            </UFormField>
        </div>

        <div class="flex justify-end">
            <UButton
                :loading="isLoading"
                type="submit"
            >
                {{ deal ? 'Guardar cambios' : 'Crear oportunidad' }}
            </UButton>
        </div>
    </UForm>
</template>
