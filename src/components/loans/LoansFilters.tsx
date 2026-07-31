import { useState, type FormEvent } from 'react'
import type { User } from '../../types/user'
import type { Book } from '../../types/book'
import type { LoanFilters as LoanFiltersType } from '../../types/loan'

interface LoansFiltersProps {
  users: User[]
  books: Book[]
  isLoading: boolean
  onApply: (filters: LoanFiltersType) => void
  onClear: () => void
}

export default function LoansFilters({ users, books, isLoading, onApply, onClear }: LoansFiltersProps) {
  const [userId, setUserId] = useState<number>(0)
  const [bookId, setBookId] = useState<number>(0)

  function handleApply(e: FormEvent) {
    e.preventDefault()
    const filters: LoanFiltersType = {}
    if (userId) filters.userId = userId
    if (bookId) filters.bookId = bookId
    onApply(filters)
  }

  function handleClear() {
    setUserId(0)
    setBookId(0)
    onClear()
  }

  return (
    <form className="loans-filters filters-card" onSubmit={handleApply}>
      <div className="form-field">
        <label htmlFor="filterUserId">Usuario</label>
        <select
          id="filterUserId"
          value={userId}
          onChange={(e) => setUserId(parseInt(e.target.value, 10))}
          disabled={isLoading}
        >
          <option value={0}>Todos los usuarios</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName} — {u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="filterBookId">Libro</label>
        <select
          id="filterBookId"
          value={bookId}
          onChange={(e) => setBookId(parseInt(e.target.value, 10))}
          disabled={isLoading}
        >
          <option value={0}>Todos los libros</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} — {b.isbn}
            </option>
          ))}
        </select>
      </div>

      <div className="filters-actions">
        <button type="submit" className="btn btn--primary btn--small" disabled={isLoading}>
          Aplicar filtros
        </button>
        <button type="button" className="btn btn--secondary btn--small" onClick={handleClear} disabled={isLoading}>
          Limpiar filtros
        </button>
      </div>
    </form>
  )
}
