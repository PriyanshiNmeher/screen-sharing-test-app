
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
  const [permissionStage, setStage]     = useState('idle')
  const [permissionType, setPermType]   = useState(null) 
  const [error, setError]               = useState(null)
  const [trackInfo, setTrackInfo]       = useState(null)

  const streamRef = useRef(null)
  const videoRef  = useRef(null) 
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setTrackInfo(null)
  }, [])

  const reattachVideo = useCallback(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [])

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

      if (chosenType === 'visiting') savePerm('visiting')

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

  const allowWhileVisiting = useCallback(() => doCapture('visiting'), [doCapture])
  const allowOnce          = useCallback(() => doCapture('once'),     [doCapture])

  const start = useCallback(() => {
    cleanup()
    setStatus(PermissionState.IDLE)
    const saved = getSaved()
    if (saved?.type === 'visiting') {
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