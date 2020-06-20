import moment from 'moment'
export function formatDateTime(date?: string) {
  if (!date) return ''
  if (typeof date === 'string') return date.split('.')[0].replace('T', ' ')
  return ''
}

export function formatDate(date?: string | number, format = 'YYYY-MM-DD') {
  if (!date) return ''
  if (typeof date === 'string') return date.split('T')[0]
  if (typeof date === 'number') return moment(date).format(format)
  return ''
}
