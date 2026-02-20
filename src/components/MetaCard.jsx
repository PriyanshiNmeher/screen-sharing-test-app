export default function MetaCard({ label, value, accent }) {
  return (
    <div className="meta-card">
      <div className="meta-label">{label}</div>
      <div className={`meta-value${accent ? ' accent' : ''}`}>{value}</div>
    </div>
  )
}