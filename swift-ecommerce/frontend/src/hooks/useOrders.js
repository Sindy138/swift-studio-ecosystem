import { useState, useEffect, useCallback } from 'react'
import { getOrders, getOrderById } from '@/api/orders.api'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getOrders()
      setOrders(data)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al cargar los pedidos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}

export function useOrder(id) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getOrderById(id)
      .then(({ data }) => setOrder(data))
      .catch((err) => setError(err.response?.data?.error ?? 'Pedido no encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  return { order, loading, error }
}
