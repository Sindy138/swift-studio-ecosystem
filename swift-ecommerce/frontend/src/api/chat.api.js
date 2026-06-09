import client from './client'

export const sendMessage = (message, conversationId) =>
  client.post('/chat', { message, ...(conversationId && { conversationId }) })

export const getChatHistory = (conversationId) =>
  client.get(`/chat/history/${conversationId}`)

export const postFeedback = (traceId, score) =>
  client.post(`/chat/${traceId}/feedback`, { score })
