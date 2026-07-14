export type HabitIcon = 'walk' | 'water' | 'book' | 'stretch' | 'plan' | 'meditate' | 'heart'

export type HabitColor = 'sage' | 'coral' | 'lavender' | 'sky' | 'sun'

export interface Habit {
  id: string
  name: string
  icon: HabitIcon
  color: HabitColor
  createdAt: string
}

export type HabitLog = Record<string, string[]>

export interface HabitDraft {
  name: string
  icon: HabitIcon
  color: HabitColor
}
