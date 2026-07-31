import { useState, type FormEvent } from 'react'
import type { User, UserPayload } from '../../types/user'

interface FieldErrors {
  firstName?: string
  lastName?: string
  email?: string
  birthDate?: string
}

interface UserFormProps {
  user: User | null
  serverError: string | null
  isSaving: boolean
  onSubmit: (payload: UserPayload) => void
  onCancel: () => void
}

function validate(payload: UserPayload): FieldErrors {
  const errors: FieldErrors = {}
  const firstName = payload.firstName.trim()
  const lastName = payload.lastName.trim()
  const email = payload.email.trim()
  const birthDate = payload.birthDate

  if (!firstName) {
    errors.firstName = 'El nombre es obligatorio.'
  } else if (firstName.length > 100) {
    errors.firstName = 'El nombre no puede exceder 100 caracteres.'
  }

  if (!lastName) {
    errors.lastName = 'Los apellidos son obligatorios.'
  } else if (lastName.length > 100) {
    errors.lastName = 'Los apellidos no pueden exceder 100 caracteres.'
  }

  if (!email) {
    errors.email = 'El correo electrónico es obligatorio.'
  } else if (email.length > 150) {
    errors.email = 'El correo no puede exceder 150 caracteres.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingrese un correo electrónico válido.'
  }

  if (!birthDate) {
    errors.birthDate = 'La fecha de nacimiento es obligatoria.'
  } else {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const selected = new Date(birthDate)
    if (selected > today) {
      errors.birthDate = 'La fecha de nacimiento no puede ser posterior a la fecha actual.'
    }
  }

  return errors
}

export default function UserForm({ user, serverError, isSaving, onSubmit, onCancel }: UserFormProps) {
  const [payload, setPayload] = useState<UserPayload>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    birthDate: user?.birthDate ?? '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function handleChange(field: keyof UserPayload, value: string) {
    setPayload((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed: UserPayload = {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim(),
      birthDate: payload.birthDate,
    }
    const errors = validate(trimmed)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    onSubmit(trimmed)
  }

  const isEditing = user !== null

  return (
    <div className="form-card">
      <h3 className="form-title">{isEditing ? 'Editar usuario' : 'Crear usuario'}</h3>

      {serverError && (
        <div className="alert alert--error" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="firstName">Nombres</label>
            <input
              id="firstName"
              type="text"
              value={payload.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              autoComplete="given-name"
              aria-invalid={fieldErrors.firstName ? 'true' : undefined}
            />
            {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Apellidos</label>
            <input
              id="lastName"
              type="text"
              value={payload.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              autoComplete="family-name"
              aria-invalid={fieldErrors.lastName ? 'true' : undefined}
            />
            {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={payload.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
              aria-invalid={fieldErrors.email ? 'true' : undefined}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            <input
              id="birthDate"
              type="date"
              value={payload.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              autoComplete="bday"
              aria-invalid={fieldErrors.birthDate ? 'true' : undefined}
            />
            {fieldErrors.birthDate && <span className="field-error">{fieldErrors.birthDate}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={isSaving}>
            {isSaving ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar usuario' : 'Guardar usuario')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
