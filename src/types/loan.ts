export type LoanStatus =
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'OVERDUE'
  | 'RETURNED'

export interface LoanUserInfo {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface LoanBookInfo {
  id: number
  title: string
  isbn: string
  author: string
}

export interface LoanBookCopyInfo {
  id: number
  inventoryCode: string
  status: 'AVAILABLE' | 'LOANED' | string
}

export interface Loan {
  id: number
  loanDate: string
  dueDate: string
  returnedAt: string | null
  status: LoanStatus | string
  user: LoanUserInfo
  book: LoanBookInfo
  bookCopy: LoanBookCopyInfo
  createdAt: string
  updatedAt: string
}

export interface LoanCreatePayload {
  userId: number
  bookCopyId: number
  loanDate: string
  dueDate: string
}

export interface LoanFilters {
  userId?: number
  bookId?: number
}
