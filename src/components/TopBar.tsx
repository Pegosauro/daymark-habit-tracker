import { Leaf } from 'lucide-react'

export type View = 'today' | 'insights'

interface TopBarProps {
  view: View
  onViewChange: (view: View) => void
}

export function TopBar({ view, onViewChange }: TopBarProps) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => onViewChange('today')} aria-label="Apri la pagina di oggi">
        <span className="brand__mark"><Leaf size={22} strokeWidth={2.2} /></span>
        <span>Daymark</span>
      </button>
      <nav className="topbar__nav" aria-label="Navigazione principale">
        <button className={view === 'today' ? 'is-active' : ''} type="button" onClick={() => onViewChange('today')}>Oggi</button>
        <button className={view === 'insights' ? 'is-active' : ''} type="button" onClick={() => onViewChange('insights')}>Statistiche</button>
      </nav>
      <div className="avatar" aria-label="Profilo di Matteo">MP</div>
    </header>
  )
}
