import { useState, type FormEvent } from 'react'
import type { Book, BookCreatePayload, BookUpdatePayload } from '../../types/book'

interface FormState {
  title: string
  isbn: string
  edition: string
  publicationDate: string
  author: string
  numberOfCopies: number
}

interface FieldErrors {
  title?: string
  isbn?: string
  edition?: string
  publicationDate?: string
  author?: string
  numberOfCopies?: string
}

interface BookFormProps {
  book: Book | null
  serverError: string | null
  isSaving: boolean
  onSubmit: (payload: BookCreatePayload | BookUpdatePayload) => void
  onCancel: () => void
}

function validateForm(state: FormState, isEditing: boolean): FieldErrors {
  const errors: FieldErrors = {}
  const title = state.title.trim()
  const isbn = state.isbn.trim()
  const edition = state.edition.trim()
  const author = state.author.trim()

  if (!title) {
    errors.title = 'El título es obligatorio.'
  } else if (title.length > 200) {
    errors.title = 'El título no puede exceder 200 caracteres.'
  }

  if (!isbn) {
    errors.isbn = 'El ISBN es obligatorio.'
  } else if (isbn.length > 20) {
    errors.isbn = 'El ISBN no puede exceder 20 caracteres.'
  }

  if (edition.length > 100) {
    errors.edition = 'La edición no puede exceder 100 caracteres.'
  }

  if (!author) {
    errors.author = 'El autor es obligatorio.'
  } else if (author.length > 150) {
    errors.author = 'El autor no puede exceder 150 caracteres.'
  }

  if (!isEditing && (state.numberOfCopies < 1 || state.numberOfCopies > 100)) {
    errors.numberOfCopies = 'La cantidad de ejemplares debe estar entre 1 y 100.'
  }

  return errors
}

export default function BookForm({ book, serverError, isSaving, onSubmit, onCancel }: BookFormProps) {
  const isEditing = book !== null

  const [state, setState] = useState<FormState>({
    title: book?.title ?? '',
    isbn: book?.isbn ?? '',
    edition: book?.edition ?? '',
    publicationDate: book?.publicationDate ?? '',
    author: book?.author ?? '',
    numberOfCopies: 1,
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function handleChange(field: keyof FormState, value: string | number) {
    setState((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field as keyof FieldErrors]
        return next
      })
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const trimmed = {
      title: state.title.trim(),
      isbn: state.isbn.trim(),
      edition: state.edition.trim() || null,
      publicationDate: state.publicationDate || null,
      author: state.author.trim(),
    }

    const errors = validateForm(state, isEditing)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    if (isEditing) {
      onSubmit(trimmed satisfies BookUpdatePayload)
    } else {
      onSubmit({ ...trimmed, numberOfCopies: state.numberOfCopies } satisfies BookCreatePayload)
    }
  }

  return (
    <div className="form-card">
      <h3 className="form-title">{isEditing ? 'Editar libro' : 'Crear libro'}</h3>

      {serverError && (
        <div className="alert alert--error" role="alert">
          {serverError}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid form-grid--3">
          <div className="form-field">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              value={state.title}
              onChange={(e) => handleChange('title', e.target.value)}
              autoComplete="off"
              aria-invalid={fieldErrors.title ? 'true' : undefined}
            />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="isbn">ISBN</label>
            <input
              id="isbn"
              type="text"
              value={state.isbn}
              onChange={(e) => handleChange('isbn', e.target.value)}
              autoComplete="off"
              aria-invalid={fieldErrors.isbn ? 'true' : undefined}
            />
            {fieldErrors.isbn && <span className="field-error">{fieldErrors.isbn}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="author">Autor</label>
            <input
              id="author"
              type="text"
              value={state.author}
              onChange={(e) => handleChange('author', e.target.value)}
              autoComplete="off"
              aria-invalid={fieldErrors.author ? 'true' : undefined}
            />
            {fieldErrors.author && <span className="field-error">{fieldErrors.author}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="edition">Edición</label>
            <input
              id="edition"
              type="text"
              value={state.edition}
              onChange={(e) => handleChange('edition', e.target.value)}
              autoComplete="off"
              aria-invalid={fieldErrors.edition ? 'true' : undefined}
            />
            {fieldErrors.edition && <span className="field-error">{fieldErrors.edition}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="publicationDate">Fecha de publicación</label>
            <input
              id="publicationDate"
              type="date"
              value={state.publicationDate}
              onChange={(e) => handleChange('publicationDate', e.target.value)}
              autoComplete="off"
            />
          </div>

          {!isEditing && (
            <div className="form-field">
              <label htmlFor="numberOfCopies">Cantidad de ejemplares</label>
              <input
                id="numberOfCopies"
                type="number"
                min={1}
                max={100}
                value={state.numberOfCopies}
                onChange={(e) => handleChange('numberOfCopies', parseInt(e.target.value, 10) || 1)}
                aria-invalid={fieldErrors.numberOfCopies ? 'true' : undefined}
              />
              {fieldErrors.numberOfCopies && <span className="field-error">{fieldErrors.numberOfCopies}</span>}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={isSaving}>
            {isSaving ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar libro' : 'Guardar libro')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
