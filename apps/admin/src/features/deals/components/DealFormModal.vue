<script setup lang="ts">
    import type { ClientSummary, Deal, DealCreateInput } from '@windkode/shared'

    import { ref, useTemplateRef } from 'vue'

    import { useAppToast } from '~/shared/composables/useAppToast'

    import { dealsService } from '../services/dealsService'
    import DealForm from './DealForm.vue'

    const { clients, deal = null } = defineProps<{ clients: ClientSummary[]; deal?: Deal | null }>()

    const emit = defineEmits<{ remove: [deal: Deal]; saved: [deal: Deal] }>()

    const open = defineModel<boolean>('open', { default: false })

    const toast = useAppToast()
    const form = useTemplateRef('form')
    const isLoading = ref(false)

    const handleSubmit = async (input: DealCreateInput) => {
        isLoading.value = true

        const { stage, ...fields } = input
        const result = deal
            ? await dealsService.update(deal.id, fields)
            : await dealsService.create({ ...fields, stage })

        isLoading.value = false

        if (!result.success) {
            if (result.fieldErrors) form.value?.setFieldErrors(result.fieldErrors)
            toast.error(result.error)

            return
        }

        toast.success(deal ? 'Oportunidad actualizada' : 'Oportunidad creada', result.data.title)
        open.value = false
        emit('saved', result.data)
    }
</script>

<template>
    <UModal
        v-model:open="open"
        :description="
            deal
                ? `${deal.client.name} · responsable: ${deal.owner.name}`
                : 'Registra una venta posible y su monto estimado.'
        "
        :title="deal ? 'Editar oportunidad' : 'Nueva oportunidad'"
    >
        <template #body>
            <DealForm
                :key="deal?.id ?? 'nueva'"
                ref="form"
                :clients="clients"
                :deal="deal"
                :isLoading="isLoading"
                @submit="handleSubmit"
            />
        </template>
        <template
            v-if="deal"
            #footer
        >
            <UButton
                color="error"
                icon="i-lucide-trash-2"
                label="Eliminar"
                variant="ghost"
                @click="emit('remove', deal)"
            />
        </template>
    </UModal>
</template>
