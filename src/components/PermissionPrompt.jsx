import { useState } from 'react'

export default function PermissionPrompt({ onAllowVisiting, onAllowOnce, onDeny }) {
  const [selected, setSelected] = useState('visiting')
  const site = window.location.hostname || 'https://screen-sharing-test-app.vercel.app/'

  const handleAllow = () => selected === 'visiting' ? onAllowVisiting() : onAllowOnce()

  const optionCls = (val) =>
    `flex items-start gap-3 rounded-xl p-3.5 border-2 cursor-pointer transition-all
     ${selected === val
       ? 'border-accent2 bg-accent2/5'
       : 'border-border bg-surface2 hover:border-[#444] hover:bg-[#1e1e24]'}`

  const radioCls = (val) =>
    `w-[18px] h-[18px] mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
     ${selected === val ? 'border-accent2' : 'border-muted'}`

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in">
      <div className="bg-[#1c1c20] border border-[#38383f] rounded-[18px] w-full max-w-[450px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.7)] animate-slide-up">

        {/* Fake browser bar */}
        <div className="bg-[#111113] border-b border-border px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
            <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
            <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 bg-[#1e1e22] border border-[#2e2e36] rounded-md py-1 px-3 font-mono text-xs text-muted text-center flex items-center justify-center gap-1.5">
            <span className="text-green-500 text-[11px]">🔒</span>{site}
          </div>
        </div>

        {/* Body */}
        <div className="px-7 pt-7 pb-6 text-center">
          <span className="text-[42px] mb-3 block">🖥️</span>
          <div className="font-mono text-sm text-accent2 font-semibold mb-1">{site}</div>
          <div className="text-[18px] font-bold mb-2.5 text-white">wants to share your screen</div>
          <p className="font-mono text-xs text-muted leading-relaxed mb-4">
            This site is requesting access to capture your screen.
            You will choose which screen, window, or tab to share.
          </p>

          {/* Warning */}
          <div className="bg-orange-500/7 border border-orange-500/20 rounded-xl px-3.5 py-2.5 font-mono text-xs text-orange-400 flex items-start gap-2 text-left mb-5">
            <span className="text-sm flex-shrink-0 mt-px">⚠</span>
            <span>Only share with sites you trust. The site can see everything on the shared surface.</span>
          </div>

          {/* Selectable Options */}
          <div className="flex flex-col gap-2 mb-4 text-left">

            {/* Allow while visiting */}
            <div
              className={optionCls('visiting')}
              onClick={() => setSelected('visiting')}
              role="radio" aria-checked={selected === 'visiting'} tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected('visiting')}
            >
              <div className={radioCls('visiting')}>
                {selected === 'visiting' && (
                  <div className="w-2 h-2 rounded-full bg-accent2 animate-radio-pop" />
                )}
              </div>
              <span className="text-xl flex-shrink-0">🕒</span>
              <div>
                <div className="text-[13px] font-semibold text-white mb-1">Allow while visiting this site</div>
                <div className="font-mono text-[11px] text-muted leading-relaxed">
                  Permission stays active for this entire browser session.
                  Closes automatically when you close this tab.
                  <span className="inline-block ml-1.5 mt-1 bg-accent2/10 text-[#6699ff] border border-accent2/25 rounded px-1.5 py-px text-[10px] font-semibold tracking-wide align-middle">
                    Remembered this session
                  </span>
                </div>
              </div>
            </div>

            {/* Allow this time */}
            <div
              className={optionCls('once')}
              onClick={() => setSelected('once')}
              role="radio" aria-checked={selected === 'once'} tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected('once')}
            >
              <div className={radioCls('once')}>
                {selected === 'once' && (
                  <div className="w-2 h-2 rounded-full bg-accent2 animate-radio-pop" />
                )}
              </div>
              <span className="text-xl flex-shrink-0">✅</span>
              <div>
                <div className="text-[13px] font-semibold text-white mb-1">Allow this time</div>
                <div className="font-mono text-[11px] text-muted leading-relaxed">
                  One-time access only. Permission expires the moment screen sharing stops.
                  <span className="inline-block ml-1.5 mt-1 bg-accent/8 text-accent border border-accent/20 rounded px-1.5 py-px text-[10px] font-semibold tracking-wide align-middle">
                    One-time only
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Dynamic hint */}
          <div className={`font-mono text-[11px] text-muted px-3 py-2.5 rounded-lg text-left mb-4 leading-relaxed border-l-[3px] ${
            selected === 'once' ? 'bg-accent/4 border-accent' : 'bg-accent2/5 border-accent2'
          }`}>
            {selected === 'visiting'
              ? '🔵  This tab will remember your choice. Retry without a prompt until you close the tab or revoke access.'
              : '⚪  Permission disappears as soon as sharing stops. You will see this dialog again next time.'}
          </div>

          <hr className="border-border mb-4" />

          <div className="flex gap-2.5 justify-end">
            <button
              onClick={onDeny}
              className="px-5 py-2.5 rounded-xl font-display font-bold text-sm bg-surface2 text-white border border-border hover:bg-[#252529] transition-all cursor-pointer"
            >
              Don't Allow
            </button>
            <button
              onClick={handleAllow}
              className="px-5 py-2.5 rounded-xl font-display font-bold text-sm bg-accent2 text-white shadow-[0_2px_12px_rgba(0,102,255,0.3)] hover:bg-[#0055dd] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,102,255,0.4)] transition-all cursor-pointer"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}