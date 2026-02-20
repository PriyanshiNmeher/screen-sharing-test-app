
import { useState } from 'react'

export default function PermissionPrompt({ onAllowVisiting, onAllowOnce, onDeny }) {
  const [selected, setSelected] = useState('visiting')
  const site = window.location.hostname || 'localhost'

  const handleAllow = () => {
    if (selected === 'visiting') onAllowVisiting()
    else onAllowOnce()
  }

  return (
    <div className="perm-overlay">
      <div className="perm-dialog">

        <div className="perm-browser-bar">
          <div className="perm-browser-dots"><span /><span /><span /></div>
          <div className="perm-browser-url">
            <span className="perm-lock">🔒</span>{site}
          </div>
        </div>

        <div className="perm-body">
          <span className="perm-site-icon">🖥️</span>
          <div className="perm-site">{site}</div>
          <div className="perm-title">wants to share your screen</div>
          <p className="perm-desc">
            This site is requesting access to capture your screen.
            You will choose which screen, window, or tab to share.
          </p>

          <div className="perm-warning">
            <span className="perm-warn-icon">⚠</span>
            <span>Only share with sites you trust. The site can see everything on the shared surface.</span>
          </div>

          <div className="perm-options">

            <div
              className={`perm-option perm-option-selectable${selected === 'visiting' ? ' perm-option-selected' : ''}`}
              onClick={() => setSelected('visiting')}
              role="radio" aria-checked={selected === 'visiting'} tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected('visiting')}
            >
              <div className="perm-radio">
                <div className="perm-radio-inner" />
              </div>
              <div className="perm-option-icon">🕒</div>
              <div>
                <div className="perm-option-title">Allow while visiting this site</div>
                <div className="perm-option-desc">
                  Permission stays active for this entire browser session.
                  Closes automatically when you close this tab.
                  <span className="perm-option-tag">Remembered this session</span>
                </div>
              </div>
            </div>

            <div
              className={`perm-option perm-option-selectable${selected === 'once' ? ' perm-option-selected' : ''}`}
              onClick={() => setSelected('once')}
              role="radio" aria-checked={selected === 'once'} tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected('once')}
            >
              <div className="perm-radio">
                <div className="perm-radio-inner" />
              </div>
              <div className="perm-option-icon">✅</div>
              <div>
                <div className="perm-option-title">Allow this time</div>
                <div className="perm-option-desc">
                  One-time access only. Permission expires the moment
                  screen sharing stops. Next share will ask again.
                  <span className="perm-option-tag perm-option-tag-once">One-time only</span>
                </div>
              </div>
            </div>

          </div>

          <div className={`perm-hint${selected === 'once' ? ' perm-hint-once' : ''}`}>
            {selected === 'visiting'
              ? '🔵  This tab will remember your choice. Retry without a prompt until you close the tab or revoke access.'
              : '⚪  Permission disappears as soon as sharing stops. You will see this dialog again next time.'}
          </div>

          <hr className="perm-divider" />

          <div className="perm-actions">
            <button className="perm-btn perm-btn-deny" onClick={onDeny}>Don't Allow</button>
            <button className="perm-btn perm-btn-allow" onClick={handleAllow}>Allow</button>
          </div>
        </div>
      </div>
    </div>
  )
}
