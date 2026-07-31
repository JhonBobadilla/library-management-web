import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1 className="sidebar-title">Biblioteca</h1>
          <span className="sidebar-subtitle">Panel administrativo</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            Usuarios
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            Libros
          </NavLink>
          <NavLink
            to="/loans"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            Préstamos
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
