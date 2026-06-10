import { useState, useRef, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { CHAT } from '@/config/content'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import styles from './ChatWidget.module.css'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const { messages, sending, error, send, submitFeedback, clearConversation } = useChat()

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, sending, isOpen])

  // Close panel on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  const hasMessages = messages.length > 0

  return (
    <div className={styles.root}>
      {/* Panel */}
      <div
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-label={CHAT.title}
        aria-modal="false"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerAvatar} aria-hidden>S</div>
            <div>
              <p className={styles.headerTitle}>{CHAT.title}</p>
              <p className={styles.headerStatus}>
                <span className={styles.statusDot} aria-hidden />
                En línea
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {hasMessages && (
              <button
                className={styles.iconBtn}
                onClick={clearConversation}
                title="Nueva conversación"
                aria-label="Nueva conversación"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            )}
            <button
              className={styles.iconBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className={styles.messages} role="log" aria-live="polite" aria-label="Mensajes del chat">
          {!hasMessages && (
            <div className={styles.emptyState}>
              <div className={styles.emptyAvatar} aria-hidden>S</div>
              <p className={styles.emptyText}>{CHAT.emptyState}</p>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onFeedback={submitFeedback}
            />
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className={styles.typing} aria-label="El asistente está escribiendo">
              <div className={styles.typingDot} />
              <div className={styles.typingDot} />
              <div className={styles.typingDot} />
            </div>
          )}

          {error && (
            <p className={styles.errorMsg} role="alert">{error}</p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={send}
          disabled={sending}
          maxLength={CHAT.maxLength}
        />
      </div>

      {/* FAB toggle button */}
      <button
        className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente de Swift Studio'}
        aria-expanded={isOpen}
      >
        {hasMessages && !isOpen && <span className={styles.unreadDot} aria-hidden />}
        {/* Chat icon (when closed) */}
        <svg
          className={`${styles.fabIcon} ${isOpen ? styles.fabIconHidden : ''}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        {/* X icon (when open) */}
        <svg
          className={`${styles.fabIcon} ${!isOpen ? styles.fabIconHidden : ''}`}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}
