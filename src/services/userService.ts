import api from '../config/api'
import type { User, UserPayload } from '../types/user'

export function getUsers(): Promise<User[]> {
  return api.get('/users').then((res) => res.data)
}

export function getUserById(id: number): Promise<User> {
  return api.get(`/users/${id}`).then((res) => res.data)
}

export function createUser(payload: UserPayload): Promise<User> {
  return api.post('/users', payload).then((res) => res.data)
}

export function updateUser(id: number, payload: UserPayload): Promise<User> {
  return api.put(`/users/${id}`, payload).then((res) => res.data)
}

export function deleteUser(id: number): Promise<void> {
  return api.delete(`/users/${id}`)
}
