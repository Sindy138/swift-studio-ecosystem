import { useState, useEffect, useCallback } from 'react'
import { getServices, getServiceById } from '@/api/services.api'

export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getServices()
      setServices(data)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al cargar los servicios.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  return { services, loading, error, refetch: fetchServices }
}

export function useService(id) {
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getServiceById(id)
      .then(({ data }) => setService(data))
      .catch((err) => setError(err.response?.data?.error ?? 'Servicio no encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  return { service, loading, error }
}
