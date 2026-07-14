export function ProgressRing({ value }: { value: number }) {
  const radius = 55
  const circumference = 2 * Math.PI * radius
  const dash = circumference * (value / 100)

  return (
    <div className="progress-ring" aria-label={`${value}% daily progress`}>
      <svg viewBox="0 0 128 128" role="img">
        <circle className="progress-ring__track" cx="64" cy="64" r={radius} />
        <circle
          className="progress-ring__value"
          cx="64"
          cy="64"
          r={radius}
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="progress-ring__label">
        <strong>{value}%</strong>
        <span>Daily progress</span>
      </div>
    </div>
  )
}
