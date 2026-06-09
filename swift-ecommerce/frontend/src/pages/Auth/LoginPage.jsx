import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { login as loginApi } from '@/api/auth.api'
import { isValidEmail, isValidPassword } from '@/utils/validators'
import { AUTH, BRAND, ERRORS } from '@/config/content'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import styles from './LoginPage.module.css'

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
      <div className={styles.bg} aria-hidden />

      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <img src={BRAND.logo} alt={BRAND.name} className={styles.logo} />
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{AUTH.login.title}</h1>
            <p className={styles.subtitle}>{AUTH.login.subtitle}</p>
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
          </form>

          <p className={styles.footerText}>
            {AUTH.login.registerPrompt}{' '}
            <Link to="/register" className={styles.link}>
              {AUTH.login.registerLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
