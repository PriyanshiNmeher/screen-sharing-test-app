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
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-[480px] w-full text-center">

        <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#001a33] to-[#003366] border border-accent2 flex items-center justify-center mx-auto mb-8 text-[32px] shadow-[0_0_40px_rgba(0,102,255,0.15)]">
          🖥️
        </div>

        <h1 className="font-display font-extrabold text-[clamp(28px,6vw,42px)] leading-tight tracking-tight mb-4 text-white">
          Screen Share<br />
          <span className="text-accent">Test App</span>
        </h1>

        <p className="font-mono font-light text-[15px] text-muted leading-relaxed mb-10">
          Real-time screen capture diagnostics.<br />
          Permission validation · Stream lifecycle · Metadata inspection.
        </p>

        {unsupported ? (
          <div className="bg-warn/8 border border-warn/30 text-warn px-5 py-4 rounded-xl font-mono text-sm leading-relaxed text-left">
            <strong className="block mb-1.5 text-[14px]">⚠ Browser Unsupported</strong>
            Your browser does not support{' '}
            <code className="bg-black/30 px-1 rounded">navigator.mediaDevices.getDisplayMedia</code>.
            <br />Please use Chrome or Edge on a desktop device.
          </div>
        ) : (
          <Button onClick={handleStart}>▶ &nbsp;Start Screen Test</Button>
        )}
      </div>
    </div>
  )
}