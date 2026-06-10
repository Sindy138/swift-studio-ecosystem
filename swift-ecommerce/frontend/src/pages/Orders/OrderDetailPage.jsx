import { useParams, useNavigate } from 'react-router-dom'
import { useOrder } from '@/hooks/useOrders'
import { formatPrice, formatDate } from '@/utils/formatters'
import { ORDERS, ERRORS } from '@/config/content'
import Badge from '@/components/ui/Badge/Badge'
import Spinner from '@/components/ui/Spinner/Spinner'
import Button from '@/components/ui/Button/Button'
import styles from './OrderDetailPage.module.css'

const STATUS_STEPS = ['PENDING', 'PROGRESS', 'DONE']
const STATUS_LABELS = { PENDING: 'Pendiente', PROGRESS: 'En progreso', DONE: 'Completado' }
const STATUS_BADGE = { PENDING: 'warning', PROGRESS: 'info', DONE: 'success' }

const CATEGORY_STYLE = {
  SEO: styles.catSEO,
  Contenidos: styles.catContenidos,
  Fotografía: styles.catFotografia,
  Automatización: styles.catAutomatizacion,
}

function formatConfigKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim()
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { order, loading, error } = useOrder(id)

  if (loading) {
    return <div className={styles.loadingCenter}><Spinner size="lg" /></div>
  }

  if (error || !order) {
    return (
      <div className={styles.errorState}>
        <p>{ERRORS.notFound}</p>
        <Button variant="ghost" onClick={() => navigate('/orders')}>← Volver a pedidos</Button>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(order.status)
  const configEntries = Object.entries(order.configData ?? {})

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/orders')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Volver a pedidos
      </button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={`${styles.categoryPill} ${CATEGORY_STYLE[order.service?.category]}`}>
            {order.service?.category}
          </span>
          <Badge status={order.status}>{ORDERS.statusLabels[order.status]}</Badge>
        </div>
        <h1 className={styles.title}>{order.service?.name}</h1>
        <div className={styles.headerInfo}>
          <span className={styles.infoItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {formatDate(order.createdAt)}
          </span>
          <span className={styles.infoSep}>·</span>
          <span className={styles.infoItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {formatPrice(order.total)}
          </span>
          <span className={styles.infoSep}>·</span>
          <span className={styles.infoItemMono}>#{order.id.slice(0, 8)}</span>
        </div>
      </div>

      {/* Status progress bar */}
      <div className={styles.progressSection}>
        <h2 className={styles.sectionTitle}>Estado del pedido</h2>
        <div className={styles.stepper}>
          {STATUS_STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <div key={step} className={styles.stepWrapper}>
                <div className={`${styles.stepNode} ${done ? styles.stepDone : ''} ${active ? styles.stepActive : ''}`}>
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  ) : (
                    <span className={styles.stepNum}>{i + 1}</span>
                  )}
                </div>
                <span className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ''} ${done ? styles.stepLabelDone : ''}`}>
                  {STATUS_LABELS[step]}
                </span>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`${styles.stepLine} ${done ? styles.stepLineDone : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Config data */}
      {configEntries.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Configuración del servicio</h2>
          <div className={styles.configGrid}>
            {configEntries.map(([key, value]) => (
              <div key={key} className={styles.configItem}>
                <span className={styles.configKey}>{formatConfigKey(key)}</span>
                <span className={styles.configValue}>{value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverables */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{ORDERS.deliverablesLabel}</h2>
        {order.deliverables?.length === 0 ? (
          <p className={styles.noDeliverables}>{ORDERS.noDeliverables}</p>
        ) : (
          <div className={styles.deliverableList}>
            {order.deliverables?.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.deliverableItem}
              >
                <span className={styles.deliverableIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </span>
                <span className={styles.deliverableLabel}>{d.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.deliverableArrow} aria-hidden>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
