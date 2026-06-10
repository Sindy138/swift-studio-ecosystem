import { useState, useRef } from 'react'
import { CHAT } from '@/config/content'
import { containsInjection } from '@/utils/sanitize'
import styles from './ChatInput.module.css'

const THROTTLE_MS = 1500

export default function ChatInput({ onSend, disabled, maxLength = 2000 }) {
  const [value, setValue] = useState('')
  const [warning, setWarning] = useState('')
  const lastSentRef = useRef(0)
  const textareaRef = useRef(null)
  const warningTimerRef = useRef(null)

  const showWarning = (msg) => {
    setWarning(msg)
    clearTimeout(warningTimerRef.current)
    warningTimerRef.current = setTimeout(() => setWarning(''), 3500)
  }

  const handleSubmit = async () => {
    const text = value.trim()
    if (!text || disabled) return

    const now = Date.now()
    if (now - lastSentRef.current < THROTTLE_MS) return

    if (containsInjection(text)) {
      showWarning(CHAT.injectionWarning)
      setValue('')
      return
    }

    lastSentRef.current = now
    setValue('')
    textareaRef.current?.style && (textareaRef.current.style.height = 'auto')
    await onSend(text)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e) => {
    const val = e.target.value.slice(0, maxLength)
    setValue(val)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const charCount = value.length
  const showCounter = charCount > maxLength * 0.8

  return (
    <div className={styles.wrap}>
      {warning && (
        <p className={styles.warning} role="alert">{warning}</p>
      )}
      <div className={`${styles.row} ${disabled ? styles.rowDisabled : ''}`}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={CHAT.placeholder}
          rows={1}
          disabled={disabled}
          aria-label={CHAT.placeholder}
        />
        <div className={styles.controls}>
          {showCounter && (
            <span className={styles.counter}>{charCount}/{maxLength}</span>
          )}
          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            aria-label={CHAT.sendLabel}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path d="M22 2 11 13"/>
              <path d="M22 2 15 22 11 13 2 9z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
