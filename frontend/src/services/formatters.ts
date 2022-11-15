export const formatDateTime = (date: Date | string, options: Intl.DateTimeFormatOptions = {}) => {
  date = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ...options
  }).format(date)
}
