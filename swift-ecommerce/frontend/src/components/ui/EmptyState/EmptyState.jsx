import Button from '@/components/ui/Button/Button'
import styles from './EmptyState.module.css'

export default function EmptyState({ icon = '📭', title, subtitle, ctaLabel, onCta }) {
  return (
    <div className={styles.wrapper} role="status">
      <div className={styles.icon} aria-hidden>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {ctaLabel && onCta && (
        <Button onClick={onCta} className={styles.cta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
