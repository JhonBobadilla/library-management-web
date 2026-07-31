import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Gestión de Biblioteca</h1>
          <p className="app-description">
            Aplicación para administrar usuarios, libros y préstamos
          </p>
        </div>
        <nav className="app-nav">
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Usuarios
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Libros
          </NavLink>
          <NavLink
            to="/loans"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Préstamos
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
