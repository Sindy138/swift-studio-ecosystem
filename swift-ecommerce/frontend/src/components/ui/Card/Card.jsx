import clsx from 'clsx'
import styles from './Card.module.css'

export default function Card({ children, className, hover = false, gradient = false, ...props }) {
  return (
    <div
      className={clsx(
        styles.card,
        hover && styles.hoverable,
        gradient && styles.gradient,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
