<script setup lang="ts">
    import type { TableColumn } from '@nuxt/ui'
    import type { User, UserCreateInput, UserRole } from '@windkode/shared'

    import { USER_ROLE_COLOR, USER_ROLE_LABEL } from '@windkode/shared'
    import { h, onMounted, ref, resolveComponent, useTemplateRef } from 'vue'

    import CommonStatusBadge from '~/shared/components/common/CommonStatusBadge.vue'
    import { useAppToast } from '~/shared/composables/useAppToast'
    import { useAuthStore } from '~/shared/stores/authStore'
    import { formatDate } from '~/shared/utils/date'

    import UserForm from '../components/UserForm.vue'
    import { usersService } from '../services/usersService'

    const auth = useAuthStore()
    const toast = useAppToast()
    const form = useTemplateRef('form')

    const users = ref<User[]>([])
    const isLoading = ref(false)
    const isSaving = ref(false)
    const isModalOpen = ref(false)

    const USwitch = resolveComponent('USwitch')
    const USelect = resolveComponent('USelect')

    const roleItems = (['ADMIN', 'SELLER'] as const satisfies readonly UserRole[]).map((value) => ({
        label: USER_ROLE_LABEL[value],
        value,
    }))

    const replaceUser = (updated: User) => {
        users.value = users.value.map((user) => (user.id === updated.id ? updated : user))
    }

    const handleUpdate = async (user: User, input: { isActive?: boolean; role?: UserRole }) => {
        const result = await usersService.update(user.id, input)

        if (!result.success) {
            toast.error(result.error)

            return
        }

        replaceUser(result.data)
        toast.success('Usuario actualizado', result.data.name)
    }

    const columns: TableColumn<User>[] = [
        {
            accessorKey: 'name',
            cell: ({ row }) =>
                h('div', [
                    h('p', { class: 'font-medium text-highlighted' }, row.original.name),
                    h('p', { class: 'text-xs text-muted' }, row.original.email),
                ]),
            header: 'Persona',
        },
        {
            accessorKey: 'role',
            cell: ({ row }) =>
                row.original.id === auth.user?.id
                    ? h(CommonStatusBadge, {
                          colors: USER_ROLE_COLOR,
                          labels: USER_ROLE_LABEL,
                          value: row.original.role,
                      })
                    : h(USelect, {
                          class: 'w-40',
                          items: roleItems,
                          modelValue: row.original.role,
                          'onUpdate:modelValue': (role: UserRole) => handleUpdate(row.original, { role }),
                      }),
            header: 'Rol',
        },
        {
            accessorKey: 'isActive',
            cell: ({ row }) =>
                h(USwitch, {
                    disabled: row.original.id === auth.user?.id,
                    label: row.original.isActive ? 'Activo' : 'Desactivado',
                    modelValue: row.original.isActive,
                    'onUpdate:modelValue': (isActive: boolean) => handleUpdate(row.original, { isActive }),
                }),
            header: 'Acceso',
        },
        { accessorKey: 'createdAt', cell: ({ row }) => formatDate(row.original.createdAt), header: 'Alta' },
    ]

    const loadUsers = async () => {
        isLoading.value = true

        const result = await usersService.findAll()

        isLoading.value = false

        if (result.success) users.value = result.data
        else toast.error(result.error)
    }

    const handleCreate = async (input: UserCreateInput) => {
        isSaving.value = true

        const result = await usersService.create(input)

        isSaving.value = false

        if (!result.success) {
            if (result.fieldErrors) form.value?.setFieldErrors(result.fieldErrors)
            toast.error(result.error)

            return
        }

        users.value = [...users.value, result.data].sort((a, b) => a.name.localeCompare(b.name))
        isModalOpen.value = false
        toast.success('Usuario creado', `${result.data.name} ya puede iniciar sesión.`)
    }

    onMounted(loadUsers)
</script>

<template>
    <UDashboardPanel id="users">
        <template #header>
            <UDashboardNavbar title="Equipo">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <UButton
                        icon="i-lucide-user-plus"
                        label="Nuevo usuario"
                        @click="isModalOpen = true"
                    />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <UTable
                :columns="columns"
                :data="users"
                empty="No hay usuarios."
                :loading="isLoading"
            />

            <UModal
                v-model:open="isModalOpen"
                description="Ventas y desarrollo comparten el CRM; solo los administradores gestionan el equipo."
                title="Nuevo usuario"
            >
                <template #body>
                    <UserForm
                        ref="form"
                        :isLoading="isSaving"
                        @submit="handleCreate"
                    />
                </template>
            </UModal>
        </template>
    </UDashboardPanel>
</template>
