import { useState, useEffect } from 'react'
import { useScreenShare } from '../hooks/useScreenShare.js'
import { PermissionState, Route } from '../constants.js'
import Button from '../components/Button.jsx'
import StatusDot from '../components/StatusDot.jsx'
import MetaCard from '../components/MetaCard.jsx'
import Steps from '../components/Steps.jsx'
import PermissionPrompt from '../components/PermissionPrompt.jsx'
import FullscreenOverlay from '../components/FullscreenOverlay.jsx'

export default function ScreenTestPage({ onNavigate }) {
  const {
    status, permissionStage, permissionType, savedPermission,
    error, trackInfo, videoRef, streamRef,
    start, stop, reset, revokePermission,
    allowWhileVisiting, allowOnce, denyPermission,
    reattachVideo,
  } = useScreenShare()

  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleBack    = () => { reset(); onNavigate(Route.HOME) }
  const handleRetry   = () => { reset(); setTimeout(() => start(), 50) }
  const handleStopFS  = () => { setIsFullscreen(false); stop() }

  /* After minimize, reattach main video element to stream */
  const handleMinimize = () => {
    setIsFullscreen(false)
    requestAnimationFrame(() => reattachVideo())
  }

  /* Also reattach whenever GRANTED state is set (covers initial grant) */
  useEffect(() => {
    if (status === PermissionState.GRANTED) {
      requestAnimationFrame(() => reattachVideo())
    }
  }, [status, reattachVideo])

  const is = s => status === s
  const P  = PermissionState

  const permBadge = permissionType === 'visiting'
    ? { label: '🕒 Session permission', cls: 'visiting' }
    : permissionType === 'once'
    ? { label: '✅ One-time permission', cls: 'once' }
    : null

  return (
    <>
      {permissionStage === 'prompting' && (
        <PermissionPrompt
          onAllowVisiting={allowWhileVisiting}
          onAllowOnce={allowOnce}
          onDeny={denyPermission}
        />
      )}

      {isFullscreen && is(P.GRANTED) && (
        <FullscreenOverlay
          stream={streamRef.current}
          trackInfo={trackInfo}
          onMinimize={handleMinimize}
          onStop={handleStopFS}
        />
      )}

      <div className="page">
        <div className="test-wrap">

          <div className="test-header">
            <div className="breadcrumb">
              <span style={{ cursor:'pointer', color:'#888' }} onClick={handleBack}>Home</span>
              <span className="breadcrumb-sep">/</span>
              <span>Screen Test</span>
            </div>
            <h1>Screen Share Diagnostics</h1>
          </div>

          <Steps status={status} />

          <div className="status-panel">
            <div className="status-panel-header">
              <StatusDot status={status} />
              <span>Stream Status</span>

              {permBadge && (
                <span className={`perm-badge ${permBadge.cls}`}>{permBadge.label}</span>
              )}
              {savedPermission?.type === 'visiting' && !is(P.GRANTED) && (
                <button className="revoke-link" onClick={revokePermission}>revoke</button>
              )}

              <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:11 }}>
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            <div className="status-panel-body">

              {/* IDLE */}
              {is(P.IDLE) && permissionStage === 'idle' && (
                <div className="idle-body">
                  <div className="status-indicator" style={{ justifyContent:'center', marginBottom:16 }}>
                    <StatusDot status={status} />
                    <span className="status-label" style={{ color:'var(--muted)' }}>Ready to Start</span>
                  </div>
                  {savedPermission?.type === 'visiting'
                    ? <p>Session permission active — screen picker will open directly.</p>
                    : <p>Click below — a permission dialog will appear first, then the OS screen picker.</p>
                  }
                  <Button onClick={start}>▶ &nbsp;Request Screen Share</Button>
                </div>
              )}

              {/* REQUESTING */}
              {is(P.REQUESTING) && (
                <div className="requesting-body">
                  <div className="spinner" />
                  <div className="status-indicator" style={{ justifyContent:'center', marginBottom:12 }}>
                    <StatusDot status={status} />
                    <span className="status-label">Opening Screen Picker…</span>
                  </div>
                  <p>Select a screen, window, or tab from the browser picker.</p>
                </div>
              )}

              {/* GRANTED */}
              {is(P.GRANTED) && (
                <>
                  <div className="status-indicator" style={{ marginBottom:20 }}>
                    <StatusDot status={status} />
                    <span className="status-label" style={{ color:'var(--accent)' }}>Screen Stream Active</span>
                  </div>

                  <div className="stream-grid">
                    <div>
                      <div className="video-wrap">
                        <video ref={videoRef} autoPlay muted playsInline />
                        <div className="live-badge"><div className="live-dot" /> LIVE</div>
                        <div className="video-action-btns">
                          <button className="vid-act-btn expand" title="Fullscreen"
                            onClick={() => setIsFullscreen(true)}>⛶</button>
                        </div>
                      </div>
                      <div className="stream-controls">
                        <Button onClick={() => setIsFullscreen(true)}>⛶ &nbsp;Fullscreen</Button>
                        <Button variant="danger" onClick={stop}>⏹ &nbsp;Stop Sharing</Button>
                        <Button variant="secondary" onClick={handleBack}>← Home</Button>
                      </div>
                    </div>

                    <div className="meta-panel">
                      <MetaCard label="Display Type"  value={trackInfo?.displaySurface || '—'} accent />
                      <MetaCard label="Resolution"    value={trackInfo ? `${trackInfo.width} × ${trackInfo.height}` : '—'} />
                      <MetaCard label="Frame Rate"    value={trackInfo ? `${trackInfo.frameRate} fps` : '—'} />
                      <MetaCard label="Track Label"   value={trackInfo?.label || '—'} />
                      <MetaCard label="Permission"    value={permissionType === 'visiting' ? 'While Visiting' : permissionType === 'once' ? 'One-Time' : '—'} />
                    </div>
                  </div>
                </>
              )}

              {/* CANCELLED */}
              {is(P.CANCELLED) && (
                <div className="error-body">
                  <div className="error-code">ERROR · NotAllowedError · USER_CANCELLED</div>
                  <div className="status-indicator" style={{ marginBottom:8 }}>
                    <StatusDot status={status} />
                    <span className="status-label" style={{ color:'var(--warn2)' }}>Screen Picker Cancelled</span>
                  </div>
                  <p className="error-desc">You dismissed the screen selector without choosing a source.</p>
                  <div className="btn-row">
                    <Button onClick={start}>↻ &nbsp;Try Again</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

              {/* DENIED */}
              {is(P.DENIED) && (
                <div className="error-body">
                  <div className="error-code">ERROR · NotAllowedError · PERMISSION_DENIED</div>
                  <div className="status-indicator" style={{ marginBottom:8 }}>
                    <StatusDot status={status} />
                    <span className="status-label" style={{ color:'var(--warn)' }}>Permission Denied</span>
                  </div>
                  <p className="error-desc">
                    Blocked by "Don't Allow" or OS/browser security settings.
                  </p>
                  <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'16px 18px', marginBottom:16 }}>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--muted)', marginBottom:10, letterSpacing:'0.06em' }}>HOW TO FIX</div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text)', lineHeight:2 }}>
                      <div>🔒 <strong>Chrome/Edge:</strong> Lock icon → Site settings → Screen capture → Allow</div>
                      <div>🍎 <strong>macOS:</strong> System Settings → Privacy → Screen Recording → Enable browser</div>
                      <div>🪟 <strong>Windows:</strong> Settings → Privacy → Screen capture → Allow</div>
                    </div>
                  </div>
                  <div className="btn-row">
                    <Button onClick={start}>↻ &nbsp;Try Again</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {is(P.ERROR) && (
                <div className="error-body">
                  <div className="error-code">ERROR · UNKNOWN</div>
                  <div className="status-indicator" style={{ marginBottom:8 }}>
                    <StatusDot status={status} />
                    <span className="status-label" style={{ color:'var(--warn)' }}>Unexpected Error</span>
                  </div>
                  <p className="error-desc">An unexpected error occurred initialising the media stream.</p>
                  {error && <div className="error-msg">⚠ {error}</div>}
                  <div className="btn-row">
                    <Button onClick={start}>↻ &nbsp;Retry</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

              {/* STOPPED */}
              {is(P.STOPPED) && (
                <div className="stopped-body">
                  <div className="stopped-icon">⏹</div>
                  <div className="status-indicator" style={{ justifyContent:'center', marginBottom:12 }}>
                    <StatusDot status={status} />
                    <span className="status-label" style={{ color:'var(--warn2)' }}>Screen Sharing Stopped</span>
                  </div>
                  <p>
                    All media tracks released and stream cleaned up.
                    {permissionType === 'once' && (
                      <><br /><span style={{ color:'var(--muted)', fontSize:12 }}>
                        One-time permission expired — you'll be asked again next time.
                      </span></>
                    )}
                    {savedPermission?.type === 'visiting' && (
                      <><br /><span style={{ color:'#6699ff', fontSize:12 }}>
                        Session permission still active — next share skips the prompt.
                      </span></>
                    )}
                  </p>
                  <div className="btn-row" style={{ justifyContent:'center' }}>
                    <Button onClick={handleRetry}>↻ &nbsp;Retry Screen Test</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

            </div>
          </div>

          <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)', textAlign:'center', lineHeight:1.8 }}>
            No recording · No backend · Local preview only &nbsp;|&nbsp; Chrome &amp; Edge supported
          </p>
        </div>
      </div>
    </>
  )
}
