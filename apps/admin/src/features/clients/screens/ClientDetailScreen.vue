<script setup lang="ts">
    import type { Client, ClientActivity, ClientActivityCreateInput, Deal } from '@windkode/shared'

    import {
        CLIENT_SOURCE_LABEL,
        CLIENT_STATUS_COLOR,
        CLIENT_STATUS_LABEL,
        DEAL_STAGE_COLOR,
        DEAL_STAGE_LABEL,
        formatMoney,
    } from '@windkode/shared'
    import { onMounted, ref, useTemplateRef, watch } from 'vue'

    import CommonStatusBadge from '~/shared/components/common/CommonStatusBadge.vue'
    import { useAppToast } from '~/shared/composables/useAppToast'
    import { formatDate } from '~/shared/utils/date'

    import { dealsService } from '../../deals/services/dealsService'
    import ClientActivityForm from '../components/ClientActivityForm.vue'
    import ClientActivityTimeline from '../components/ClientActivityTimeline.vue'
    import ClientFormSlideover from '../components/ClientFormSlideover.vue'
    import { clientsService } from '../services/clientsService'

    const { id } = defineProps<{ id: string }>()

    const toast = useAppToast()
    const activityForm = useTemplateRef('activityForm')

    const client = ref<Client | null>(null)
    const activities = ref<ClientActivity[]>([])
    const deals = ref<Deal[]>([])
    const isLoading = ref(true)
    const isSavingActivity = ref(false)
    const isFormOpen = ref(false)
    const notFound = ref<null | string>(null)

    const loadAll = async () => {
        isLoading.value = true

        const [clientResult, activitiesResult, dealsResult] = await Promise.all([
            clientsService.findOne(id),
            clientsService.findActivities(id),
            dealsService.findAll({ clientId: id }),
        ])

        isLoading.value = false

        if (!clientResult.success) {
            notFound.value = clientResult.error

            return
        }

        client.value = clientResult.data
        activities.value = activitiesResult.success ? activitiesResult.data : []
        deals.value = dealsResult.success ? dealsResult.data : []
    }

    const handleAddActivity = async (input: ClientActivityCreateInput) => {
        isSavingActivity.value = true

        const result = await clientsService.addActivity(id, input)

        isSavingActivity.value = false

        if (!result.success) {
            toast.error(result.error)

            return
        }

        toast.success('Interacción registrada')
        activityForm.value?.reset()
        // El estado y la fecha de último contacto pueden haber cambiado en la api.
        await loadAll()
    }

    const handleSaved = (updated: Client) => {
        client.value = updated
    }

    watch(() => id, loadAll)
    onMounted(loadAll)
</script>

<template>
    <UDashboardPanel id="client-detail">
        <template #header>
            <UDashboardNavbar :title="client?.name ?? 'Cliente'">
                <template #leading>
                    <UButton
                        aria-label="Volver a clientes"
                        color="neutral"
                        icon="i-lucide-arrow-left"
                        to="/clientes"
                        variant="ghost"
                    />
                </template>
                <template #right>
                    <UButton
                        v-if="client"
                        color="neutral"
                        icon="i-lucide-pencil"
                        label="Editar"
                        variant="outline"
                        @click="isFormOpen = true"
                    />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <UAlert
                v-if="notFound"
                color="error"
                :description="notFound"
                icon="i-lucide-circle-alert"
                variant="subtle"
            />

            <div
                v-else-if="isLoading && !client"
                class="space-y-3"
            >
                <USkeleton class="h-28 w-full" />
                <USkeleton class="h-48 w-full" />
            </div>

            <div
                v-else-if="client"
                class="grid gap-6 lg:grid-cols-3"
            >
                <div class="space-y-6 lg:col-span-1">
                    <UCard>
                        <div class="space-y-3">
                            <div class="flex items-start justify-between gap-2">
                                <div>
                                    <p class="text-lg font-semibold">
                                        {{ client.name }}
                                    </p>
                                    <p class="text-sm text-muted">
                                        {{ client.jobTitle ?? 'Sin cargo registrado'
                                        }}<template v-if="client.company"> · {{ client.company }} </template>
                                    </p>
                                </div>
                                <CommonStatusBadge
                                    :colors="CLIENT_STATUS_COLOR"
                                    :labels="CLIENT_STATUS_LABEL"
                                    :value="client.status"
                                />
                            </div>
                            <USeparator />
                            <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                                <dt class="text-muted">Correo</dt>
                                <dd class="truncate">
                                    {{ client.email ?? '—' }}
                                </dd>
                                <dt class="text-muted">Teléfono</dt>
                                <dd>{{ client.phone ?? '—' }}</dd>
                                <dt class="text-muted">Origen</dt>
                                <dd>{{ CLIENT_SOURCE_LABEL[client.source] }}</dd>
                                <dt class="text-muted">Responsable</dt>
                                <dd>{{ client.owner.name }}</dd>
                                <dt class="text-muted">Último contacto</dt>
                                <dd>{{ formatDate(client.lastActivityAt) }}</dd>
                            </dl>
                        </div>
                    </UCard>

                    <UCard>
                        <template #header>
                            <p class="flex items-center gap-2 font-medium">
                                <UIcon
                                    class="size-4 text-primary"
                                    name="i-lucide-sparkles"
                                />
                                Valor a agregar
                            </p>
                        </template>
                        <p
                            v-if="client.valueProposition"
                            class="text-sm whitespace-pre-line"
                        >
                            {{ client.valueProposition }}
                        </p>
                        <p
                            v-else
                            class="text-sm text-muted"
                        >
                            Aún no se definió qué le aporta WindKode. Complétalo para armar la propuesta.
                        </p>
                        <template
                            v-if="client.notes"
                            #footer
                        >
                            <p class="text-xs text-muted">Notas internas</p>
                            <p class="text-sm whitespace-pre-line">
                                {{ client.notes }}
                            </p>
                        </template>
                    </UCard>

                    <UCard>
                        <template #header>
                            <p class="font-medium">Oportunidades</p>
                        </template>
                        <p
                            v-if="!deals.length"
                            class="text-sm text-muted"
                        >
                            Sin oportunidades. Créalas desde el tablero de ventas.
                        </p>
                        <ul
                            v-else
                            class="space-y-3"
                        >
                            <li
                                v-for="deal in deals"
                                :key="deal.id"
                                class="flex items-center justify-between gap-2 text-sm"
                            >
                                <div class="min-w-0">
                                    <p class="truncate font-medium">
                                        {{ deal.title }}
                                    </p>
                                    <p class="text-xs text-muted">
                                        {{ formatMoney(deal.amount, deal.currency) }}
                                    </p>
                                </div>
                                <CommonStatusBadge
                                    :colors="DEAL_STAGE_COLOR"
                                    :labels="DEAL_STAGE_LABEL"
                                    :value="deal.stage"
                                />
                            </li>
                        </ul>
                    </UCard>
                </div>

                <UCard class="lg:col-span-2">
                    <template #header>
                        <p class="font-medium">Historial de interacciones</p>
                    </template>
                    <div class="space-y-6">
                        <ClientActivityForm
                            ref="activityForm"
                            :isLoading="isSavingActivity"
                            @submit="handleAddActivity"
                        />
                        <USeparator />
                        <ClientActivityTimeline :activities="activities" />
                    </div>
                </UCard>
            </div>

            <ClientFormSlideover
                v-model:open="isFormOpen"
                :client="client"
                @saved="handleSaved"
            />
        </template>
    </UDashboardPanel>
</template>
