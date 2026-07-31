import type { Loan } from '../../types/loan'

interface LoansTableProps {
  loans: Loan[]
  returningId: number | null
  onReturn: (loan: Loan) => void
}

function formatDate(iso: string): string {
  const parts = iso.split('T')[0].split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return iso
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = iso.split('T')
  if (d.length < 2) return formatDate(iso)
  const dateParts = d[0].split('-')
  const timeParts = d[1].split(':')
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} ${timeParts[0]}:${timeParts[1]}`
}

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    SCHEDULED: 'Programado',
    ACTIVE: 'Activo',
    OVERDUE: 'Vencido',
    RETURNED: 'Devuelto',
  }
  return map[status] ?? status
}

function statusClass(status: string): string {
  return `status--${status.toLowerCase()}`
}

export default function LoansTable({ loans, returningId, onReturn }: LoansTableProps) {
  if (loans.length === 0) {
    return (
      <div className="empty-state">
        <p>No se encontraron préstamos.</p>
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
            <th>Usuario</th>
            <th>Libro</th>
            <th>ISBN</th>
            <th>Ejemplar</th>
            <th>Fecha de préstamo</th>
            <th>Fecha límite</th>
            <th>Estado</th>
            <th>Fecha de devolución</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.user.firstName} {loan.user.lastName}</td>
              <td>{loan.book.title}</td>
              <td>{loan.book.isbn}</td>
              <td><code className="inventory-code">{loan.bookCopy.inventoryCode}</code></td>
              <td>{formatDate(loan.loanDate)}</td>
              <td>{formatDate(loan.dueDate)}</td>
              <td>
                <span className={`status-tag ${statusClass(loan.status)}`}>
                  {translateStatus(loan.status)}
                </span>
              </td>
              <td>{formatDateTime(loan.returnedAt)}</td>
              <td className="actions-cell">
                {loan.status !== 'RETURNED' && (
                  <button
                    type="button"
                    className="btn btn--small btn--outline"
                    onClick={() => onReturn(loan)}
                    disabled={returningId === loan.id}
                  >
                    {returningId === loan.id ? 'Devolviendo...' : 'Registrar devolución'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
