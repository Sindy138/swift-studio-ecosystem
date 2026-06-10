import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServices } from '@/hooks/useServices'
import { formatPrice } from '@/utils/formatters'
import { SERVICES } from '@/config/content'
import Spinner from '@/components/ui/Spinner/Spinner'
import EmptyState from '@/components/ui/EmptyState/EmptyState'
import styles from './ServicesPage.module.css'

const CATEGORY_ICON = {
  SEO: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Contenidos: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  Fotografía: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Automatización: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
}

const CATEGORY_STYLE = {
  SEO: styles.catSEO,
  Contenidos: styles.catContenidos,
  Fotografía: styles.catFotografia,
  Automatización: styles.catAutomatizacion,
}

function ServiceCard({ service, onClick, delay }) {
  return (
    <article
      className={styles.card}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`Ver ${service.name}`}
      style={{ '--delay': `${delay}ms` }}
    >
      <div className={`${styles.cardStripe} ${CATEGORY_STYLE[service.category]}`}>
        <span className={styles.cardIcon}>{CATEGORY_ICON[service.category]}</span>
      </div>
      <div className={styles.cardBody}>
        <span className={`${styles.categoryBadge} ${CATEGORY_STYLE[service.category]}`}>
          {service.category}
        </span>
        <h3 className={styles.cardName}>{service.name}</h3>
        <p className={styles.cardDesc}>{service.description}</p>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.cardPrice}>{formatPrice(service.price)}</span>
        <span className={styles.cardCta}>Ver servicio →</span>
      </div>
    </article>
  )
}

export default function ServicesPage() {
  const { services, loading, error } = useServices()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filtered =
    activeCategory === 'Todos'
      ? services
      : services.filter((s) => s.category === activeCategory)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{SERVICES.title}</h1>
        <p className={styles.subtitle}>{SERVICES.subtitle}</p>
      </div>

      <div className={styles.filters} role="group" aria-label="Filtrar por categoría">
        {SERVICES.categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingCenter}><Spinner size="lg" /></div>
      ) : error ? (
        <EmptyState icon="⚠️" title="Error al cargar" subtitle={error} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={SERVICES.emptyState.title}
          subtitle={SERVICES.emptyState.subtitle}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => navigate(`/services/${service.id}`)}
              delay={i * 60}
            />
          ))}
        </div>
      )}
    </div>
  )
}
