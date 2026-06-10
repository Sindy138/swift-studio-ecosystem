import { useState, useCallback } from 'react'
import { sendMessage as apiSendMessage, postFeedback } from '@/api/chat.api'
import { ERRORS } from '@/config/content'

const STORAGE_KEY = 'swift_conv_id'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) ?? null
  )
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const send = useCallback(
    async (text) => {
      setError(null)

      const optimisticId = `user-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        { id: optimisticId, role: 'USER', content: text, sources: [] },
      ])
      setSending(true)

      try {
        const { data } = await apiSendMessage(text, conversationId)
        const { conversationId: newConvId, message } = data

        if (!conversationId) {
          setConversationId(newConvId)
          sessionStorage.setItem(STORAGE_KEY, newConvId)
        }

        setMessages((prev) => [
          ...prev,
          {
            id: message.id,
            role: 'ASSISTANT',
            content: message.content,
            sources: message.sources ?? [],
            traceId: message.traceId ?? null,
            feedback: null,
          },
        ])
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        setError(
          err.response?.status === 429 ? ERRORS.rateLimit : ERRORS.generic
        )
      } finally {
        setSending(false)
      }
    },
    [conversationId]
  )

  const submitFeedback = useCallback(async (messageId, traceId, score) => {
    if (!traceId) return
    try {
      await postFeedback(traceId, score)
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, feedback: score } : m))
      )
    } catch {
      // silent fail — feedback is non-critical
    }
  }, [])

  const clearConversation = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setConversationId(null)
    setMessages([])
    setError(null)
  }, [])

  return { messages, sending, error, send, submitFeedback, clearConversation }
}
