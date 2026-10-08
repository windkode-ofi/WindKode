import { useToast } from '@nuxt/ui/composables'

/** Único canal de mensajes al usuario en el panel. */
export const useAppToast = () => {
    const toast = useToast()

    return {
        error: (description: string, title = 'Algo salió mal') =>
            toast.add({ color: 'error', description, icon: 'i-lucide-circle-alert', title }),
        success: (title: string, description?: string) =>
            toast.add({
                color: 'success',
                icon: 'i-lucide-circle-check',
                title,
                ...(description ? { description } : {}),
            }),
    }
}
