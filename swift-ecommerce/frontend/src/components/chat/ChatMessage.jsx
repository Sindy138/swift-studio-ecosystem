import styles from './ChatMessage.module.css'
import { CHAT } from '@/config/content'

export default function ChatMessage({ message, onFeedback }) {
  const isAssistant = message.role === 'ASSISTANT'
  const hasFeedback = message.feedback !== null && message.feedback !== undefined

  return (
    <div className={`${styles.wrap} ${isAssistant ? styles.assistant : styles.user}`}>
      {isAssistant && (
        <div className={styles.avatar} aria-hidden>S</div>
      )}

      <div className={styles.bubbleCol}>
        <div className={styles.bubble}>
          <p className={styles.content}>{message.content}</p>
        </div>

        {isAssistant && message.sources?.length > 0 && (
          <div className={styles.sources}>
            <span className={styles.sourcesLabel}>{CHAT.sourcesLabel}:</span>
            {message.sources.map((src) => (
              <span key={src} className={styles.sourcePill}>{src}</span>
            ))}
          </div>
        )}

        {isAssistant && message.traceId && (
          <div className={styles.feedback}>
            <span className={styles.feedbackLabel}>{CHAT.feedbackLabel}</span>
            <button
              className={`${styles.feedbackBtn} ${message.feedback === 1 ? styles.feedbackYes : ''}`}
              onClick={() => onFeedback(message.id, message.traceId, 1)}
              disabled={hasFeedback}
              aria-label="Respuesta útil"
            >
              👍
            </button>
            <button
              className={`${styles.feedbackBtn} ${message.feedback === 0 ? styles.feedbackNo : ''}`}
              onClick={() => onFeedback(message.id, message.traceId, 0)}
              disabled={hasFeedback}
              aria-label="Respuesta no útil"
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
