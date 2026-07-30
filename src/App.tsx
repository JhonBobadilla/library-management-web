import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import UsersPage from './pages/UsersPage'
import BooksPage from './pages/BooksPage'
import LoansPage from './pages/LoansPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
