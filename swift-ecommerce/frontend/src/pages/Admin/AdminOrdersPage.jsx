import { useState, useEffect, useMemo } from 'react'
import { getOrders, updateOrderStatus, addDeliverable } from '@/api/orders.api'
import { getUsers } from '@/api/users.api'
import { formatPrice, formatDate } from '@/utils/formatters'
import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import Modal from '@/components/ui/Modal/Modal'
import Input from '@/components/ui/Input/Input'
import styles from './AdminOrdersPage.module.css'

const STATUS_STEPS = ['PENDING', 'PROGRESS', 'DONE']
const STATUS_LABELS = { PENDING: 'Pendiente', PROGRESS: 'En progreso', DONE: 'Completado' }
const FILTERS = ['ALL', ...STATUS_STEPS]
const FILTER_LABELS = { ALL: 'Todos', ...STATUS_LABELS }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [userMap, setUserMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState(null)
  const [delivModal, setDelivModal] = useState(null) // order object
  const [delivForm, setDelivForm] = useState({ label: '', url: '' })
  const [delivErrors, setDelivErrors] = useState({})
  const [delivSaving, setDelivSaving] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    Promise.all([getOrders(), getUsers()])
      .then(([oRes, uRes]) => {
        setOrders(oRes.data)
        const map = {}
        uRes.data.forEach((u) => { map[u.id] = u })
        setUserMap(map)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => (filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  )

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    setApiError('')
    try {
      const { data } = await updateOrderStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: data.status } : o)))
    } catch {
      setApiError('No se pudo actualizar el estado.')
    } finally {
      setUpdatingId(null)
    }
  }

  const openDelivModal = (order) => {
    setDelivForm({ label: '', url: '' })
    setDelivErrors({})
    setApiError('')
    setDelivModal(order)
  }

  const handleDelivSave = async () => {
    const errors = {}
    if (!delivForm.label.trim()) errors.label = 'Introduce una etiqueta.'
    if (!delivForm.url.trim()) errors.url = 'Introduce la URL.'
    if (Object.keys(errors).length > 0) { setDelivErrors(errors); return }

    setDelivSaving(true)
    try {
      await addDeliverable(delivModal.id, delivForm.label.trim(), delivForm.url.trim())
      setDelivModal(null)
    } catch {
      setApiError('No se pudo añadir el entregable.')
    } finally {
      setDelivSaving(false)
    }
  }

  if (loading) return <div className={styles.loadingCenter}><Spinner size="lg" /></div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Pedidos</h1>
          <p className={styles.subtitle}>{orders.length} pedidos en total</p>
        </div>
      </div>

      {apiError && <p className={styles.apiError} role="alert">{apiError}</p>}

      {/* Status filters */}
      <div className={styles.filters} role="group" aria-label="Filtrar por estado">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {FILTER_LABELS[f]}
            <span className={styles.filterCount}>
              {f === 'ALL' ? orders.length : orders.filter((o) => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHead}>
          <span>ID</span>
          <span>Cliente</span>
          <span>Servicio</span>
          <span>Estado</span>
          <span>Total</span>
          <span>Fecha</span>
          <span>Acciones</span>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>No hay pedidos {filter !== 'ALL' ? `con estado "${FILTER_LABELS[filter]}"` : ''}.</p>
        ) : (
          filtered.map((order) => {
            const ownerEmail = userMap[order.userId]?.email ?? order.userId.slice(0, 10) + '…'
            const isUpdating = updatingId === order.id
            return (
              <div key={order.id} className={styles.tableRow}>
                <span className={styles.mono}>#{order.id.slice(0, 8)}</span>
                <span className={styles.email} title={ownerEmail}>{ownerEmail}</span>
                <div>
                  <p className={styles.svcName}>{order.service?.name}</p>
                  <p className={styles.catPill}>{order.service?.category}</p>
                </div>
                <div className={styles.statusCell}>
                  <Badge status={order.status}>{STATUS_LABELS[order.status]}</Badge>
                  <select
                    className={styles.statusSelect}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={isUpdating}
                    aria-label={`Cambiar estado de pedido ${order.id.slice(0, 8)}`}
                  >
                    {STATUS_STEPS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  {isUpdating && <Spinner size="sm" />}
                </div>
                <span>{formatPrice(order.total)}</span>
                <span className={styles.muted}>{formatDate(order.createdAt)}</span>
                <button
                  className={styles.delivBtn}
                  onClick={() => openDelivModal(order)}
                  title="Añadir entregable"
                  aria-label={`Añadir entregable al pedido ${order.id.slice(0, 8)}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Entregable
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Add deliverable modal */}
      <Modal
        open={!!delivModal}
        onClose={() => setDelivModal(null)}
        title="Añadir entregable"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setDelivModal(null)}>Cancelar</Button>
            <Button loading={delivSaving} onClick={handleDelivSave}>Añadir</Button>
          </div>
        }
      >
        <p className={styles.modalContext}>
          Pedido <strong>{delivModal?.service?.name}</strong> · #{delivModal?.id?.slice(0, 8)}
        </p>
        <div className={styles.delivForm}>
          <Input
            label="Etiqueta"
            name="label"
            value={delivForm.label}
            onChange={(e) => setDelivForm((p) => ({ ...p, label: e.target.value }))}
            placeholder="Ej: Informe SEO Final.pdf"
            error={delivErrors.label}
          />
          <Input
            label="URL del archivo"
            name="url"
            type="url"
            value={delivForm.url}
            onChange={(e) => setDelivForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://drive.google.com/…"
            error={delivErrors.url}
          />
        </div>
      </Modal>
    </div>
  )
}
