import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useService } from '@/hooks/useServices'
import { createOrder } from '@/api/orders.api'
import { formatPrice } from '@/utils/formatters'
import { ERRORS } from '@/config/content'
import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import Modal from '@/components/ui/Modal/Modal'
import DynamicServiceForm from '@/components/forms/DynamicServiceForm'
import styles from './ServiceDetailPage.module.css'

const CATEGORY_STYLE = {
  SEO: styles.catSEO,
  Contenidos: styles.catContenidos,
  Fotografía: styles.catFotografia,
  Automatización: styles.catAutomatizacion,
}

export default function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { service, loading, error } = useService(id)

  const [pendingConfig, setPendingConfig] = useState(null)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState('')

  const handleCheckout = (configData) => {
    setOrderError('')
    setPendingConfig(configData)
  }

  const handleConfirm = async () => {
    setOrderLoading(true)
    try {
      await createOrder(service.id, pendingConfig)
      navigate('/orders', { state: { success: true } })
    } catch (err) {
      const status = err.response?.status
      setOrderError(status === 409 ? ERRORS.duplicateOrder : ERRORS.generic)
      setPendingConfig(null)
    } finally {
      setOrderLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingCenter}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className={styles.errorState}>
        <p>Servicio no encontrado.</p>
        <Button variant="ghost" onClick={() => navigate('/services')}>
          ← Volver al catálogo
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/services')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Volver a servicios
      </button>

      <div className={styles.layout}>
        {/* Service info */}
        <div className={styles.info}>
          <span className={`${styles.categoryBadge} ${CATEGORY_STYLE[service.category]}`}>
            {service.category}
          </span>
          <h1 className={styles.title}>{service.name}</h1>
          <p className={styles.description}>{service.description}</p>
          <div className={styles.priceBox}>
            <span className={styles.priceLabel}>Precio</span>
            <span className={styles.price}>{formatPrice(service.price)}</span>
          </div>
          <ul className={styles.highlights}>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
              Entrega en 48–72 horas
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
              Seguimiento en tiempo real
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
              Entregables descargables
            </li>
          </ul>
        </div>

        {/* Form */}
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Configura tu servicio</h2>
          <p className={styles.formSubtitle}>
            Rellena el formulario y revisa tu pedido antes de confirmar.
          </p>
          {orderError && (
            <p className={styles.orderError} role="alert">{orderError}</p>
          )}
          <DynamicServiceForm
            fields={service.formConfig?.fields ?? []}
            onSubmit={handleCheckout}
          />
        </div>
      </div>

      {/* Confirmation modal */}
      <Modal
        open={Boolean(pendingConfig)}
        onClose={() => setPendingConfig(null)}
        title="Confirma tu pedido"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingConfig(null)} disabled={orderLoading}>
              Cancelar
            </Button>
            <Button loading={orderLoading} onClick={handleConfirm}>
              Confirmar y contratar
            </Button>
          </>
        }
      >
        <div className={styles.confirmBody}>
          <div className={styles.confirmService}>
            <span className={`${styles.categoryBadge} ${CATEGORY_STYLE[service.category]}`}>
              {service.category}
            </span>
            <p className={styles.confirmName}>{service.name}</p>
            <p className={styles.confirmPrice}>{formatPrice(service.price)}</p>
          </div>
          <p className={styles.confirmNote}>
            Al confirmar crearemos tu pedido y nos pondremos en contacto contigo en menos de 24 h.
          </p>
        </div>
      </Modal>
    </div>
  )
}
