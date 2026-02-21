export default function AppHeader({ route }) {
  return (
    <header className="border-b border-border bg-surface px-8 py-4 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#00ff88] animate-pulse-dot" />
      <span className="font-mono text-xs tracking-widest text-muted uppercase">
        {route === 'HOME'
          ? 'screen-share-test / home'
          : 'screen-share-test / screen-test'}
      </span>
    </header>
  )
}