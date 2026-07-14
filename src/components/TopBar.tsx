import { Leaf } from 'lucide-react'

export type View = 'today' | 'insights'

interface TopBarProps {
  view: View
  onViewChange: (view: View) => void
}

export function TopBar({ view, onViewChange }: TopBarProps) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => onViewChange('today')} aria-label="Open Today">
        <span className="brand__mark"><Leaf size={22} strokeWidth={2.2} /></span>
        <span>Daymark</span>
      </button>
      <nav className="topbar__nav" aria-label="Main navigation">
        <button className={view === 'today' ? 'is-active' : ''} type="button" onClick={() => onViewChange('today')}>Today</button>
        <button className={view === 'insights' ? 'is-active' : ''} type="button" onClick={() => onViewChange('insights')}>Insights</button>
      </nav>
      <div className="avatar" aria-label="Matteo's profile">MP</div>
    </header>
  )
}
