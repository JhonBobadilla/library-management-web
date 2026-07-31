import type { User } from '../../types/user'

interface UsersTableProps {
  users: User[]
  deletingId: number | null
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const parts = dateStr.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return dateStr
}

function getFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`
}

export default function UsersTable({ users, deletingId, onEdit, onDelete }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay usuarios registrados.</p>
      </div>
    )
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre completo</th>
            <th>Correo electrónico</th>
            <th>Fecha de nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{getFullName(user)}</td>
              <td>{user.email}</td>
              <td>{formatDate(user.birthDate)}</td>
              <td className="actions-cell">
                <button
                  className="btn btn--small btn--outline"
                  onClick={() => onEdit(user)}
                  disabled={deletingId === user.id}
                >
                  Editar
                </button>
                <button
                  className="btn btn--small btn--danger"
                  onClick={() => onDelete(user)}
                  disabled={deletingId === user.id}
                >
                  {deletingId === user.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
