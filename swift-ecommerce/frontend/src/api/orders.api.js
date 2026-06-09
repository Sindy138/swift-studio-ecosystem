import client from './client'

export const createOrder = (serviceId, configData) =>
  client.post('/orders', { serviceId, configData })

export const getOrders = () => client.get('/orders')
export const getOrderById = (id) => client.get(`/orders/${id}`)
export const updateOrderStatus = (id, status) =>
  client.put(`/orders/${id}/status`, { status })

export const addDeliverable = (orderId, label, url) =>
  client.post(`/orders/${orderId}/deliverables`, { label, url })

export const getDeliverables = (orderId) =>
  client.get(`/orders/${orderId}/deliverables`)
