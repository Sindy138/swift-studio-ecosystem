import clsx from 'clsx'
import styles from './Badge.module.css'

const STATUS_VARIANT = {
  PENDING: 'warning',
  PROGRESS: 'info',
  DONE: 'success',
}

export default function Badge({ children, variant = 'default', status, className }) {
  const resolvedVariant = status ? STATUS_VARIANT[status] ?? 'default' : variant
  return (
    <span className={clsx(styles.badge, styles[resolvedVariant], className)}>
      {status === 'PROGRESS' && <span className={styles.pulse} aria-hidden />}
      {children}
    </span>
  )
}
