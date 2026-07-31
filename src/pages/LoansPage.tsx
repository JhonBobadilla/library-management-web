import { useState, useEffect, useCallback } from 'react'
import type { User } from '../types/user'
import type { Book } from '../types/book'
import type { Loan, LoanFilters as LoanFiltersType, LoanCreatePayload } from '../types/loan'
import * as loanService from '../services/loanService'
import * as userService from '../services/userService'
import * as bookService from '../services/bookService'
import { getApiErrorMessage, getServerValidationErrors } from '../utils/getApiErrorMessage'
import LoanForm from '../components/loans/LoanForm'
import LoansFilters from '../components/loans/LoansFilters'
import LoansTable from '../components/loans/LoansTable'

export default function LoansPage() {
  const [users, setUsers] = useState<User[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)
  const [isLoadingLoans, setIsLoadingLoans] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formServerError, setFormServerError] = useState<string | null>(null)
  const [returningId, setReturningId] = useState<number | null>(null)
  const [currentFilters, setCurrentFilters] = useState<LoanFiltersType>({})

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true)
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch {
      // users error handled silently, filters will just be empty
    } finally {
      setIsLoadingUsers(false)
    }
  }, [])

  const fetchBooks = useCallback(async () => {
    setIsLoadingBooks(true)
    try {
      const data = await bookService.getBooks()
      setBooks(data)
    } catch {
      // books error handled silently
    } finally {
      setIsLoadingBooks(false)
    }
  }, [])

  const fetchLoans = useCallback(async (filters?: LoanFiltersType) => {
    setIsLoadingLoans(true)
    setLoadError(null)
    try {
      const data = await loanService.getLoans(filters)
      setLoans(data)
    } catch (err: unknown) {
      setLoadError(getApiErrorMessage(err))
    } finally {
      setIsLoadingLoans(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchBooks()
    fetchLoans()
  }, [fetchUsers, fetchBooks, fetchLoans])

  function clearMessages() {
    setSuccessMessage(null)
    setLoadError(null)
    setFormServerError(null)
  }

  function openForm() {
    clearMessages()
    setFormServerError(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setFormServerError(null)
  }

  function handleApplyFilters(filters: LoanFiltersType) {
    setCurrentFilters(filters)
    fetchLoans(filters)
  }

  function handleClearFilters() {
    setCurrentFilters({})
    fetchLoans()
  }

  async function handleCreate(payload: LoanCreatePayload) {
    setIsSaving(true)
    setFormServerError(null)
    try {
      await loanService.createLoan(payload)
      setSuccessMessage('Préstamo registrado correctamente.')
      closeForm()
      await Promise.all([fetchLoans(currentFilters), fetchBooks()])
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

  async function handleReturn(loan: Loan) {
    const confirmed = window.confirm(`¿Confirma la devolución del ejemplar ${loan.bookCopy.inventoryCode}?`)
    if (!confirmed) return

    setReturningId(loan.id)
    clearMessages()
    try {
      await loanService.returnLoan(loan.id)
      setSuccessMessage('Devolución registrada correctamente.')
      await Promise.all([fetchLoans(currentFilters), fetchBooks()])
    } catch (err: unknown) {
      setLoadError(getApiErrorMessage(err))
    } finally {
      setReturningId(null)
    }
  }

  const isLoading = isLoadingLoans || isLoadingUsers || isLoadingBooks

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Préstamos</h2>
          <p className="page-description">Registra, consulta y gestiona los préstamos de ejemplares.</p>
        </div>
        {!showForm && (
          <button className="btn btn--primary" onClick={openForm}>
            Nuevo préstamo
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert alert--success" role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

      {loadError && !isLoadingLoans && (
        <div className="alert alert--error" role="alert">
          {loadError}
        </div>
      )}

      {showForm && (
        <LoanForm
          serverError={formServerError}
          isSaving={isSaving}
          onSubmit={handleCreate}
          onCancel={closeForm}
        />
      )}

      {!showForm && (
        <>
          <LoansFilters
            users={users}
            books={books}
            isLoading={isLoading}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />

          {isLoadingLoans ? (
            <div className="loading-indicator" role="status" aria-live="polite">
              Cargando préstamos...
            </div>
          ) : (
            <LoansTable
              loans={loans}
              returningId={returningId}
              onReturn={handleReturn}
            />
          )}
        </>
      )}
    </div>
  )
}
