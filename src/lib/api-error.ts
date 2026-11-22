import { isAxiosError } from "axios"

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback

  if (!error.response) {
    return "Não foi possível conectar à API. Confira se o backend está em execução e se VITE_API_URL está configurada."
  }

  const message: unknown = error.response.data?.message

  if (error.response.status < 500) {
    if (typeof message === "string" && message.trim()) return message
    if (Array.isArray(message)) {
      const messages = message.filter((item): item is string => typeof item === "string")
      if (messages.length) return messages.join(" ")
    }
  }

  return fallback
}
