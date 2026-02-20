// import { useState, useRef, useCallback, useEffect } from 'react'
// import { PermissionState } from '../constants.js'

// const PERM_SESSION_KEY = 'screen_share_permission'

// function getDisplayMediaFn() {
//   if (navigator.mediaDevices?.getDisplayMedia) {
//     return navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices)
//   }
//   if (navigator.getDisplayMedia) {
//     return navigator.getDisplayMedia.bind(navigator)
//   }
//   return null
// }

// function getSavedPermission() {
//   try {
//     const val = sessionStorage.getItem(PERM_SESSION_KEY)
//     return val ? JSON.parse(val) : null
//   } catch { return null }
// }

// function savePermission(type) {
//   try {
//     sessionStorage.setItem(PERM_SESSION_KEY, JSON.stringify({ type, grantedAt: Date.now() }))
//   } catch {}
// }

// function clearPermission() {
//   try { sessionStorage.removeItem(PERM_SESSION_KEY) } catch {}
// }

// export function useScreenShare() {
//   const [status, setStatus] = useState(PermissionState.IDLE)
//   const [permissionStage, setPermissionStage] = useState('idle')
//   const [permissionType, setPermissionType] = useState(null)
//   const [error, setError] = useState(null)
//   const [trackInfo, setTrackInfo] = useState(null)
//   const streamRef = useRef(null)
//   const videoRef = useRef(null)

//   const cleanup = useCallback(() => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((t) => t.stop())
//       streamRef.current = null
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null
//     }
//     setTrackInfo(null)
//   }, [])

//   // KEY FIX: Call this after minimizing from fullscreen to reconnect main video element
//   const reattachVideo = useCallback(() => {
//     if (videoRef.current && streamRef.current) {
//       videoRef.current.srcObject = streamRef.current
//       videoRef.current.play().catch(() => {})
//     }
//   }, [])

//   const doCapture = useCallback(async (chosenType) => {
//     setPermissionStage('granted')
//     setStatus(PermissionState.REQUESTING)
//     setError(null)

//     const getDisplayMedia = getDisplayMediaFn()
//     if (!getDisplayMedia) {
//       setStatus(PermissionState.ERROR)
//       setError('Screen capture (getDisplayMedia) is not supported in this browser. Please use Chrome or Edge.')
//       setPermissionStage('denied')
//       return
//     }

//     const isLegacyEdge = /Edge\/\d/.test(navigator.userAgent)
//     const constraints = isLegacyEdge
//       ? { video: true, audio: false }
//       : { video: { frameRate: { ideal: 30 } }, audio: false }

//     try {
//       const stream = await getDisplayMedia(constraints)
//       streamRef.current = stream

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//       }

//       const track = stream.getVideoTracks()[0]
//       const settings = track.getSettings ? track.getSettings() : {}
//       const displaySurfaceMap = { browser: 'Tab', window: 'Window', monitor: 'Entire Screen' }

//       setTrackInfo({
//         width: settings.width || '—',
//         height: settings.height || '—',
//         frameRate: settings.frameRate ? Math.round(settings.frameRate) : '—',
//         displaySurface: displaySurfaceMap[settings.displaySurface] || 'Unknown',
//         label: track.label || 'Screen',
//       })

//       if (chosenType === 'visiting') savePermission('visiting')

//       setPermissionType(chosenType)
//       setStatus(PermissionState.GRANTED)

//       track.onended = () => {
//         cleanup()
//         if (chosenType === 'once') { clearPermission(); setPermissionType(null) }
//         setStatus(PermissionState.STOPPED)
//         setPermissionStage('idle')
//       }
//     } catch (err) {
//       cleanup()
//       if (err.name === 'NotAllowedError') {
//         const msg = (err.message || '').toLowerCase()
//         if (msg.includes('permission denied by system') || msg.includes('denied by')) {
//           setStatus(PermissionState.DENIED); setPermissionStage('denied')
//         } else {
//           setStatus(PermissionState.CANCELLED); setPermissionStage('idle')
//         }
//       } else if (err.name === 'NotFoundError') {
//         setStatus(PermissionState.ERROR)
//         setError('No screen capture source found. Make sure a display is connected.')
//         setPermissionStage('idle')
//       } else if (err.name === 'AbortError') {
//         setStatus(PermissionState.CANCELLED); setPermissionStage('idle')
//       } else {
//         setStatus(PermissionState.ERROR)
//         setError(err.message || 'An unknown error occurred.')
//         setPermissionStage('idle')
//       }
//     }
//   }, [cleanup])

//   const allowWhileVisiting = useCallback(() => doCapture('visiting'), [doCapture])
//   const allowOnce = useCallback(() => doCapture('once'), [doCapture])

//   const start = useCallback(() => {
//     cleanup()
//     setStatus(PermissionState.IDLE)
//     const saved = getSavedPermission()
//     if (saved?.type === 'visiting') {
//       doCapture('visiting')
//     } else {
//       setPermissionStage('prompting')
//     }
//   }, [cleanup, doCapture])

//   const denyPermission = useCallback(() => {
//     clearPermission(); setPermissionType(null)
//     setPermissionStage('denied'); setStatus(PermissionState.DENIED)
//   }, [])

//   const stop = useCallback(() => {
//     cleanup(); setStatus(PermissionState.STOPPED); setPermissionStage('idle')
//   }, [cleanup])

//   const reset = useCallback(() => {
//     cleanup(); setStatus(PermissionState.IDLE)
//     setPermissionStage('idle'); setPermissionType(null); setError(null)
//   }, [cleanup])

//   const revokePermission = useCallback(() => { clearPermission(); reset() }, [reset])

//   useEffect(() => () => cleanup(), [cleanup])

