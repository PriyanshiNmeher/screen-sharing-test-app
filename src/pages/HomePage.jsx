import { useState } from 'react'
import Button from '../components/Button.jsx'
import { Route } from '../constants.js'

export default function HomePage({ onNavigate }) {
  const [unsupported, setUnsupported] = useState(false)

  const handleStart = () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setUnsupported(true)
      return
    }
    onNavigate(Route.SCREEN_TEST)
  }

  return (
    <div className="page">
      <div className="home-wrap">
        <div className="home-icon">🖥️</div>

        <h1 className="home-title">
          Screen Share<br />
          <span>Test App</span>
        </h1>

        <p className="home-desc">
          Real-time screen capture diagnostics.<br />
          Permission validation · Stream lifecycle · Metadata inspection.
        </p>

        {unsupported ? (
          <div className="unsupported-badge">
            <strong>⚠ Browser Unsupported</strong>
            Your browser does not support{' '}
            <code>navigator.mediaDevices.getDisplayMedia</code>.<br />
            Please use Chrome or Edge on a desktop device.
          </div>
        ) : (
          <Button onClick={handleStart}>▶ &nbsp;Start Screen Test</Button>
        )}
      </div>
    </div>
  )
}