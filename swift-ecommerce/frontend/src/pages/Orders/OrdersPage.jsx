import { useNavigate, useLocation } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { formatPrice, formatRelativeTime } from '@/utils/formatters'
import { ORDERS, SERVICES } from '@/config/content'
import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import EmptyState from '@/components/ui/EmptyState/EmptyState'
import styles from './OrdersPage.module.css'

const CATEGORY_STYLE = {
  SEO: styles.catSEO,
  Contenidos: styles.catContenidos,
  Fotografía: styles.catFotografia,
  Automatización: styles.catAutomatizacion,
}

const STATUS_MAP = {
  PENDING: 'warning',
  PROGRESS: 'info',
  DONE: 'success',
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { orders, loading, error } = useOrders()
  const showSuccess = Boolean(location.state?.success)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{ORDERS.title}</h1>
        <p className={styles.subtitle}>{ORDERS.subtitle}</p>
      </div>

      {showSuccess && (
        <div className={styles.successBanner} role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Pedido creado correctamente. Nos pondremos en contacto contigo en menos de 24 h.
        </div>
      )}

      {loading ? (
        <div className={styles.loadingCenter}><Spinner size="lg" /></div>
      ) : error ? (
        <EmptyState icon="⚠️" title="Error al cargar pedidos" subtitle={error} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title={ORDERS.emptyState.title}
          subtitle={ORDERS.emptyState.subtitle}
          ctaLabel={ORDERS.emptyState.cta}
          onCta={() => navigate('/services')}
        />
      ) : (
        <div className={styles.list}>
          {orders.map((order, i) => (
            <button
              key={order.id}
              className={styles.row}
              onClick={() => navigate(`/orders/${order.id}`)}
              style={{ '--delay': `${i * 50}ms` }}
              aria-label={`Ver pedido de ${order.service?.name}`}
            >
              <div className={styles.rowMain}>
                <span className={`${styles.categoryPill} ${CATEGORY_STYLE[order.service?.category]}`}>
                  {order.service?.category}
                </span>
                <span className={styles.rowName}>{order.service?.name}</span>
              </div>

              <span className={styles.rowDate}>{formatRelativeTime(order.createdAt)}</span>

              <div className={styles.rowRight}>
                <span className={styles.rowPrice}>{formatPrice(order.total)}</span>
                <Badge status={order.status}>
                  {ORDERS.statusLabels[order.status]}
                </Badge>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.rowArrow} aria-hidden>
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
