import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { NAV, BRAND } from '@/config/content'
import styles from './Topbar.module.css'

const ROUTE_TITLES = {
  '/dashboard':       NAV.dashboard,
  '/services':        NAV.services,
  '/orders':          NAV.orders,
  '/profile':         NAV.profile,
  '/admin':           NAV.admin,
  '/admin/users':     'Usuarios',
  '/admin/services':  'Gestión de Servicios',
}

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <line x1="3" y1="6"  x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user } = useAuth()

  // Título por ruta exacta o por prefijo para rutas dinámicas
  const title =
    ROUTE_TITLES[pathname] ??
    (pathname.startsWith('/services/') ? 'Detalle del Servicio' :
     pathname.startsWith('/orders/')   ? 'Detalle del Pedido'   :
     BRAND.shortName)

  return (
    <header className={styles.topbar} role="banner">
      {/* Hamburger — solo visible en móvil */}
      <button
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Abrir menú"
        aria-haspopup="true"
      >
        <IconMenu />
      </button>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.right}>
        <span className={styles.userEmail}>{user?.email}</span>
      </div>
    </header>
  )
}
