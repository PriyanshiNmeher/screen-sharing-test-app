const variants = {
  primary:   'bg-accent text-black font-bold shadow-[0_0_24px_rgba(0,255,136,0.2)] hover:bg-[#00e87a] hover:shadow-[0_0_32px_rgba(0,255,136,0.35)] hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed',
  secondary: 'bg-surface2 text-white border border-border hover:bg-[#222228] hover:border-[#3a3a44]',
  danger:    'bg-red-500/10 text-warn border border-warn/30 hover:bg-red-500/20',
}

export default function Button({ variant = 'primary', size, onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 rounded-xl font-display font-semibold
        transition-all duration-150 outline-none cursor-pointer whitespace-nowrap
        focus-visible:ring-2 focus-visible:ring-accent/50
        ${size === 'sm' ? 'px-4 py-2 text-sm' : 'px-7 py-3.5 text-[15px]'}
        ${variants[variant] || variants.primary}
      `}
    >
      {children}
    </button>
  )
}