//   return {
//     status, permissionStage, permissionType,
//     savedPermission: getSavedPermission(),
//     error, trackInfo, videoRef, streamRef,
//     start, stop, reset, revokePermission,
//     allowWhileVisiting, allowOnce, denyPermission,
//     reattachVideo,   // ← new: reconnects main <video> after minimize
//     isSupported: !!getDisplayMediaFn(),
//   }
// }

import { useState, useRef, useCallback, useEffect } from 'react'
import { PermissionState } from '../constants.js'

const PERM_KEY = 'sst_permission'

function getDisplayMediaFn() {
  if (navigator.mediaDevices?.getDisplayMedia)
    return navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices)
  if (navigator.getDisplayMedia)
    return navigator.getDisplayMedia.bind(navigator)
  return null
}

function getSaved() {
  try { return JSON.parse(sessionStorage.getItem(PERM_KEY)) } catch { return null }
}
function savePerm(type) {
  try { sessionStorage.setItem(PERM_KEY, JSON.stringify({ type, at: Date.now() })) } catch {}
}
function clearPerm() {
  try { sessionStorage.removeItem(PERM_KEY) } catch {}
}

export function useScreenShare() {
  const [status, setStatus]             = useState(PermissionState.IDLE)
  const [permissionStage, setStage]     = useState('idle') // idle|prompting|granted|denied
  const [permissionType, setPermType]   = useState(null)   // null|'visiting'|'once'
  const [error, setError]               = useState(null)
  const [trackInfo, setTrackInfo]       = useState(null)

  const streamRef = useRef(null)
  const videoRef  = useRef(null)   // main page <video>

  /* ── cleanup ── */
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setTrackInfo(null)
  }, [])

  /* ── reattach main video after minimize ── */
  const reattachVideo = useCallback(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [])

  /* ── core capture ── */
  const doCapture = useCallback(async (chosenType) => {
    setStage('granted')
    setStatus(PermissionState.REQUESTING)
    setError(null)

    const fn = getDisplayMediaFn()
    if (!fn) {
      setStatus(PermissionState.ERROR)
      setError('getDisplayMedia not supported. Use Chrome or Edge.')
      setStage('denied')
      return
    }

    const isLegacyEdge = /Edge\/\d/.test(navigator.userAgent)
    const constraints  = isLegacyEdge
      ? { video: true, audio: false }
      : { video: { frameRate: { ideal: 30 } }, audio: false }

    try {
      const stream = await fn(constraints)
      streamRef.current = stream

      /* attach to main video immediately — fixes blank-on-start bug */
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
      }

      const track    = stream.getVideoTracks()[0]
      const settings = track.getSettings ? track.getSettings() : {}
      const surfMap  = { browser: 'Tab', window: 'Window', monitor: 'Entire Screen' }

      setTrackInfo({
        width:          settings.width          || '—',
        height:         settings.height         || '—',
        frameRate:      settings.frameRate ? Math.round(settings.frameRate) : '—',
        displaySurface: surfMap[settings.displaySurface] || 'Unknown',
        label:          track.label             || 'Screen',
      })

      /* save permission */
      if (chosenType === 'visiting') savePerm('visiting')
      // 'once' → nothing saved — next request will show prompt again

      setPermType(chosenType)
      setStatus(PermissionState.GRANTED)

      track.onended = () => {
        cleanup()
        if (chosenType === 'once') { clearPerm(); setPermType(null) }
        setStatus(PermissionState.STOPPED)
        setStage('idle')
      }
    } catch (err) {
      cleanup()
      if (err.name === 'NotAllowedError') {
        const msg = (err.message || '').toLowerCase()
        if (msg.includes('permission denied by system') || msg.includes('denied by')) {
          setStatus(PermissionState.DENIED); setStage('denied')
        } else {
          setStatus(PermissionState.CANCELLED); setStage('idle')
        }
      } else if (err.name === 'NotFoundError') {
        setStatus(PermissionState.ERROR)
        setError('No capture source found.')
        setStage('idle')
      } else if (err.name === 'AbortError') {
        setStatus(PermissionState.CANCELLED); setStage('idle')
      } else {
        setStatus(PermissionState.ERROR)
        setError(err.message || 'Unknown error.')
        setStage('idle')
      }
    }
  }, [cleanup])

  /* ── public actions ── */
  const allowWhileVisiting = useCallback(() => doCapture('visiting'), [doCapture])
  const allowOnce          = useCallback(() => doCapture('once'),     [doCapture])

  const start = useCallback(() => {
    cleanup()
    setStatus(PermissionState.IDLE)
    const saved = getSaved()
    if (saved?.type === 'visiting') {
      // Session permission active → skip prompt, go straight to OS picker
      doCapture('visiting')
    } else {
      setStage('prompting')
    }
  }, [cleanup, doCapture])

  const denyPermission = useCallback(() => {
    clearPerm(); setPermType(null)
    setStage('denied'); setStatus(PermissionState.DENIED)
  }, [])

  const stop = useCallback(() => {
    cleanup(); setStatus(PermissionState.STOPPED); setStage('idle')
  }, [cleanup])

  const reset = useCallback(() => {
    cleanup()
    setStatus(PermissionState.IDLE); setStage('idle')
    setPermType(null); setError(null)
  }, [cleanup])

  const revokePermission = useCallback(() => { clearPerm(); reset() }, [reset])

  useEffect(() => () => cleanup(), [cleanup])

  return {
    status, permissionStage, permissionType,
    savedPermission: getSaved(),
    error, trackInfo, videoRef, streamRef,
    start, stop, reset, revokePermission,
    allowWhileVisiting, allowOnce, denyPermission,
    reattachVideo,
    isSupported: !!getDisplayMediaFn(),
  }
}