import { useState, useEffect, useCallback } from 'react'
import type { User, UserPayload } from '../types/user'
import * as userService from '../services/userService'
import { getApiErrorMessage, getServerValidationErrors } from '../utils/getApiErrorMessage'
import UserForm from '../components/users/UserForm'
import UsersTable from '../components/users/UsersTable'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formServerError, setFormServerError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch (err: unknown) {
      setLoadError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function clearMessages() {
    setSuccessMessage(null)
    setLoadError(null)
    setFormServerError(null)
  }

  function openCreateForm() {
    clearMessages()
    setEditingUser(null)
    setFormServerError(null)
    setShowForm(true)
  }

  function openEditForm(user: User) {
    clearMessages()
    setEditingUser(user)
    setFormServerError(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingUser(null)
    setFormServerError(null)
  }

  async function handleCreate(payload: UserPayload) {
    setIsSaving(true)
    setFormServerError(null)
    try {
      await userService.createUser(payload)
      setSuccessMessage('Usuario creado correctamente.')
      closeForm()
      await fetchUsers()
    } catch (err: unknown) {
      const serverErrors = getServerValidationErrors(err)
      if (serverErrors) {
        setFormServerError(Object.values(serverErrors)[0])
      } else {
        setFormServerError(getApiErrorMessage(err))
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdate(payload: UserPayload) {
    if (!editingUser) return
    setIsSaving(true)
    setFormServerError(null)
    try {
      await userService.updateUser(editingUser.id, payload)
      setSuccessMessage('Usuario actualizado correctamente.')
      closeForm()
      await fetchUsers()
    } catch (err: unknown) {
      const serverErrors = getServerValidationErrors(err)
      if (serverErrors) {
        setFormServerError(Object.values(serverErrors)[0])
      } else {
        setFormServerError(getApiErrorMessage(err))
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(user: User) {
    const confirmed = window.confirm(`¿Confirma que desea eliminar a ${user.firstName} ${user.lastName}?`)
    if (!confirmed) return

    setDeletingId(user.id)
    clearMessages()
    try {
      await userService.deleteUser(user.id)
      setSuccessMessage('Usuario eliminado correctamente.')
      await fetchUsers()
    } catch (err: unknown) {
      setLoadError(getApiErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Usuarios</h2>
          <p className="page-description">Administra los usuarios registrados en la biblioteca.</p>
        </div>
        {!showForm && (
          <button className="btn btn--primary" onClick={openCreateForm}>
            Nuevo usuario
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert alert--success" role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

      {loadError && !isLoading && (
        <div className="alert alert--error" role="alert">
          {loadError}
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          serverError={formServerError}
          isSaving={isSaving}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          onCancel={closeForm}
        />
      )}

      {isLoading ? (
        <div className="loading-indicator" role="status" aria-live="polite">
          Cargando usuarios...
        </div>
      ) : (
        !showForm && (
          <UsersTable
            users={users}
            deletingId={deletingId}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        )
      )}
    </div>
  )
}
