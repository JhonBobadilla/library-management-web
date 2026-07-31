import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page page--centered">
      <h2 className="page-title">Página no encontrada</h2>
      <p className="page-description">La ruta solicitada no existe.</p>
      <Link to="/users" className="back-link">Volver a Usuarios</Link>
    </div>
  )
}
