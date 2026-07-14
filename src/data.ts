import type { Habit, HabitLog } from './types'
import { addDays, toDateKey } from './utils/date'

export const initialHabits: Habit[] = [
  { id: 'morning-walk', name: 'Morning walk', icon: 'walk', color: 'sage', createdAt: '2026-06-01' },
  { id: 'drink-water', name: 'Drink water', icon: 'water', color: 'sage', createdAt: '2026-06-14' },
  { id: 'read', name: 'Read 20 pages', icon: 'book', color: 'coral', createdAt: '2026-07-01' },
  { id: 'stretch', name: 'Stretch for 10 min', icon: 'stretch', color: 'lavender', createdAt: '2026-07-08' },
  { id: 'plan', name: 'Plan tomorrow', icon: 'plan', color: 'sky', createdAt: '2026-07-04' },
]

export function createInitialLogs(today = new Date()): HabitLog {
  const logs: HabitLog = {}
  const patterns = [
    ['morning-walk', 'drink-water'],
    ['morning-walk', 'drink-water', 'stretch'],
    ['morning-walk', 'read', 'plan'],
    ['morning-walk', 'drink-water', 'read'],
    ['morning-walk', 'drink-water', 'plan'],
    ['morning-walk', 'drink-water', 'read', 'stretch'],
    ['morning-walk', 'drink-water'],
  ]

  for (let offset = -27; offset <= 0; offset += 1) {
    const date = addDays(today, offset)
    const ids = patterns[(offset + 28) % patterns.length]
    logs[toDateKey(date)] = [...ids]
  }

  return logs
}
