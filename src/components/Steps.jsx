import { PermissionState } from '../constants.js'

export default function Steps({ status }) {
  const step1Active = status === PermissionState.REQUESTING
  const step1Done = [PermissionState.GRANTED, PermissionState.STOPPED].includes(status)
  const step1Error = [PermissionState.CANCELLED, PermissionState.DENIED, PermissionState.ERROR].includes(status)
  const step2Active = status === PermissionState.GRANTED
  const step2Done = status === PermissionState.STOPPED
  const step3Active = status === PermissionState.STOPPED

  return (
    <div className="steps">
      <div className={`step ${step1Error ? 'error' : step1Done ? 'done' : step1Active ? 'active' : ''}`}>
        <div className="step-num">{step1Error ? '✕' : step1Done ? '✓' : '1'}</div>
        <span className="step-label">Permission</span>
      </div>
      <div className={`step ${step2Done ? 'done' : step2Active ? 'active' : ''}`}>
        <div className="step-num">{step2Done ? '✓' : '2'}</div>
        <span className="step-label">Preview</span>
      </div>
      <div className={`step ${step3Active ? 'active' : ''}`}>
        <div className="step-num">{step3Active ? '✓' : '3'}</div>
        <span className="step-label">Lifecycle</span>
      </div>
    </div>
  )
}