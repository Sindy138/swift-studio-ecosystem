import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUsers } from '@/api/users.api'
import { getOrders } from '@/api/orders.api'
import { formatPrice, formatDate } from '@/utils/formatters'
import Badge from '@/components/ui/Badge/Badge'
import Spinner from '@/components/ui/Spinner/Spinner'
import styles from './AdminDashboardPage.module.css'

const STATUS_LABELS = { PENDING: 'Pendiente', PROGRESS: 'En progreso', DONE: 'Completado' }

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUsers(), getOrders()])
      .then(([uRes, oRes]) => {
        setUsers(uRes.data)
        setOrders(oRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className={styles.loadingCenter}><Spinner size="lg" /></div>
  }

  const pending  = orders.filter((o) => o.status === 'PENDING').length
  const progress = orders.filter((o) => o.status === 'PROGRESS').length
  const done     = orders.filter((o) => o.status === 'DONE').length
  const revenue  = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const recent   = orders.slice(0, 6)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <p className={styles.subtitle}>Resumen de actividad de la plataforma.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard value={users.length}     label="Usuarios registrados" />
        <StatCard value={orders.length}    label="Pedidos totales" />
        <StatCard value={pending}          label="Pendientes"   accent="warning" />
        <StatCard value={progress}         label="En progreso"  accent="info" />
        <StatCard value={done}             label="Completados"  accent="success" />
        <StatCard value={formatPrice(revenue)} label="Facturación total" accent="brand" />
      </div>

      {/* Quick links */}
      <div className={styles.quickLinks}>
        <Link to="/admin/orders"   className={styles.quickLink}>
          <span>Gestionar pedidos</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <Link to="/admin/users"    className={styles.quickLink}>
          <span>Ver usuarios</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <Link to="/admin/services" className={styles.quickLink}>
          <span>Editar catálogo</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      {/* Recent orders */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pedidos recientes</h2>
          <Link to="/admin/orders" className={styles.seeAll}>Ver todos →</Link>
        </div>
        <div className={styles.tableCard}>
          <div className={styles.tableHead}>
            <span>ID</span>
            <span>Servicio</span>
            <span>Estado</span>
            <span>Total</span>
            <span>Fecha</span>
          </div>
          {recent.length === 0 ? (
            <p className={styles.empty}>No hay pedidos aún.</p>
          ) : (
            recent.map((order) => (
              <div key={order.id} className={styles.tableRow}>
                <span className={styles.mono}>#{order.id.slice(0, 8)}</span>
                <span className={styles.svcName}>{order.service?.name}</span>
                <Badge status={order.status}>{STATUS_LABELS[order.status]}</Badge>
                <span>{formatPrice(order.total)}</span>
                <span className={styles.muted}>{formatDate(order.createdAt)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, accent }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles[`accent_${accent}`] : ''}`}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
