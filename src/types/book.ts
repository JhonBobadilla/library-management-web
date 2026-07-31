export interface Book {
  id: number
  title: string
  isbn: string
  edition: string | null
  publicationDate: string | null
  author: string
  totalCopies: number
  availableCopies: number
  createdAt: string
  updatedAt: string
}

export interface BookCreatePayload {
  title: string
  isbn: string
  edition: string | null
  publicationDate: string | null
  author: string
  numberOfCopies: number
}

export interface BookUpdatePayload {
  title: string
  isbn: string
  edition: string | null
  publicationDate: string | null
  author: string
}

export interface BookCopy {
  id: number
  inventoryCode: string
  status: 'AVAILABLE' | 'LOANED' | string
}

export interface AvailableCopiesResponse {
  bookId: number
  isbn: string
  title: string
  availableCopies: number
  copies: BookCopy[]
}
