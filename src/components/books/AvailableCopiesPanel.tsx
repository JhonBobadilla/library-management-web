import { useState } from 'react'
import type { AvailableCopiesResponse, Book } from '../../types/book'
import * as bookService from '../../services/bookService'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'

interface AvailableCopiesPanelProps {
  initialIsbn?: string
  initialBook?: Book
  onClose: () => void
}

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    AVAILABLE: 'Disponible',
    LOANED: 'Prestado',
  }
  return map[status] ?? status
}

export default function AvailableCopiesPanel({ initialIsbn, initialBook, onClose }: AvailableCopiesPanelProps) {
  const [isbn, setIsbn] = useState(initialIsbn ?? initialBook?.isbn ?? '')
  const [data, setData] = useState<AvailableCopiesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    const trimmed = isbn.trim()
    if (!trimmed) return

    setIsLoading(true)
    setError(null)
    setSearched(true)
    try {
      const result = await bookService.getAvailableCopiesByIsbn(trimmed)
      setData(result)
    } catch (err: unknown) {
      setError(getApiErrorMessage(err))
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const showResults = searched && !isLoading && !error

  return (
    <div className="copies-panel">
      <div className="copies-panel-header">
        <h3 className="form-title">Consultar ejemplares disponibles</h3>
        <button type="button" className="btn btn--small btn--secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>

      <div className="copies-search">
        <div className="form-field">
          <label htmlFor="copiesIsbn">ISBN</label>
          <input
            id="copiesIsbn"
            type="text"
            value={isbn}
            onChange={(e) => { setIsbn(e.target.value); setSearched(false) }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        </div>
        <button type="button" className="btn btn--primary" onClick={handleSearch} disabled={isLoading || !isbn.trim()}>
          {isLoading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator" role="status" aria-live="polite">
          Consultando ejemplares...
        </div>
      )}

      {showResults && data && (
        <div className="copies-result">
          <div className="copies-summary">
            <strong>{data.title}</strong>
            <span>ISBN: {data.isbn}</span>
            <span>
              Ejemplares disponibles:{' '}
              <strong>{data.availableCopies}</strong>
            </span>
          </div>

          {data.copies.length === 0 ? (
            <p className="empty-state">No hay ejemplares disponibles para este libro.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Código de inventario</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.copies.map((copy) => (
                    <tr key={copy.id}>
                      <td>{copy.id}</td>
                      <td><code className="inventory-code">{copy.inventoryCode}</code></td>
                      <td>
                        <span className={`status-tag status-tag--${copy.status.toLowerCase()}`}>
                          {translateStatus(copy.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showResults && !data && (
        <p className="empty-state">No se encontraron ejemplares para el ISBN ingresado.</p>
      )}
    </div>
  )
}
