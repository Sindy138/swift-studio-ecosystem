import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUsers, deleteUser } from '@/api/users.api'
import { formatDate } from '@/utils/formatters'
import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import Modal from '@/components/ui/Modal/Modal'
import styles from './AdminUsersPage.module.css'

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    getUsers()
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.profile?.fullName ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    setDeleting(true)
    setApiError('')
    try {
      await deleteUser(toDelete.id)
      setUsers((prev) => prev.filter((u) => u.id !== toDelete.id))
      setToDelete(null)
    } catch {
      setApiError('No se pudo eliminar. Puede tener pedidos activos.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className={styles.loadingCenter}><Spinner size="lg" /></div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Usuarios</h1>
          <p className={styles.subtitle}>{users.length} usuarios registrados</p>
        </div>
        <input
          className={styles.search}
          type="search"
          placeholder="Buscar por email o nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar usuarios"
        />
      </div>

      {apiError && <p className={styles.apiError} role="alert">{apiError}</p>}

      <div className={styles.tableCard}>
        <div className={styles.tableHead}>
          <span>Email</span>
          <span>Nombre</span>
          <span>Rol</span>
          <span>Alta</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>No se encontraron usuarios.</p>
        ) : (
          filtered.map((u) => (
            <div key={u.id} className={styles.tableRow}>
              <span className={styles.email}>{u.email}</span>
              <span className={styles.muted}>{u.profile?.fullName || '—'}</span>
              <Badge variant={u.role === 'ADMIN' ? 'brand' : 'default'}>
                {u.role === 'ADMIN' ? 'Admin' : 'Cliente'}
              </Badge>
              <span className={styles.muted}>{formatDate(u.createdAt)}</span>
              <div className={styles.actions}>
                {u.id !== currentUser.id && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => { setToDelete(u); setApiError('') }}
                    aria-label={`Eliminar ${u.email}`}
                    title="Eliminar usuario"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Eliminar usuario"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancelar</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Eliminar</Button>
          </div>
        }
      >
        <p className={styles.modalText}>
          ¿Eliminar la cuenta de <strong>{toDelete?.email}</strong>?
        </p>
        <p className={styles.modalWarning}>
          Esta acción es irreversible. Fallará si el usuario tiene pedidos activos.
        </p>
      </Modal>
    </div>
  )
}
