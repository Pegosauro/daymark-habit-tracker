import { Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { HabitGlyph } from '../../components/HabitGlyph'
import type { Habit } from '../../types'

interface HabitRowProps {
  habit: Habit
  completed: boolean
  streak: number
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export function HabitRow({ habit, completed, streak, onToggle, onEdit, onDelete }: HabitRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  return (
    <article className={`habit-row ${completed ? 'is-complete' : ''}`} data-color={habit.color}>
      <button
        className="habit-row__check"
        type="button"
        onClick={onToggle}
        aria-label={completed ? `Mark ${habit.name} incomplete` : `Complete ${habit.name}`}
        aria-pressed={completed}
      >
        {completed && <Check size={26} strokeWidth={2.4} />}
      </button>
      <span className="habit-row__glyph"><HabitGlyph icon={habit.icon} /></span>
      <div className="habit-row__copy">
        <h3>{habit.name}</h3>
        <p>Daily <span aria-hidden="true">•</span> {streak} day streak</p>
      </div>
      <div className="habit-row__menu" ref={menuRef}>
        <button
          className="icon-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={`Actions for ${habit.name}`}
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={22} />
        </button>
        {menuOpen && (
          <div className="context-menu" role="menu">
            <button type="button" role="menuitem" onClick={() => { onEdit(); setMenuOpen(false) }}>
              <Pencil size={16} /> Edit
            </button>
            <button className="is-danger" type="button" role="menuitem" onClick={() => { onDelete(); setMenuOpen(false) }}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
