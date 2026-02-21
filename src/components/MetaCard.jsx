export default function MetaCard({ label, value, accent }) {
  return (
    <div className="bg-surface2 border border-border rounded-xl px-4 py-3 min-w-0 overflow-hidden">
      <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">{label}</div>
      <div className={`font-mono text-sm font-semibold break-all truncate ${accent ? 'text-accent' : 'text-white'}`} title={value}>{value}</div>
    </div>
  )
}