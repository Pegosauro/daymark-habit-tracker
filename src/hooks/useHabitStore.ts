import { useCallback, useEffect, useMemo, useState } from 'react'
import { createInitialLogs, initialHabits } from '../data'
import type { Habit, HabitDraft, HabitLog } from '../types'
import { addDays, fromDateKey, toDateKey } from '../utils/date'

const HABITS_KEY = 'daymark.habits.v1'
const LOGS_KEY = 'daymark.logs.v1'

function loadValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const saved = window.localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

export function useHabitStore() {
  const [habits, setHabits] = useState<Habit[]>(() => loadValue(HABITS_KEY, initialHabits))
  const [logs, setLogs] = useState<HabitLog>(() => loadValue(LOGS_KEY, createInitialLogs()))

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
  }, [logs])

  const toggleHabit = useCallback((habitId: string, date: Date) => {
    const key = toDateKey(date)
    setLogs((current) => {
      const completed = current[key] ?? []
      const next = completed.includes(habitId)
        ? completed.filter((id) => id !== habitId)
        : [...completed, habitId]
      return { ...current, [key]: next }
    })
  }, [])

  const addHabit = useCallback((draft: HabitDraft) => {
    const habit: Habit = {
      ...draft,
      id: `${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`,
      createdAt: toDateKey(new Date()),
    }
    setHabits((current) => [...current, habit])
  }, [])

  const updateHabit = useCallback((habitId: string, draft: HabitDraft) => {
    setHabits((current) => current.map((habit) => (habit.id === habitId ? { ...habit, ...draft } : habit)))
  }, [])

  const deleteHabit = useCallback((habitId: string) => {
    setHabits((current) => current.filter((habit) => habit.id !== habitId))
    setLogs((current) => {
      const next: HabitLog = {}
      Object.entries(current).forEach(([key, ids]) => {
        next[key] = ids.filter((id) => id !== habitId)
      })
      return next
    })
  }, [])

  const resetData = useCallback(() => {
    setHabits(initialHabits)
    setLogs(createInitialLogs())
  }, [])

  const getStreak = useCallback((habitId: string, from = new Date()) => {
    let streak = 0
    let cursor = new Date(from)
    const todayKey = toDateKey(cursor)
    if (!(logs[todayKey] ?? []).includes(habitId)) cursor = addDays(cursor, -1)

    while ((logs[toDateKey(cursor)] ?? []).includes(habitId)) {
      streak += 1
      cursor = addDays(cursor, -1)
    }
    return streak
  }, [logs])

  const totalCompletions = useMemo(
    () => Object.values(logs).reduce((total, day) => total + day.length, 0),
    [logs],
  )

  const bestStreak = useCallback((habitId: string) => {
    const dates = Object.entries(logs)
      .filter(([, ids]) => ids.includes(habitId))
      .map(([key]) => fromDateKey(key))
      .sort((a, b) => a.getTime() - b.getTime())
    let best = 0
    let current = 0
    let previous: Date | null = null

    dates.forEach((date) => {
      if (!previous || toDateKey(addDays(previous, 1)) === toDateKey(date)) current += 1
      else current = 1
      best = Math.max(best, current)
      previous = date
    })
    return best
  }, [logs])

  return {
    habits,
    logs,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    resetData,
    getStreak,
    bestStreak,
    totalCompletions,
  }
}
