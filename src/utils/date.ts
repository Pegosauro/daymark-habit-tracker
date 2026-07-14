const DAY_MS = 86_400_000

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function startOfWeek(date: Date): Date {
  const start = new Date(date)
  const day = start.getDay() || 7
  start.setDate(start.getDate() - day + 1)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getWeek(date: Date): Date[] {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

export function isSameDay(first: Date, second: Date): boolean {
  return toDateKey(first) === toDateKey(second)
}

export function isFuture(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return target.getTime() > today.getTime()
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatWeekRange(week: Date[]): string {
  const first = week[0]
  const last = week[6]
  const start = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(first)
  const end = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(last)
  return `${start} – ${end}`
}

export function daysBetween(first: Date, second: Date): number {
  const a = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate())
  const b = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate())
  return Math.round((b - a) / DAY_MS)
}
