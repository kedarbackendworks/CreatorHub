'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Users, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

interface LivestreamPlayerProps {
  remoteStream: MediaStream | null
  viewerCount: number
  connectionState: string
  streamEnded: boolean
  title?: string
}

export default function LivestreamPlayer({
  remoteStream,
  viewerCount,
  connectionState,
  streamEnded,
  title,
}: LivestreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showControls, setShowControls] = useState(true)

  // Bind remote stream to video element
  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream
      videoRef.current.play().catch(() => {})
    }
  }, [remoteStream])

  // Elapsed time counter
  useEffect(() => {
    if (!remoteStream || streamEnded) return
    const interval = setInterval(() => setElapsedTime((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [remoteStream, streamEnded])

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const show = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    const container = containerRef.current
    container?.addEventListener('mousemove', show)
    container?.addEventListener('touchstart', show)
    return () => {
      container?.removeEventListener('mousemove', show)
      container?.removeEventListener('touchstart', show)
      clearTimeout(timeout)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Connection state labels
  const getStatusOverlay = () => {
    if (streamEnded) {
      return (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 rounded-[32px]">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
            <Play className="w-10 h-10 text-white/60" />
          </div>
          <p className="text-white text-2xl font-black mb-2">Stream Ended</p>
          <p className="text-white/50 font-medium">This livestream has ended. Thank you for watching!</p>
        </div>
      )
    }
    if (connectionState === 'new' || connectionState === 'connecting') {
      return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 rounded-[32px]">
          <div className="w-16 h-16 border-4 border-white/20 border-t-rose-500 rounded-full animate-spin mb-6"></div>
          <p className="text-white text-lg font-bold">Connecting to stream...</p>
          <p className="text-white/40 font-medium text-sm mt-1">Please wait while we establish the connection</p>
        </div>
      )
    }
    if (!remoteStream && !streamEnded) {
      return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 rounded-[32px]">
          <div className="w-16 h-16 border-4 border-white/20 border-t-rose-500 rounded-full animate-spin mb-6"></div>
          <p className="text-white text-lg font-bold">Waiting for stream...</p>
          <p className="text-white/40 font-medium text-sm mt-1">The creator is setting up their broadcast</p>
        </div>
      )
    }
    return null
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1a] rounded-[32px] overflow-hidden shadow-2xl relative aspect-video group cursor-pointer"
      onClick={handlePlayPause}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover bg-black"
      />

      {/* Status overlay */}
      {getStatusOverlay()}

      {/* Top overlay: viewer count + LIVE badge */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-white/80" />
            <span className="text-white font-bold text-sm">Viewers</span>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2">
            <span className="text-white font-black text-sm">{viewerCount.toLocaleString()}</span>
          </div>
        </div>

        {!streamEnded && remoteStream && (
          <div className="bg-rose-500 text-white px-4 py-2 rounded-lg text-xs font-black shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> Live
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar (purely cosmetic for live — shows elapsed time indicator) */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 relative overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }}></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-rose-400 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleMute}
              className="text-white hover:text-rose-400 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
            <span className="text-white/80 text-sm font-bold">{formatTime(elapsedTime)}</span>
          </div>

          <button
            onClick={handleFullscreen}
            className="text-white hover:text-rose-400 transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="w-6 h-6" />
            ) : (
              <Maximize className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
