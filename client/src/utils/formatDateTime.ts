export const formatDateTime = (iso?: string | null, includeDate = true) => {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (!includeDate) return time
  const date = d.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  return `${time}, ${date}`
}
