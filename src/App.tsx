"use client"

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProgressRing } from './components/ProgressRing'
import { TopBar, type View } from './components/TopBar'
import { HabitModal } from './features/habits/HabitModal'
import { HabitRow } from './features/habits/HabitRow'
import { InsightsView } from './features/insights/InsightsView'
import { WeekPanel } from './features/week/WeekPanel'
import { useHabitStore } from './hooks/useHabitStore'
import type { Habit } from './types'
import { addDays, formatLongDate, getWeek, isFuture, isSameDay, toDateKey } from './utils/date'

function App() {
  const [view, setView] = useState<View>('today')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [editingHabit, setEditingHabit] = useState<Habit | null | undefined>(undefined)
  const store = useHabitStore()
  const dateKey = toDateKey(selectedDate)
  const completed = store.logs[dateKey] ?? []
  const progress = store.habits.length ? Math.round((completed.length / store.habits.length) * 100) : 0
  const week = useMemo(() => getWeek(selectedDate), [selectedDate])
  const selectedIsToday = isSameDay(selectedDate, new Date())

  const selectDate = (date: Date) => {
    if (!isFuture(date)) setSelectedDate(date)
  }

  const deleteHabit = (habit: Habit) => {
    if (window.confirm(`Eliminare “${habit.name}”? Verranno cancellati anche tutti i completamenti associati.`)) store.deleteHabit(habit.id)
  }

  const clearData = () => {
    if (window.confirm('Eliminare tutte le abitudini e tutti i completamenti? Questa azione non può essere annullata.')) store.clearData()
  }

  if (view === 'insights') {
    return (
      <div className="app-shell">
        <TopBar view={view} onViewChange={setView} />
        <InsightsView
          habits={store.habits}
          logs={store.logs}
          totalCompletions={store.totalCompletions}
          bestStreak={store.bestStreak}
          onBack={() => setView('today')}
          onClear={clearData}
        />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <TopBar view={view} onViewChange={setView} />
      <main className="today-view">
        <section className="today-hero">
          <div>
            <div className="date-control">
              <button className="icon-button" type="button" onClick={() => selectDate(addDays(selectedDate, -1))} aria-label="Giorno precedente"><ChevronLeft size={20} /></button>
              <button className="today-shortcut" type="button" onClick={() => setSelectedDate(new Date())} disabled={selectedIsToday}>Oggi</button>
              <button className="icon-button" type="button" onClick={() => selectDate(addDays(selectedDate, 1))} disabled={selectedIsToday} aria-label="Giorno successivo"><ChevronRight size={20} /></button>
            </div>
            <h1>{formatLongDate(selectedDate)}</h1>
            <p>{selectedIsToday ? 'Piccoli passi, progressi visibili.' : 'Un giorno che merita attenzione.'}</p>
          </div>
          <ProgressRing value={progress} />
        </section>

        <div className="today-layout">
          <section className="habit-section" aria-labelledby="rhythm-title">
            <div className="habit-section__header">
              <div><h2 id="rhythm-title">{selectedIsToday ? 'Il ritmo di oggi' : 'Il ritmo del giorno'}</h2><span>{completed.length} di {store.habits.length} {completed.length === 1 ? 'completata' : 'completate'}</span></div>
              <button className="button button--primary" type="button" onClick={() => setEditingHabit(null)}><Plus size={19} /> Aggiungi abitudine</button>
            </div>
            <div className="habit-list">
              {store.habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  completed={completed.includes(habit.id)}
                  streak={store.getStreak(habit.id, selectedDate)}
                  onToggle={() => store.toggleHabit(habit.id, selectedDate)}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => deleteHabit(habit)}
                />
              ))}
              {store.habits.length === 0 && (
                <div className="empty-state"><h3>Inizia con una piccola abitudine.</h3><p>La routine migliore è quella a cui puoi tornare.</p><button type="button" onClick={() => setEditingHabit(null)}>Aggiungi la prima abitudine</button></div>
              )}
            </div>
          </section>

          <WeekPanel
            habits={store.habits}
            logs={store.logs}
            week={week}
            selectedDate={selectedDate}
            onSelectDate={selectDate}
            onToggle={store.toggleHabit}
            onOpenInsights={() => setView('insights')}
          />
        </div>
      </main>

      {editingHabit !== undefined && (
        <HabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(undefined)}
          onSave={(draft) => {
            if (editingHabit) store.updateHabit(editingHabit.id, draft)
            else store.addHabit(draft)
            setEditingHabit(undefined)
          }}
        />
      )}
    </div>
  )
}

export default App
