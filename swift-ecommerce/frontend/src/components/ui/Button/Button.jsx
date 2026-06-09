import clsx from 'clsx'
import Spinner from '@/components/ui/Spinner/Spinner'
import styles from './Button.module.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" className={styles.spinner} />}
      <span className={clsx(loading && styles.hiddenLabel)}>{children}</span>
    </button>
  )
}
