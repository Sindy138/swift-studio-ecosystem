export const formatPrice = (amount) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)

export const formatDate = (dateString) =>
  new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(dateString)
  )

export const formatRelativeTime = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return formatDate(dateString)
}
