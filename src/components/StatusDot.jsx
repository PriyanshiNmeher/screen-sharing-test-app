const dotStyles = {
  idle:       'bg-muted',
  requesting: 'bg-accent2 shadow-[0_0_8px_#0066ff] animate-pulse-fast',
  granted:    'bg-accent shadow-[0_0_8px_#00ff88] animate-pulse-dot',
  cancelled:  'bg-warn2',
  stopped:    'bg-warn2',
  denied:     'bg-warn',
  error:      'bg-warn',
}

export default function StatusDot({ status }) {
  const key = status.toLowerCase()
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotStyles[key] || 'bg-muted'}`} />
  )
}