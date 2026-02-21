import { PermissionState } from '../constants.js'

export default function Steps({ status }) {
  const s1Active = status === PermissionState.REQUESTING
  const s1Done   = [PermissionState.GRANTED, PermissionState.STOPPED].includes(status)
  const s1Error  = [PermissionState.CANCELLED, PermissionState.DENIED, PermissionState.ERROR].includes(status)
  const s2Active = status === PermissionState.GRANTED
  const s2Done   = status === PermissionState.STOPPED
  const s3Active = status === PermissionState.STOPPED

  const stepCls = (active, done, error) =>
    `flex-1 flex items-center gap-2 px-4 py-3 font-mono text-[11px] tracking-wider
     border-r border-border last:border-r-0 transition-all
     ${error  ? 'text-warn bg-warn/5'
     : done   ? 'text-muted'
     : active ? 'text-accent bg-accent/5'
     :          'text-muted'}`

  const numCls = (active, done, error) =>
    `w-[18px] h-[18px] rounded-full border flex items-center justify-center text-[10px] flex-shrink-0
     ${done   ? 'bg-muted border-muted text-black'
     : active ? 'bg-accent border-accent text-black'
     : error  ? 'border-current text-current'
     :          'border-current text-current'}`

  return (
    <div className="flex mb-5 border border-border rounded-xl overflow-hidden bg-surface">
      <div className={stepCls(s1Active, s1Done, s1Error)}>
        <div className={numCls(s1Active, s1Done, s1Error)}>{s1Error ? '✕' : s1Done ? '✓' : '1'}</div>
        <span className="hidden sm:inline">Permission</span>
      </div>
      <div className={stepCls(s2Active, s2Done, false)}>
        <div className={numCls(s2Active, s2Done, false)}>{s2Done ? '✓' : '2'}</div>
        <span className="hidden sm:inline">Preview</span>
      </div>
      <div className={stepCls(s3Active, false, false)}>
        <div className={numCls(s3Active, false, false)}>{s3Active ? '✓' : '3'}</div>
        <span className="hidden sm:inline">Lifecycle</span>
      </div>
    </div>
  )
}