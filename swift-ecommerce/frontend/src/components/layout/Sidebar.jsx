import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '@/context/AuthContext'
import { BRAND, NAV } from '@/config/content'
import styles from './Sidebar.module.css'

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconServices = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
)
const IconProfile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconAdmin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
)
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const userNavLinks = [
  { to: '/dashboard', label: NAV.dashboard, Icon: IconDashboard },
  { to: '/services',  label: NAV.services,  Icon: IconServices  },
  { to: '/orders',    label: NAV.orders,    Icon: IconOrders    },
  { to: '/profile',   label: NAV.profile,   Icon: IconProfile   },
]

const adminNavLinks = [
  { to: '/admin',          label: NAV.admin,     Icon: IconAdmin    },
  { to: '/admin/users',    label: 'Usuarios',    Icon: IconProfile  },
  { to: '/admin/services', label: 'Servicios',   Icon: IconServices },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <aside className={clsx(styles.sidebar, isOpen && styles.open)} aria-label="Navegación principal">
      {/* Logo */}
      <div className={styles.logoArea}>
        <img src={BRAND.logo} alt={BRAND.name} className={styles.logo} />
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar menú">✕</button>
      </div>

      {/* Nav principal */}
      <nav className={styles.nav}>
        <ul role="list">
          {userNavLinks.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(styles.navLink, isActive && styles.active)
                }
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <div className={styles.sectionLabel}>Administración</div>
            <ul role="list">
              {adminNavLinks.map(({ to, label, Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(styles.navLink, isActive && styles.active)
                    }
                  >
                    <Icon />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* Footer con usuario y logout */}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar} aria-hidden>{initials}</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.email}</span>
            <span className={styles.userRole}>{isAdmin ? 'Admin' : 'Cliente'}</span>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn} aria-label={NAV.logout}>
          <IconLogout />
        </button>
      </div>
    </aside>
  )
}
