import { useEffect, useRef } from 'react'

export default function FullscreenOverlay({ stream, trackInfo, onMinimize, onStop }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return
    video.srcObject = stream
    video.play().catch(() => {})
    return () => { video.srcObject = null }
  }, [stream])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onMinimize() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onMinimize])

  return (
    <div className="fixed inset-0 z-[8888] bg-black flex flex-col animate-fade-in">
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain block" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/75 to-transparent flex items-center justify-between gap-3">
          <div className="bg-black/55 backdrop-blur-md border border-accent/35 rounded-lg px-3 py-1.5 font-mono text-xs text-accent flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-fast" />
            LIVE · FULLSCREEN
          </div>
          <div className="flex gap-2">
            <button
              onClick={onMinimize}
              className="bg-black/55 backdrop-blur-md border border-white/15 rounded-lg text-white px-3.5 py-2 font-display font-semibold text-sm flex items-center gap-1.5 hover:bg-white/10 transition-all cursor-pointer"
            >
              ⊡ &nbsp;Minimize
            </button>
            <button
              onClick={onStop}
              className="bg-black/55 backdrop-blur-md border border-warn/40 rounded-lg text-warn px-3.5 py-2 font-display font-semibold text-sm flex items-center gap-1.5 hover:bg-warn/20 transition-all cursor-pointer"
            >
              ⏹ &nbsp;Stop Sharing
            </button>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/75 to-transparent flex gap-5 items-center flex-wrap font-mono text-xs text-white/55">
          <div className="flex items-center gap-1.5"><span>Display:</span><strong className="text-white/90">{trackInfo?.displaySurface || '—'}</strong></div>
          <div className="flex items-center gap-1.5"><span>Resolution:</span><strong className="text-white/90">{trackInfo ? `${trackInfo.width} × ${trackInfo.height}` : '—'}</strong></div>
          <div className="flex items-center gap-1.5"><span>FPS:</span><strong className="text-white/90">{trackInfo?.frameRate || '—'}</strong></div>
          <div className="ml-auto text-[11px] opacity-50">Press Esc to minimize</div>
        </div>
      </div>
    </div>
  )
}