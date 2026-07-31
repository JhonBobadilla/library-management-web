import { useState, useEffect, useCallback } from 'react'
import type { Book, BookCreatePayload, BookUpdatePayload } from '../types/book'
import * as bookService from '../services/bookService'
import { getApiErrorMessage, getServerValidationErrors } from '../utils/getApiErrorMessage'
import BookForm from '../components/books/BookForm'
import BooksTable from '../components/books/BooksTable'
import AvailableCopiesPanel from '../components/books/AvailableCopiesPanel'

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formServerError, setFormServerError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showCopiesPanel, setShowCopiesPanel] = useState(false)
  const [copiesBook, setCopiesBook] = useState<Book | undefined>(undefined)

  const fetchBooks = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await bookService.getBooks()
      setBooks(data)
    } catch (err: unknown) {
      setLoadError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  function clearMessages() {
    setSuccessMessage(null)
    setLoadError(null)
    setFormServerError(null)
  }

  function openCreateForm() {
    clearMessages()
    setEditingBook(null)
    setFormServerError(null)
    setShowForm(true)
    setShowCopiesPanel(false)
  }

  function openEditForm(book: Book) {
    clearMessages()
    setEditingBook(book)
    setFormServerError(null)
    setShowForm(true)
    setShowCopiesPanel(false)
  }

  function closeForm() {
    setShowForm(false)
    setEditingBook(null)
    setFormServerError(null)
  }

  function openCopiesPanel(book: Book) {
    clearMessages()
    setShowForm(false)
    setCopiesBook(book)
    setShowCopiesPanel(true)
  }

  function closeCopiesPanel() {
    setShowCopiesPanel(false)
    setCopiesBook(undefined)
  }

  async function handleCreate(payload: BookCreatePayload | BookUpdatePayload) {
    setIsSaving(true)
    setFormServerError(null)
    try {
      await bookService.createBook(payload as BookCreatePayload)
      setSuccessMessage('Libro creado correctamente.')
      closeForm()
      await fetchBooks()
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

  async function handleUpdate(payload: BookCreatePayload | BookUpdatePayload) {
    if (!editingBook) return
    setIsSaving(true)
    setFormServerError(null)
    try {
      await bookService.updateBook(editingBook.id, payload as BookUpdatePayload)
      setSuccessMessage('Libro actualizado correctamente.')
      closeForm()
      await fetchBooks()
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

  async function handleDelete(book: Book) {
    const confirmed = window.confirm(`¿Confirma que desea eliminar el libro «${book.title}»?`)
    if (!confirmed) return

    setDeletingId(book.id)
    clearMessages()
    try {
      await bookService.deleteBook(book.id)
      setSuccessMessage('Libro eliminado correctamente.')
      await fetchBooks()
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
          <h2 className="page-title">Libros</h2>
          <p className="page-description">Administra el catálogo de libros y sus ejemplares físicos.</p>
        </div>
        {!showForm && !showCopiesPanel && (
          <button className="btn btn--primary" onClick={openCreateForm}>
            Nuevo libro
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
        <BookForm
          book={editingBook}
          serverError={formServerError}
          isSaving={isSaving}
          onSubmit={editingBook ? handleUpdate : handleCreate}
          onCancel={closeForm}
        />
      )}

      {showCopiesPanel && (
        <AvailableCopiesPanel
          initialBook={copiesBook}
          onClose={closeCopiesPanel}
        />
      )}

      {!showForm && !showCopiesPanel && (
        isLoading ? (
          <div className="loading-indicator" role="status" aria-live="polite">
            Cargando libros...
          </div>
        ) : (
          <BooksTable
            books={books}
            deletingId={deletingId}
            onEdit={openEditForm}
            onViewCopies={openCopiesPanel}
            onDelete={handleDelete}
          />
        )
      )}
    </div>
  )
}
