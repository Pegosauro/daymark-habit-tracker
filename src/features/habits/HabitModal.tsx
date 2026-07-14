import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HabitGlyph } from '../../components/HabitGlyph'
import type { Habit, HabitColor, HabitDraft, HabitIcon } from '../../types'

const icons: HabitIcon[] = ['walk', 'water', 'book', 'stretch', 'plan', 'meditate', 'heart']
const colors: HabitColor[] = ['sage', 'coral', 'lavender', 'sky', 'sun']

interface HabitModalProps {
  habit?: Habit | null
  onClose: () => void
  onSave: (draft: HabitDraft) => void
}

export function HabitModal({ habit, onClose, onSave }: HabitModalProps) {
  const [draft, setDraft] = useState<HabitDraft>({
    name: habit?.name ?? '',
    icon: habit?.icon ?? 'walk',
    color: habit?.color ?? 'sage',
  })

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.name.trim()) return
    onSave({ ...draft, name: draft.name.trim() })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="habit-modal-title">
        <div className="modal__header">
          <div>
            <h2 id="habit-modal-title">{habit ? 'Edit habit' : 'Add a habit'}</h2>
            <p>Make it small enough to show up for.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={22} /></button>
        </div>
        <form onSubmit={submit}>
          <label className="field">
            <span>Habit name</span>
            <input
              autoFocus
              value={draft.name}
              maxLength={48}
              placeholder="e.g. Take a lunchtime walk"
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
          </label>
          <fieldset className="choice-group">
            <legend>Icon</legend>
            <div className="icon-choices">
              {icons.map((icon) => (
                <button
                  key={icon}
                  className={draft.icon === icon ? 'is-selected' : ''}
                  type="button"
                  onClick={() => setDraft({ ...draft, icon })}
                  aria-label={`${icon} icon`}
                  aria-pressed={draft.icon === icon}
                >
                  <HabitGlyph icon={icon} size={23} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="choice-group">
            <legend>Color</legend>
            <div className="color-choices">
              {colors.map((color) => (
                <button
                  key={color}
                  className={draft.color === color ? 'is-selected' : ''}
                  data-color={color}
                  type="button"
                  onClick={() => setDraft({ ...draft, color })}
                  aria-label={`${color} color`}
                  aria-pressed={draft.color === color}
                >
                  {draft.color === color && <Check size={16} />}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="modal__actions">
            <button className="button button--secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button--primary" type="submit" disabled={!draft.name.trim()}>
              {habit ? 'Save changes' : 'Add habit'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
