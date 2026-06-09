import clsx from 'clsx'
import styles from './Input.module.css'

export default function Input({
  label,
  error,
  hint,
  id,
  className,
  required,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(styles.input, error && styles.hasError)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  )
}
