import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { register as registerApi } from '@/api/auth.api'
import { isValidEmail, isValidPassword } from '@/utils/validators'
import { AUTH, BRAND, ERRORS } from '@/config/content'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import styles from './RegisterPage.module.css'

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ caracteres', ok: password.length >= 8 },
    { label: 'Mayúscula', ok: /[A-Z]/.test(password) },
    { label: 'Número', ok: /\d/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length

  return (
    <div className={styles.strength} aria-live="polite">
      <div className={styles.strengthBars}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${styles.bar} ${i < score ? styles[`score${score}`] : ''}`}
          />
        ))}
      </div>
      <div className={styles.strengthHints}>
        {checks.map((c) => (
          <span key={c.label} className={c.ok ? styles.hintOk : styles.hintPending}>
            {c.ok ? '✓' : '·'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showStrength, setShowStrength] = useState(false)

  const validate = () => {
    const e = {}
    if (!isValidEmail(form.email)) e.email = 'Introduce un email válido.'
    if (!isValidPassword(form.password)) e.password = 'La contraseña debe tener al menos 8 caracteres.'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (apiError) setApiError('')
    if (name === 'password') setShowStrength(true)
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
      const { data } = await registerApi(form.email, form.password)
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const status = err.response?.status
      setApiError(
        status === 409 ? 'Este email ya está en uso. ¿Quieres iniciar sesión?' : ERRORS.generic
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden />

      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <img src={BRAND.logo} alt={BRAND.name} className={styles.logo} />
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{AUTH.register.title}</h1>
            <p className={styles.subtitle}>{AUTH.register.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
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
            <div>
              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                error={errors.password}
                required
                autoComplete="new-password"
              />
              {showStrength && form.password && (
                <PasswordStrength password={form.password} />
              )}
            </div>
            <Input
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            {apiError && (
              <p className={styles.apiError} role="alert">{apiError}</p>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              {AUTH.register.ctaLabel}
            </Button>
          </form>

          <p className={styles.footerText}>
            {AUTH.register.loginPrompt}{' '}
            <Link to="/login" className={styles.link}>
              {AUTH.register.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
