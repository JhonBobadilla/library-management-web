import api from '../config/api'
import type { Loan, LoanCreatePayload, LoanFilters } from '../types/loan'

export function getLoans(filters?: LoanFilters): Promise<Loan[]> {
  return api.get('/loans', { params: filters }).then((res) => res.data)
}

export function createLoan(payload: LoanCreatePayload): Promise<Loan> {
  return api.post('/loans', payload).then((res) => res.data)
}

export function returnLoan(id: number): Promise<Loan> {
  return api.patch(`/loans/${id}/return`).then((res) => res.data)
}
