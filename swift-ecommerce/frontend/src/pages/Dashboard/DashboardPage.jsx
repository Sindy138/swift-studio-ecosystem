import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/hooks/useOrders'
import { DASHBOARD, ORDERS } from '@/config/content'
import { formatPrice, formatRelativeTime } from '@/utils/formatters'
import Card from '@/components/ui/Card/Card'
import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import EmptyState from '@/components/ui/EmptyState/EmptyState'
import styles from './DashboardPage.module.css'

const IconTrendUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

function StatCard({ icon, label, value, accent, delay }) {
  return (
    <Card className={styles.statCard} style={{ '--delay': `${delay}ms` }}>
      <div className={styles.statIcon} style={{ '--accent': accent }}>{icon}</div>
      <div className={styles.statInfo}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { orders, loading } = useOrders()
  const navigate = useNavigate()

  const firstName = user?.profile?.fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'cliente'

  const stats = {
    total:     orders.length,
    active:    orders.filter((o) => o.status === 'PENDING' || o.status === 'PROGRESS').length,
    completed: orders.filter((o) => o.status === 'DONE').length,
  }

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className={styles.page}>
      {/* Saludo */}
      <div className={styles.hero}>
        <h2 className={styles.welcome}>{DASHBOARD.welcome(firstName)}</h2>
        <p className={styles.subtitle}>{DASHBOARD.subtitle}</p>
      </div>

      {/* Stats */}
      <section className={styles.statsGrid} aria-label="Resumen de actividad">
        <StatCard
          icon={<IconTrendUp />}
          label={DASHBOARD.stats.totalOrders}
          value={loading ? '—' : stats.total}
          accent="var(--color-brand)"
          delay={0}
        />
        <StatCard
          icon={<IconClock />}
          label={DASHBOARD.stats.activeOrders}
          value={loading ? '—' : stats.active}
          accent="var(--color-warning)"
          delay={80}
        />
        <StatCard
          icon={<IconCheck />}
          label={DASHBOARD.stats.completedOrders}
          value={loading ? '—' : stats.completed}
          accent="var(--color-success)"
          delay={160}
        />
      </section>

      {/* Pedidos recientes */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Actividad reciente</h3>
          {orders.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
              Ver todos →
            </Button>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingCenter}><Spinner size="lg" /></div>
        ) : recentOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title={DASHBOARD.emptyOrders.title}
            subtitle={DASHBOARD.emptyOrders.subtitle}
            ctaLabel={DASHBOARD.emptyOrders.cta}
            onCta={() => navigate('/services')}
          />
        ) : (
          <div className={styles.orderList}>
            {recentOrders.map((order, i) => (
              <button
                key={order.id}
                className={styles.orderRow}
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{ '--delay': `${240 + i * 60}ms` }}
                aria-label={`Ver pedido de ${order.service?.name}`}
              >
                <div className={styles.orderInfo}>
                  <span className={styles.orderName}>{order.service?.name}</span>
                  <span className={styles.orderDate}>{formatRelativeTime(order.createdAt)}</span>
                </div>
                <div className={styles.orderRight}>
                  <span className={styles.orderPrice}>{formatPrice(order.total)}</span>
                  <Badge status={order.status}>
                    {ORDERS.statusLabels[order.status]}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* CTA de servicios */}
      {!loading && orders.length === 0 && (
        <section className={styles.ctaSection} style={{ '--delay': '400ms' }}>
          <Card gradient>
            <div className={styles.ctaContent}>
              <div>
                <h3 className={styles.ctaTitle}>Explora nuestros servicios</h3>
                <p className={styles.ctaText}>SEO, contenido, fotografía y automatización — todo en un solo lugar.</p>
              </div>
              <Button size="lg" onClick={() => navigate('/services')}>
                Ver servicios
              </Button>
            </div>
          </Card>
        </section>
      )}
    </div>
  )
}
