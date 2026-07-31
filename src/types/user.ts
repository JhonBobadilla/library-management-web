export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  birthDate: string
  createdAt: string
  updatedAt: string
}

export interface UserPayload {
  firstName: string
  lastName: string
  email: string
  birthDate: string
}
