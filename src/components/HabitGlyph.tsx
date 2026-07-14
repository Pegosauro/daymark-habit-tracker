import type { LucideIcon } from 'lucide-react'
import { BookOpen, CalendarCheck2, Footprints, GlassWater, HeartPulse, PersonStanding, Sparkles } from 'lucide-react'
import type { HabitIcon } from '../types'

const glyphs: Record<HabitIcon, LucideIcon> = {
  walk: Footprints,
  water: GlassWater,
  book: BookOpen,
  stretch: PersonStanding,
  plan: CalendarCheck2,
  meditate: Sparkles,
  heart: HeartPulse,
}

export function HabitGlyph({ icon, size = 30 }: { icon: HabitIcon; size?: number }) {
  const Glyph = glyphs[icon]
  return <Glyph aria-hidden="true" size={size} strokeWidth={1.8} />
}
