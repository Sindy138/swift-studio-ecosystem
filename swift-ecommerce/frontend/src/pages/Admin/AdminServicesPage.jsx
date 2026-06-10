import { useState, useEffect } from 'react'
import { getServices, createService, updateService, deleteService } from '@/api/services.api'
import { formatPrice } from '@/utils/formatters'
import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Modal from '@/components/ui/Modal/Modal'
import Spinner from '@/components/ui/Spinner/Spinner'
import styles from './AdminServicesPage.module.css'

const CATEGORIES = ['SEO', 'Contenidos', 'Fotografía', 'Automatización']
const EMPTY_FORM = { name: '', description: '', price: '', category: 'SEO', formConfigJson: '{}' }

export default function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)  // null | 'new' | service object
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    getServices()
      .then(({ data }) => setServices(data))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setFormError('')
    setApiError('')
    setEditing('new')
  }

  const openEdit = (svc) => {
    setForm({
      name: svc.name,
      description: svc.description,
      price: String(svc.price),
      category: svc.category,
      formConfigJson: JSON.stringify(svc.formConfig ?? {}, null, 2),
    })
    setFormError('')
    setApiError('')
    setEditing(svc)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError('')
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.price) {
      setFormError('Nombre, descripción y precio son obligatorios.')
      return
    }
    const priceNum = Number(form.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('El precio debe ser un número positivo.')
      return
    }
    let formConfig = {}
    try {
      formConfig = JSON.parse(form.formConfigJson || '{}')
    } catch {
      setFormError('El JSON de configuración no es válido.')
      return
    }

    setSaving(true)
    setApiError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: priceNum,
        category: form.category,
        formConfig,
      }
      if (editing === 'new') {
        const { data } = await createService(payload)
        setServices((prev) => [data, ...prev])
      } else {
        const { data } = await updateService(editing.id, payload)
        setServices((prev) => prev.map((s) => (s.id === data.id ? data : s)))
      }
      setEditing(null)
    } catch {
      setApiError('No se pudo guardar el servicio.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteService(toDelete.id)
      setServices((prev) => prev.filter((s) => s.id !== toDelete.id))
      setToDelete(null)
    } catch {
      setApiError('No se pudo eliminar. El servicio puede tener pedidos activos.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className={styles.loadingCenter}><Spinner size="lg" /></div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Servicios</h1>
          <p className={styles.subtitle}>{services.length} servicios en catálogo</p>
        </div>
        <Button onClick={openCreate}>+ Nuevo servicio</Button>
      </div>

      {apiError && <p className={styles.apiError} role="alert">{apiError}</p>}

      <div className={styles.tableCard}>
        <div className={styles.tableHead}>
          <span>Nombre</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Estado</span>
          <span></span>
        </div>

        {services.map((svc) => (
          <div key={svc.id} className={styles.tableRow}>
            <div className={styles.svcInfo}>
              <p className={styles.svcName}>{svc.name}</p>
              <p className={styles.svcDesc}>{svc.description?.slice(0, 55)}{svc.description?.length > 55 ? '…' : ''}</p>
            </div>
            <Badge variant="brand">{svc.category}</Badge>
            <span className={styles.price}>{formatPrice(svc.price)}</span>
            <Badge variant={svc.isActive !== false ? 'success' : 'default'}>
              {svc.isActive !== false ? 'Activo' : 'Inactivo'}
            </Badge>
            <div className={styles.actions}>
              <button
                className={styles.editBtn}
                onClick={() => openEdit(svc)}
                aria-label={`Editar ${svc.name}`}
                title="Editar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                </svg>
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => { setToDelete(svc); setApiError('') }}
                aria-label={`Eliminar ${svc.name}`}
                title="Eliminar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Nuevo servicio' : 'Editar servicio'}
        footer={
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button loading={saving} onClick={handleSave}>
              {editing === 'new' ? 'Crear' : 'Guardar cambios'}
            </Button>
          </div>
        }
      >
        <div className={styles.formGrid}>
          <div className={styles.fieldFull}>
            <Input
              label="Nombre del servicio"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="svc-category">Categoría</label>
            <select
              id="svc-category"
              className={styles.select}
              name="category"
              value={form.category}
              onChange={handleFormChange}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Input
            label="Precio (€)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleFormChange}
            required
          />

          <div className={styles.fieldFull}>
            <label className={styles.label} htmlFor="svc-desc">Descripción</label>
            <textarea
              id="svc-desc"
              className={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleFormChange}
              rows={3}
            />
          </div>

          <div className={styles.fieldFull}>
            <label className={styles.label} htmlFor="svc-json">Configuración del formulario (JSON)</label>
            <textarea
              id="svc-json"
              className={`${styles.textarea} ${styles.mono}`}
              name="formConfigJson"
              value={form.formConfigJson}
              onChange={handleFormChange}
              rows={5}
              spellCheck={false}
            />
          </div>

          {formError && <p className={styles.formError} role="alert">{formError}</p>}
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Eliminar servicio"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancelar</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Eliminar</Button>
          </div>
        }
      >
        <p className={styles.modalText}>¿Eliminar <strong>{toDelete?.name}</strong>?</p>
        <p className={styles.modalWarning}>Fallará si el servicio tiene pedidos activos.</p>
      </Modal>
    </div>
  )
}
