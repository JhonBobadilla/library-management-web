import { useState, useEffect, type FormEvent } from 'react'
import type { User } from '../../types/user'
import type { Book, BookCopy } from '../../types/book'
import type { LoanCreatePayload } from '../../types/loan'
import * as userService from '../../services/userService'
import * as bookService from '../../services/bookService'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'

interface LoanFormProps {
  serverError: string | null
  isSaving: boolean
  onSubmit: (payload: LoanCreatePayload) => void
  onCancel: () => void
}

interface FieldErrors {
  userId?: string
  bookId?: string
  bookCopyId?: string
  loanDate?: string
  dueDate?: string
}

function getTodayISO(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function LoanForm({ serverError, isSaving, onSubmit, onCancel }: LoanFormProps) {
  const [users, setUsers] = useState<User[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [copies, setCopies] = useState<BookCopy[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)
  const [isLoadingCopies, setIsLoadingCopies] = useState(false)
  const [copiesError, setCopiesError] = useState<string | null>(null)

  const today = getTodayISO()
  const defaultDue = addDays(today, 14)

  const [userId, setUserId] = useState<number>(0)
  const [bookId, setBookId] = useState<number>(0)
  const [bookCopyId, setBookCopyId] = useState<number>(0)
  const [loanDate, setLoanDate] = useState(today)
  const [dueDate, setDueDate] = useState(defaultDue)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    userService.getUsers().then(setUsers).catch(() => {}).finally(() => setIsLoadingUsers(false))
    bookService.getBooks().then(setBooks).catch(() => {}).finally(() => setIsLoadingBooks(false))
  }, [])

  useEffect(() => {
    if (!bookId) {
      setCopies([])
      setBookCopyId(0)
      setCopiesError(null)
      return
    }
    const book = books.find((b) => b.id === bookId)
    if (!book) return

    setIsLoadingCopies(true)
    setCopiesError(null)
    setBookCopyId(0)
    bookService.getAvailableCopiesByIsbn(book.isbn)
      .then((res) => setCopies(res.copies))
      .catch((err: unknown) => setCopiesError(getApiErrorMessage(err)))
      .finally(() => setIsLoadingCopies(false))
  }, [bookId, books])

  function handleBookChange(value: number) {
    setBookId(value)
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next.bookCopyId
      delete next.bookId
      return next
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errors: FieldErrors = {}

    if (!userId) {
      errors.userId = 'Debe seleccionar un usuario.'
    }
    if (!bookId) {
      errors.bookId = 'Debe seleccionar un libro.'
    }
    if (!bookCopyId) {
      errors.bookCopyId = 'Debe seleccionar un ejemplar disponible.'
    }
    if (!loanDate) {
      errors.loanDate = 'La fecha de préstamo es obligatoria.'
    }
    if (!dueDate) {
      errors.dueDate = 'La fecha límite es obligatoria.'
    } else if (loanDate && dueDate < loanDate) {
      errors.dueDate = 'La fecha límite no puede ser anterior a la fecha de préstamo.'
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    onSubmit({ userId, bookCopyId, loanDate, dueDate })
  }

  const selectedBook = books.find((b) => b.id === bookId)

  return (
    <div className="form-wrapper">
      <h3 className="form-title">Registrar préstamo</h3>

      {serverError && (
        <div className="alert alert--error" role="alert">
          {serverError}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid form-grid--3">
          <div className="form-field">
            <label htmlFor="loanUserId">Usuario</label>
            <select
              id="loanUserId"
              value={userId}
              onChange={(e) => { setUserId(parseInt(e.target.value, 10)); setFieldErrors((prev) => { const n = { ...prev }; delete n.userId; return n }) }}
              aria-invalid={fieldErrors.userId ? 'true' : undefined}
              disabled={isLoadingUsers}
            >
              <option value={0}>Seleccione un usuario</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} — {u.email}
                </option>
              ))}
            </select>
            {isLoadingUsers && <span className="field-error">Cargando usuarios...</span>}
            {fieldErrors.userId && <span className="field-error">{fieldErrors.userId}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="loanBookId">Libro</label>
            <select
              id="loanBookId"
              value={bookId}
              onChange={(e) => handleBookChange(parseInt(e.target.value, 10))}
              aria-invalid={fieldErrors.bookId ? 'true' : undefined}
              disabled={isLoadingBooks}
            >
              <option value={0}>Seleccione un libro</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.isbn}
                </option>
              ))}
            </select>
            {isLoadingBooks && <span className="field-error">Cargando libros...</span>}
            {fieldErrors.bookId && <span className="field-error">{fieldErrors.bookId}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="loanCopyId">Ejemplar disponible</label>
            <select
              id="loanCopyId"
              value={bookCopyId}
              onChange={(e) => { setBookCopyId(parseInt(e.target.value, 10)); setFieldErrors((prev) => { const n = { ...prev }; delete n.bookCopyId; return n }) }}
              aria-invalid={fieldErrors.bookCopyId ? 'true' : undefined}
              disabled={!bookId || isLoadingCopies}
            >
              <option value={0}>
                {!bookId
                  ? 'Seleccione un libro primero'
                  : isLoadingCopies
                    ? 'Cargando ejemplares...'
                    : copies.length === 0
                      ? 'No hay ejemplares disponibles'
                      : 'Seleccione un ejemplar'}
              </option>
              {copies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.inventoryCode}
                </option>
              ))}
            </select>
            {isLoadingCopies && <span className="field-error">Consultando ejemplares...</span>}
            {copiesError && <span className="field-error">{copiesError}</span>}
            {fieldErrors.bookCopyId && <span className="field-error">{fieldErrors.bookCopyId}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="loanDate">Fecha de préstamo</label>
            <input
              id="loanDate"
              type="date"
              value={loanDate}
              onChange={(e) => { setLoanDate(e.target.value); setFieldErrors((prev) => { const n = { ...prev }; delete n.loanDate; return n }) }}
              aria-invalid={fieldErrors.loanDate ? 'true' : undefined}
            />
            {fieldErrors.loanDate && <span className="field-error">{fieldErrors.loanDate}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="dueDate">Fecha límite de devolución</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => { setDueDate(e.target.value); setFieldErrors((prev) => { const n = { ...prev }; delete n.dueDate; return n }) }}
              aria-invalid={fieldErrors.dueDate ? 'true' : undefined}
            />
            {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
          </div>
        </div>

        {selectedBook && copies.length > 0 && (
          <div className="copies-summary" style={{ marginTop: 16, marginBottom: 0 }}>
            <strong>{selectedBook.title}</strong>
            <span>Ejemplares disponibles: {copies.length}</span>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={isSaving}>
            {isSaving ? 'Registrando...' : 'Registrar préstamo'}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
