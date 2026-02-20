
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
    <div className="fullscreen-overlay">
      <div className="fs-video-area">
        <video ref={videoRef} autoPlay muted playsInline />

        <div className="fs-topbar">
          <div className="fs-live-pill">
            <div className="live-dot" /> LIVE · FULLSCREEN
          </div>
          <div className="fs-controls">
            <button className="fs-btn" onClick={onMinimize} title="Minimize (Esc)">⊡ &nbsp;Minimize</button>
            <button className="fs-btn stop" onClick={onStop}>⏹ &nbsp;Stop Sharing</button>
          </div>
        </div>

        <div className="fs-bottombar">
          <div className="fs-meta-item"><span>Display:</span><strong>{trackInfo?.displaySurface || '—'}</strong></div>
          <div className="fs-meta-item"><span>Resolution:</span><strong>{trackInfo ? `${trackInfo.width} × ${trackInfo.height}` : '—'}</strong></div>
          <div className="fs-meta-item"><span>FPS:</span><strong>{trackInfo?.frameRate || '—'}</strong></div>
          <div className="fs-meta-item" style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.5 }}>Press Esc to minimize</div>
        </div>
      </div>
    </div>
  )
}