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
    allowWhileVisiting, allowOnce, denyPermission, reattachVideo,
  } = useScreenShare()

  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleBack    = () => { reset(); onNavigate(Route.HOME) }
  const handleRetry   = () => { reset(); setTimeout(() => start(), 50) }
  const handleStopFS  = () => { setIsFullscreen(false); stop() }
  const handleMinimize = () => { setIsFullscreen(false); requestAnimationFrame(() => reattachVideo()) }

  useEffect(() => {
    if (status === PermissionState.GRANTED) requestAnimationFrame(() => reattachVideo())
  }, [status, reattachVideo])

  const is = s => status === s
  const P  = PermissionState

  const permBadge = permissionType === 'visiting'
    ? { label: '🕒 Session permission', cls: 'bg-accent2/10 text-[#6699ff] border border-accent2/30' }
    : permissionType === 'once'
    ? { label: '✅ One-time permission', cls: 'bg-accent/8 text-accent border border-accent/25' }
    : null

  return (
    <>
      {permissionStage === 'prompting' && (
        <PermissionPrompt onAllowVisiting={allowWhileVisiting} onAllowOnce={allowOnce} onDeny={denyPermission} />
      )}

      {isFullscreen && is(P.GRANTED) && (
        <FullscreenOverlay stream={streamRef.current} trackInfo={trackInfo} onMinimize={handleMinimize} onStop={handleStopFS} />
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-[900px] w-full">

          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-2 font-mono text-xs text-muted mb-2.5">
              <span className="cursor-pointer hover:text-white transition-colors" onClick={handleBack}>Home</span>
              <span className="text-border">/</span>
              <span>Screen Test</span>
            </div>
            <h1 className="font-display font-extrabold text-[clamp(20px,4vw,28px)] tracking-tight text-white">
              Screen Share Diagnostics
            </h1>
          </div>

          <Steps status={status} />

          {/* Status Panel */}
          <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-5">

            {/* Panel header */}
            <div className="px-5 py-3.5 border-b border-border bg-surface2 flex items-center gap-2.5 font-mono text-xs text-muted uppercase tracking-widest flex-wrap">
              <StatusDot status={status} />
              <span>Stream Status</span>

              {permBadge && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ml-1 ${permBadge.cls}`}>
                  {permBadge.label}
                </span>
              )}
              {savedPermission?.type === 'visiting' && !is(P.GRANTED) && (
                <button onClick={revokePermission} className="font-mono text-[11px] text-muted underline hover:text-warn transition-colors bg-transparent border-none cursor-pointer ml-1">
                  revoke
                </button>
              )}
              <span className="ml-auto">{new Date().toLocaleTimeString()}</span>
            </div>

            {/* Panel body */}
            <div className="p-7">

              {/* IDLE */}
              {is(P.IDLE) && permissionStage === 'idle' && (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-2.5 mb-4">
                    <StatusDot status={status} />
                    <span className="font-semibold text-[17px] text-muted">Ready to Start</span>
                  </div>
                  <p className="font-mono text-sm text-muted mb-6">
                    {savedPermission?.type === 'visiting'
                      ? 'Session permission active — screen picker will open directly.'
                      : 'Click below — a permission dialog will appear first, then the OS screen picker.'}
                  </p>
                  <Button onClick={start}>▶ &nbsp;Request Screen Share</Button>
                </div>
              )}

              {/* REQUESTING */}
              {is(P.REQUESTING) && (
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-full border-[3px] border-border border-t-accent2 animate-spin-ring mx-auto mb-5" />
                  <div className="flex items-center justify-center gap-2.5 mb-3">
                    <StatusDot status={status} />
                    <span className="font-semibold text-[17px] text-white">Opening Screen Picker…</span>
                  </div>
                  <p className="font-mono text-sm text-muted">Select a screen, window, or tab from the browser picker.</p>
                </div>
              )}

              {/* GRANTED */}
              {is(P.GRANTED) && (
                <>
                  <div className="flex items-center gap-2.5 mb-5">
                    <StatusDot status={status} />
                    <span className="font-semibold text-[17px] text-accent">Screen Stream Active</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-5">
                    <div>
                      <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-border">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain block" />
                        <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm border border-accent/40 rounded-md px-2.5 py-1 font-mono text-[11px] text-accent flex items-center gap-1.5 tracking-wider">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-fast" /> LIVE
                        </div>
                        <button
                          onClick={() => setIsFullscreen(true)}
                          className="absolute top-2.5 right-2.5 w-[34px] h-[34px] bg-black/65 backdrop-blur-md border border-accent2/50 rounded-lg text-[#6699ff] flex items-center justify-center text-[15px] hover:bg-accent2/20 hover:scale-105 transition-all cursor-pointer"
                          title="Fullscreen"
                        >⛶</button>
                      </div>
                      <div className="flex gap-2.5 flex-wrap mt-3">
                        <Button onClick={() => setIsFullscreen(true)}>⛶ &nbsp;Fullscreen</Button>
                        <Button variant="danger" onClick={stop}>⏹ &nbsp;Stop Sharing</Button>
                        <Button variant="secondary" onClick={handleBack}>← Home</Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
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
                <div>
                  <div className="font-mono text-xs text-muted mb-2 tracking-wider">ERROR · NotAllowedError · USER_CANCELLED</div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <StatusDot status={status} />
                    <span className="font-semibold text-[17px] text-warn2">Screen Picker Cancelled</span>
                  </div>
                  <p className="font-mono text-sm text-muted mb-5">You dismissed the screen selector without choosing a source.</p>
                  <div className="flex gap-2.5 flex-wrap">
                    <Button onClick={start}>↻ &nbsp;Try Again</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

              {/* DENIED */}
              {is(P.DENIED) && (
                <div>
                  <div className="font-mono text-xs text-muted mb-2 tracking-wider">ERROR · NotAllowedError · PERMISSION_DENIED</div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <StatusDot status={status} />
                    <span className="font-semibold text-[17px] text-warn">Permission Denied</span>
                  </div>
                  <p className="font-mono text-sm text-muted mb-4">Blocked by "Don't Allow" or OS/browser security settings.</p>
                  <div className="bg-surface2 border border-border rounded-xl p-4 mb-5">
                    <div className="font-mono text-[11px] text-muted mb-2.5 tracking-wider uppercase">How to Fix</div>
                    <div className="font-mono text-xs text-white leading-loose">
                      <div>🔒 <strong>Chrome/Edge:</strong> Lock icon → Site settings → Screen capture → Allow</div>
                      <div>🍎 <strong>macOS:</strong> System Settings → Privacy → Screen Recording → Enable browser</div>
                      <div>🪟 <strong>Windows:</strong> Settings → Privacy → Screen capture → Allow</div>
                    </div>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    <Button onClick={start}>↻ &nbsp;Try Again</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {is(P.ERROR) && (
                <div>
                  <div className="font-mono text-xs text-muted mb-2 tracking-wider">ERROR · UNKNOWN</div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <StatusDot status={status} />
                    <span className="font-semibold text-[17px] text-warn">Unexpected Error</span>
                  </div>
                  <p className="font-mono text-sm text-muted mb-3">An unexpected error occurred initialising the media stream.</p>
                  {error && <div className="font-mono text-sm text-muted bg-surface2 p-3 rounded-lg mb-5 break-words">⚠ {error}</div>}
                  <div className="flex gap-2.5 flex-wrap">
                    <Button onClick={start}>↻ &nbsp;Retry</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

              {/* STOPPED */}
              {is(P.STOPPED) && (
                <div className="text-center py-2">
                  <div className="text-[40px] mb-4">⏹</div>
                  <div className="flex items-center justify-center gap-2.5 mb-3">
                    <StatusDot status={status} />
                    <span className="font-semibold text-[17px] text-warn2">Screen Sharing Stopped</span>
                  </div>
                  <p className="font-mono text-sm text-muted leading-relaxed mb-6">
                    All media tracks released and stream cleaned up.
                    {permissionType === 'once' && (
                      <><br /><span className="text-muted text-xs">One-time permission expired — you'll be asked again next time.</span></>
                    )}
                    {savedPermission?.type === 'visiting' && (
                      <><br /><span className="text-[#6699ff] text-xs">Session permission still active — next share skips the prompt.</span></>
                    )}
                  </p>
                  <div className="flex gap-2.5 flex-wrap justify-center">
                    <Button onClick={handleRetry}>↻ &nbsp;Retry Screen Test</Button>
                    <Button variant="secondary" onClick={handleBack}>← Back to Home</Button>
                  </div>
                </div>
              )}

            </div>
          </div>

          <p className="font-mono text-[11px] text-muted text-center leading-loose">
            No recording · No backend · Local preview only &nbsp;|&nbsp; Chrome &amp; Edge supported
          </p>
        </div>
      </div>
    </>
  )
}