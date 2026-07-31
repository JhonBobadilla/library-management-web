import api from '../config/api'
import type { Book, BookCreatePayload, BookUpdatePayload, AvailableCopiesResponse } from '../types/book'

export function getBooks(): Promise<Book[]> {
  return api.get('/books').then((res) => res.data)
}

export function getBookById(id: number): Promise<Book> {
  return api.get(`/books/${id}`).then((res) => res.data)
}

export function getBookByIsbn(isbn: string): Promise<Book> {
  return api.get(`/books/isbn/${isbn}`).then((res) => res.data)
}

export function createBook(payload: BookCreatePayload): Promise<Book> {
  return api.post('/books', payload).then((res) => res.data)
}

export function updateBook(id: number, payload: BookUpdatePayload): Promise<Book> {
  return api.put(`/books/${id}`, payload).then((res) => res.data)
}

export async function deleteBook(id: number): Promise<void> {
  await api.delete(`/books/${id}`)
}

export function getAvailableCopiesByIsbn(isbn: string): Promise<AvailableCopiesResponse> {
  return api.get(`/books/isbn/${isbn}/available-copies`).then((res) => res.data)
}
