import { useState } from 'react'
import { auth } from '@/lib/auth'
import { uploadProfileImage } from '@/api/services/upload'
import { useUserStore } from '@/store/user.store'
import { toast } from 'sonner'

interface UpdateUserData {
  name?: string
  email?: string
  image?: string
}

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useUserStore()

  const updateUser = async (data: UpdateUserData, imageFile?: File) => {
    setIsLoading(true)
    setError(null)

    try {
      let imageUrl = data.image

      // Se há um arquivo de imagem, fazer upload primeiro
      if (imageFile) {
        imageUrl = await uploadProfileImage(imageFile)
      }

      // Atualizar usuário via API endpoint que usa Better Auth internamente
      const updateData: UpdateUserData = { ...data }
      if (imageUrl) {
        updateData.image = imageUrl
      }

      const response = await auth.updateUser({
        name: data.name,
        image: imageUrl,
      })

      // Refetch session para garantir dados atualizados
      const session = await auth.getSession()
      if (session.data?.user) {
        setUser(session.data.user)
      }

      toast.success('Perfil atualizado com sucesso!')
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUser,
    isLoading,
    error,
  }
}

