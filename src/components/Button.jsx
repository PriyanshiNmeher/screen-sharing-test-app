export default function Button({ variant = 'primary', size, onClick, disabled, children }) {
  const cls = ['btn', `btn-${variant}`, size ? `btn-${size}` : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}