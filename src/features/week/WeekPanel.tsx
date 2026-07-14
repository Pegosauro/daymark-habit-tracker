import { ArrowRight, Sun } from 'lucide-react'
import type { Habit, HabitLog } from '../../types'
import { isFuture, isSameDay, toDateKey } from '../../utils/date'

interface WeekPanelProps {
  habits: Habit[]
  logs: HabitLog
  week: Date[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onToggle: (habitId: string, date: Date) => void
  onOpenInsights: () => void
}

export function WeekPanel({ habits, logs, week, selectedDate, onSelectDate, onToggle, onOpenInsights }: WeekPanelProps) {
  return (
    <aside className="week-panel" aria-labelledby="week-title">
      <div className="week-panel__header">
        <h2 id="week-title">This week</h2>
        <span>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(week[0])}</span>
      </div>
      <div className="week-grid">
        <div className="week-grid__corner" />
        {week.map((date) => (
          <button
            key={toDateKey(date)}
            className={`week-day ${isSameDay(date, selectedDate) ? 'is-selected' : ''}`}
            type="button"
            onClick={() => onSelectDate(date)}
            aria-label={`Select ${date.toDateString()}`}
          >
            <span>{new Intl.DateTimeFormat('en-US', { weekday: 'narrow' }).format(date)}</span>
            <strong>{date.getDate()}</strong>
          </button>
        ))}
        {habits.map((habit) => (
          <div className="week-grid__row" key={habit.id}>
            <span className="week-grid__habit" data-color={habit.color} title={habit.name}>
              <span aria-hidden="true" />
              <span>{habit.name}</span>
            </span>
            {week.map((date) => {
              const complete = (logs[toDateKey(date)] ?? []).includes(habit.id)
              const future = isFuture(date)
              return (
                <button
                  key={toDateKey(date)}
                  className={`week-dot ${complete ? 'is-complete' : ''} ${isSameDay(date, selectedDate) ? 'is-today' : ''}`}
                  data-color={habit.color}
                  type="button"
                  disabled={future}
                  onClick={() => onToggle(habit.id, date)}
                  aria-label={`${complete ? 'Clear' : 'Complete'} ${habit.name} on ${date.toDateString()}`}
                  aria-pressed={complete}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="week-panel__footer">
        <p><Sun size={22} strokeWidth={1.9} /> <span>You’re building momentum—keep showing up.</span></p>
        <button type="button" onClick={onOpenInsights}>View insights <ArrowRight size={18} /></button>
      </div>
    </aside>
  )
}
