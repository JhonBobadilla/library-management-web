import axios from 'axios'
import type { ApiErrorResponse } from '../types/api-error'

const API_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: 'El correo electrónico ya está registrado.',
  INVALID_BIRTH_DATE: 'La fecha de nacimiento no puede ser posterior a la fecha actual.',
  USER_HAS_LOANS: 'El usuario tiene préstamos registrados y no puede ser eliminado.',
  USER_NOT_FOUND: 'El usuario no fue encontrado.',
}

const VALIDATION_FIELD_MESSAGES: Record<string, string> = {
  firstName: 'Los nombres son obligatorios o no son válidos.',
  lastName: 'Los apellidos son obligatorios o no son válidos.',
  email: 'El correo electrónico no es válido.',
  birthDate: 'La fecha de nacimiento no es válida.',
}

function getHttpStatusMessage(status: number): string | null {
  const messages: Record<number, string> = {
    400: 'Los datos enviados no son válidos.',
    404: 'El recurso solicitado no fue encontrado.',
    409: 'La operación no puede realizarse por una regla del sistema.',
    500: 'Ocurrió un error interno en el servidor.',
  }
  return messages[status] ?? null
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined
    const status = error.response?.status

    if (data?.code && API_ERROR_MESSAGES[data.code]) {
      return API_ERROR_MESSAGES[data.code]
    }

    if (data?.validationErrors) {
      const entries = Object.entries(data.validationErrors)
      if (entries.length > 0) {
        const [field] = entries[0]
        return VALIDATION_FIELD_MESSAGES[field] ?? 'Los datos enviados no son válidos.'
      }
    }

    if (status) {
      const statusMessage = getHttpStatusMessage(status)
      if (statusMessage) return statusMessage
    }

    if (error.message === 'Network Error') {
      return 'No fue posible conectar con el servidor.'
    }

    return 'Ocurrió un error inesperado.'
  }

  return 'Ocurrió un error inesperado.'
}

export function getServerValidationErrors(error: unknown): Record<string, string> | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined
    if (data?.validationErrors && Object.keys(data.validationErrors).length > 0) {
      const translated: Record<string, string> = {}
      for (const [field, msg] of Object.entries(data.validationErrors)) {
        translated[field] = VALIDATION_FIELD_MESSAGES[field] ?? msg
      }
      return translated
    }
  }
  return null
}
