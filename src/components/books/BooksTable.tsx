import type { Book } from '../../types/book'

interface BooksTableProps {
  books: Book[]
  deletingId: number | null
  onEdit: (book: Book) => void
  onViewCopies: (book: Book) => void
  onDelete: (book: Book) => void
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return dateStr
}

export default function BooksTable({ books, deletingId, onEdit, onViewCopies, onDelete }: BooksTableProps) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay libros registrados.</p>
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
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Edición</th>
            <th>Fecha de publicación</th>
            <th>Total ejemplares</th>
            <th>Disponibles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>{book.edition ?? '—'}</td>
              <td>{formatDate(book.publicationDate)}</td>
              <td>{book.totalCopies}</td>
              <td>
                <span className={`copies-badge ${book.availableCopies > 0 ? 'copies-badge--available' : 'copies-badge--none'}`}>
                  {book.availableCopies}
                </span>
              </td>
              <td className="actions-cell">
                <button type="button" className="btn btn--small btn--outline" onClick={() => onEdit(book)} disabled={deletingId === book.id}>
                  Editar
                </button>
                <button type="button" className="btn btn--small btn--outline" onClick={() => onViewCopies(book)} disabled={deletingId === book.id}>
                  Ver ejemplares
                </button>
                <button type="button" className="btn btn--small btn--danger" onClick={() => onDelete(book)} disabled={deletingId === book.id}>
                  {deletingId === book.id ? 'Eliminando...' : 'Eliminar'}
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
