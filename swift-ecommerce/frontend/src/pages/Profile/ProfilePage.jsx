import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserById, updateUser } from '@/api/users.api'
import { isValidEmail } from '@/utils/validators'
import { formatDate } from '@/utils/formatters'
import { PROFILE, ERRORS } from '@/config/content'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Spinner from '@/components/ui/Spinner/Spinner'
import styles from './ProfilePage.module.css'

function getInitials(fullName, email) {
  if (fullName?.trim()) {
    return fullName.trim().split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('')
  }
  return email?.[0]?.toUpperCase() ?? '?'
}

export default function ProfilePage() {
  const { user, login, token } = useAuth()

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', companyName: '', email: '' })
  const [original, setOriginal] = useState(null)
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    getUserById(user.id)
      .then(({ data }) => {
        setUserData(data)
        const initial = {
          fullName: data.profile?.fullName ?? '',
          phone: data.profile?.phone ?? '',
          companyName: data.profile?.companyName ?? '',
          email: data.email ?? '',
        }
        setForm(initial)
        setOriginal(initial)
      })
      .catch(() => setApiError(ERRORS.generic))
      .finally(() => setLoading(false))
  }, [user.id])

  const isDirty = original && JSON.stringify(form) !== JSON.stringify(original)

  const validate = () => {
    const e = {}
    if (!isValidEmail(form.email)) e.email = 'Introduce un email válido.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (successMsg) setSuccessMsg('')
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSaving(true)
    setSuccessMsg('')
    setApiError('')
    try {
      const { data } = await updateUser(user.id, form)
      setUserData(data)
      const updated = {
        fullName: data.profile?.fullName ?? '',
        phone: data.profile?.phone ?? '',
        companyName: data.profile?.companyName ?? '',
        email: data.email ?? '',
      }
      setForm(updated)
      setOriginal(updated)
      setSuccessMsg(PROFILE.successMessage)
      // Sync email in auth context if it changed
      if (data.email !== user.email) {
        login({ ...user, email: data.email }, token)
      }
    } catch {
      setApiError(ERRORS.generic)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className={styles.loadingCenter}><Spinner size="lg" /></div>
  }

  const initials = getInitials(userData?.profile?.fullName, userData?.email)
  const displayName = userData?.profile?.fullName || userData?.email?.split('@')[0]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{PROFILE.title}</h1>
        <p className={styles.subtitle}>{PROFILE.subtitle}</p>
      </div>

      <div className={styles.layout}>
        {/* Avatar card */}
        <aside className={styles.card}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{initials}</div>
          </div>

          <div className={styles.cardInfo}>
            <p className={styles.cardName}>{displayName}</p>
            <p className={styles.cardEmail}>{userData?.email}</p>
          </div>

          <div className={styles.cardMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Rol</span>
              <span className={`${styles.roleBadge} ${userData?.role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}`}>
                {userData?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Miembro desde</span>
              <span className={styles.metaValue}>{formatDate(userData?.createdAt)}</span>
            </div>
            {userData?.profile?.companyName && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Empresa</span>
                <span className={styles.metaValue}>{userData.profile.companyName}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Edit form */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Información personal</h2>

          {successMsg && (
            <div className={styles.successBanner} role="status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {successMsg}
            </div>
          )}

          {apiError && (
            <p className={styles.apiError} role="alert">{apiError}</p>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.fieldRow}>
              <Input
                label={PROFILE.fields.fullName}
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                error={errors.fullName}
                autoComplete="name"
              />
              <Input
                label={PROFILE.fields.companyName}
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Nombre de tu empresa"
                error={errors.companyName}
                autoComplete="organization"
              />
            </div>

            <div className={styles.fieldRow}>
              <Input
                label={PROFILE.fields.email}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@empresa.com"
                error={errors.email}
                required
                autoComplete="email"
              />
              <Input
                label={PROFILE.fields.phone}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+34 600 000 000"
                error={errors.phone}
                autoComplete="tel"
              />
            </div>

            <div className={styles.formActions}>
              {isDirty && (
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => { setForm(original); setErrors({}); setSuccessMsg('') }}
                >
                  Descartar cambios
                </button>
              )}
              <Button
                type="submit"
                loading={saving}
                disabled={!isDirty}
              >
                {PROFILE.saveLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
