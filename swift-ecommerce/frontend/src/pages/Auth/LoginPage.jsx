import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { login as loginApi } from '@/api/auth.api'
import { isValidEmail, isValidPassword } from '@/utils/validators'
import { AUTH, BRAND, ERRORS } from '@/config/content'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import styles from './LoginPage.module.css'

const STATS = [
  ['+240', 'marcas activas'],
  ['98%', 'satisfacción'],
  ['72h', 'primer entregable'],
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!isValidEmail(form.email)) e.email = 'Introduce un email válido.'
    if (!isValidPassword(form.password)) e.password = 'La contraseña debe tener al menos 8 caracteres.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const { data } = await loginApi(form.email, form.password)
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const status = err.response?.status
      setApiError(
        status === 401 ? 'Email o contraseña incorrectos.' : ERRORS.generic
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* ---- Brand panel ---- */}
      <div className={styles.brand}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />

        <div className={styles.brandTop}>
          <img src={BRAND.logo} alt={BRAND.name} className={styles.brandLogo} />
        </div>

        <div className={styles.brandBody}>
          <span className={styles.brandBadge}>✦ Agencia de vanguardia</span>
          <h1 className={styles.brandHeadline}>
            Marketing y fotografía que se sienten vivos.
          </h1>
          <p className={styles.brandTagline}>
            Contrata servicios, sigue cada proyecto en tiempo real y descarga
            tus entregables desde un solo lugar.
          </p>
          <div className={styles.brandStats}>
            {STATS.map(([n, l]) => (
              <div key={n}>
                <b className={styles.statNum}>{n}</b>
                <span className={styles.statLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <p className={styles.brandFooter}>
          swiftstudio360.com · acceso de clientes
        </p>
      </div>

      {/* ---- Form panel ---- */}
      <div className={styles.formPanel}>
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.mobileLogo}>
            <img src={BRAND.logo} alt={BRAND.name} className={styles.mobileLogoImg} />
          </div>

          <div className={styles.formHeader}>
            <h2 className={styles.title}>{AUTH.login.title}</h2>
            <p className={styles.subtitle}>{AUTH.login.subtitle}</p>
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@empresa.com"
            error={errors.email}
            required
            autoComplete="email"
            autoFocus
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            error={errors.password}
            required
            autoComplete="current-password"
          />

          {apiError && (
            <p className={styles.apiError} role="alert">{apiError}</p>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            {AUTH.login.ctaLabel}
          </Button>

          <div className={styles.divider}>
            <span /> acceso solo clientes <span />
          </div>

          <p className={styles.footerText}>
            {AUTH.login.registerPrompt}{' '}
            <Link to="/register" className={styles.link}>
              {AUTH.login.registerLink}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
