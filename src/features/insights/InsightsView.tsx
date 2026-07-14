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
  onClear: () => void
}

function getLastFourWeeks(logs: HabitLog) {
  const today = new Date()
  return Array.from({ length: 28 }, (_, index) => {
    const date = addDays(today, index - 27)
    return { date, count: (logs[toDateKey(date)] ?? []).length }
  })
}

export function InsightsView({ habits, logs, totalCompletions, bestStreak, onBack, onClear }: InsightsViewProps) {
  const days = getLastFourWeeks(logs)
  const activeDays = days.filter((day) => day.count > 0).length
  const consistency = habits.length ? Math.round(days.reduce((sum, day) => sum + day.count, 0) / (habits.length * 28) * 100) : 0
  const bestHabit = [...habits].sort((a, b) => bestStreak(b.id) - bestStreak(a.id))[0]

  return (
    <main className="insights-view">
      <div className="insights-view__title">
        <div>
          <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={18} /> Torna a oggi</button>
          <h1>I tuoi progressi</h1>
          <p>Uno sguardo alle ultime quattro settimane.</p>
        </div>
        <button className="button button--secondary reset-button" type="button" onClick={onClear} disabled={habits.length === 0 && totalCompletions === 0}><RotateCcw size={17} /> Cancella tutti i dati</button>
      </div>

      <section className="insight-summary" aria-label="Riepilogo delle abitudini">
        <div><strong>{consistency}%</strong><span>Costanza</span></div>
        <div><strong>{activeDays}</strong><span>Giorni attivi</span></div>
        <div><strong>{totalCompletions}</strong><span>Completamenti</span></div>
      </section>

      <section className="momentum-panel">
        <div className="section-heading">
          <div>
            <h2>Il ritmo di quattro settimane</h2>
            <p>Ogni barra rappresenta un giorno. I progressi non devono essere perfetti.</p>
          </div>
          <TrendingUp size={23} />
        </div>
        <div className="rhythm-chart" aria-label="Completamenti giornalieri negli ultimi 28 giorni">
          {days.map((day) => {
            const ratio = habits.length ? day.count / habits.length : 0
            return (
              <div className="rhythm-chart__day" key={toDateKey(day.date)}>
                <span style={{ height: ratio > 0 ? `${Math.max(8, ratio * 100)}%` : '0' }} title={`${day.count} completamenti il ${new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(day.date)}`} />
              </div>
            )
          })}
        </div>
        <div className="rhythm-chart__labels"><span>4 settimane fa</span><span>Oggi</span></div>
      </section>

      <section className="habit-insights">
        <div className="section-heading">
          <div>
            <h2>Abitudine per abitudine</h2>
            <p>Conta la ripetizione, non la perfezione.</p>
          </div>
          {bestHabit && <span className="best-note">Ritmo migliore: {bestHabit.name}</span>}
        </div>
        <div className="habit-insights__list">
          {habits.map((habit) => {
            const count = days.filter((day) => (logs[toDateKey(day.date)] ?? []).includes(habit.id)).length
            const percent = Math.round((count / 28) * 100)
            return (
              <article key={habit.id} data-color={habit.color}>
                <span className="habit-insights__icon"><HabitGlyph icon={habit.icon} size={24} /></span>
                <div><h3>{habit.name}</h3><p>Serie migliore: {bestStreak(habit.id)} {bestStreak(habit.id) === 1 ? 'giorno' : 'giorni'}</p></div>
                <div className="mini-progress"><span style={{ width: `${percent}%` }} /></div>
                <strong>{count}<small>/28</small></strong>
              </article>
            )
          })}
          {habits.length === 0 && <div className="insights-empty">Aggiungi un’abitudine e completa qualche giornata per vedere qui i tuoi progressi.</div>}
        </div>
      </section>
    </main>
  )
}
