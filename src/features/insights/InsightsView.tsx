import { ArrowLeft, RotateCcw, TrendingUp } from 'lucide-react'
import { HabitGlyph } from '../../components/HabitGlyph'
import type { Habit, HabitLog } from '../../types'
import { addDays, toDateKey } from '../../utils/date'

interface InsightsViewProps {
  habits: Habit[]
  logs: HabitLog
  totalCompletions: number
  bestStreak: (habitId: string) => number
  onBack: () => void
  onReset: () => void
}

function getLastFourWeeks(logs: HabitLog) {
  const today = new Date()
  return Array.from({ length: 28 }, (_, index) => {
    const date = addDays(today, index - 27)
    return { date, count: (logs[toDateKey(date)] ?? []).length }
  })
}

export function InsightsView({ habits, logs, totalCompletions, bestStreak, onBack, onReset }: InsightsViewProps) {
  const days = getLastFourWeeks(logs)
  const activeDays = days.filter((day) => day.count > 0).length
  const consistency = habits.length ? Math.round(days.reduce((sum, day) => sum + day.count, 0) / (habits.length * 28) * 100) : 0
  const bestHabit = [...habits].sort((a, b) => bestStreak(b.id) - bestStreak(a.id))[0]

  return (
    <main className="insights-view">
      <div className="insights-view__title">
        <div>
          <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={18} /> Back to today</button>
          <h1>Your momentum</h1>
          <p>A quiet look at the last four weeks.</p>
        </div>
        <button className="button button--secondary reset-button" type="button" onClick={onReset}><RotateCcw size={17} /> Reset demo data</button>
      </div>

      <section className="insight-summary" aria-label="Habit summary">
        <div><strong>{consistency}%</strong><span>Consistency</span></div>
        <div><strong>{activeDays}</strong><span>Active days</span></div>
        <div><strong>{totalCompletions}</strong><span>Total check-ins</span></div>
      </section>

      <section className="momentum-panel">
        <div className="section-heading">
          <div>
            <h2>Four-week rhythm</h2>
            <p>Each bar is one day. Progress is allowed to be uneven.</p>
          </div>
          <TrendingUp size={23} />
        </div>
        <div className="rhythm-chart" aria-label="Daily habit completions over the last 28 days">
          {days.map((day) => {
            const ratio = habits.length ? day.count / habits.length : 0
            return (
              <div className="rhythm-chart__day" key={toDateKey(day.date)}>
                <span style={{ height: `${Math.max(8, ratio * 100)}%` }} title={`${day.count} completions on ${day.date.toDateString()}`} />
              </div>
            )
          })}
        </div>
        <div className="rhythm-chart__labels"><span>4 weeks ago</span><span>Today</span></div>
      </section>

      <section className="habit-insights">
        <div className="section-heading">
          <div>
            <h2>Habit by habit</h2>
            <p>Built through repetition, not perfection.</p>
          </div>
          {bestHabit && <span className="best-note">Strongest rhythm: {bestHabit.name}</span>}
        </div>
        <div className="habit-insights__list">
          {habits.map((habit) => {
            const count = days.filter((day) => (logs[toDateKey(day.date)] ?? []).includes(habit.id)).length
            const percent = Math.round((count / 28) * 100)
            return (
              <article key={habit.id} data-color={habit.color}>
                <span className="habit-insights__icon"><HabitGlyph icon={habit.icon} size={24} /></span>
                <div><h3>{habit.name}</h3><p>Best streak: {bestStreak(habit.id)} days</p></div>
                <div className="mini-progress"><span style={{ width: `${percent}%` }} /></div>
                <strong>{count}<small>/28</small></strong>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
