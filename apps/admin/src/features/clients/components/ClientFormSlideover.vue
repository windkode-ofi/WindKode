<script setup lang="ts">
    import type { Client, ClientCreateInput } from '@windkode/shared'

    import { ref, useTemplateRef } from 'vue'

    import { useAppToast } from '~/shared/composables/useAppToast'

    import { clientsService } from '../services/clientsService'
    import ClientForm from './ClientForm.vue'

    /** Contenedor fino del formulario: crea o edita según reciba `client`, y avisa con `saved`. */
    const { client = null } = defineProps<{ client?: Client | null }>()

    const emit = defineEmits<{ saved: [client: Client] }>()

    const open = defineModel<boolean>('open', { default: false })

    const toast = useAppToast()
    const form = useTemplateRef('form')
    const isLoading = ref(false)

    const handleSubmit = async (input: ClientCreateInput) => {
        isLoading.value = true

        const result = client ? await clientsService.update(client.id, input) : await clientsService.create(input)

        isLoading.value = false

        if (!result.success) {
            if (result.fieldErrors) form.value?.setFieldErrors(result.fieldErrors)
            toast.error(result.error)

            return
        }

        toast.success(client ? 'Cliente actualizado' : 'Cliente creado', result.data.name)
        open.value = false
        emit('saved', result.data)
    }
</script>

<template>
    <USlideover
        v-model:open="open"
        :description="
            client
                ? 'Actualiza los datos y el estado del contacto.'
                : 'Registra a la persona, su empresa y qué le podemos aportar.'
        "
        :title="client ? 'Editar cliente' : 'Nuevo cliente'"
    >
        <template #body>
            <ClientForm
                :key="client?.id ?? 'nuevo'"
                ref="form"
                :client="client"
                :isLoading="isLoading"
                @submit="handleSubmit"
            />
        </template>
    </USlideover>
</template>
