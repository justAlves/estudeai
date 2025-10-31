import { api } from "@/lib/api"

export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post("/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  })

  return response.data.url
}

