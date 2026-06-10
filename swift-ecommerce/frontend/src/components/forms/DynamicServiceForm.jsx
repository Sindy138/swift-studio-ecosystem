import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import styles from './DynamicServiceForm.module.css'

function buildInitialState(fields) {
  return fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {})
}

export default function DynamicServiceForm({ fields = [], onSubmit }) {
  const [values, setValues] = useState(() => buildInitialState(fields))
  const [errors, setErrors] = useState({})

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    fields.forEach((f) => {
      if (f.required && !values[f.name]?.toString().trim()) {
        e[f.name] = 'Este campo es obligatorio.'
      }
    })
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <label htmlFor={field.name} className={styles.label}>
            {field.label}
            {field.required && <span className={styles.required} aria-hidden>*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`${styles.input} ${styles.textarea} ${errors[field.name] ? styles.hasError : ''}`}
              rows={4}
              aria-required={field.required}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`${styles.input} ${styles.select} ${errors[field.name] ? styles.hasError : ''}`}
              aria-required={field.required}
            >
              <option value="">Selecciona una opción…</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type === 'number' ? 'number' : 'text'}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`${styles.input} ${errors[field.name] ? styles.hasError : ''}`}
              min={field.type === 'number' ? 1 : undefined}
              aria-required={field.required}
            />
          )}

          {errors[field.name] && (
            <span className={styles.errorMsg} role="alert">{errors[field.name]}</span>
          )}
        </div>
      ))}

      <Button type="submit" size="lg">
        Revisar pedido
      </Button>
    </form>
  )
}
