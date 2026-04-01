"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useSocket } from '@/src/hooks/useSocket'
import { useViewer } from '@/src/hooks/useWebRTC'
import { useLiveChat } from '@/src/hooks/useLiveChat'
import { useAuthStore } from '@/src/store/useAuthStore'
import LivestreamPlayer from '@/src/components/CreatorProfile/LivestreamPlayer'
import LivestreamComments from '@/src/components/CreatorProfile/LivestreamComments'
import api from '@/src/lib/api'

interface StreamData {
  _id: string
  title: string
  description: string
  thumbnail: string
  status: string
  creatorId: {
    _id: string
    name: string
    avatarUrl: string
  } | null
}

export default function LivestreamViewerPage() {
  const router = useRouter()
  const params = useParams()
  const streamId = params?.id as string
  const user = useAuthStore((s) => s.user)

  const [stream, setStream] = useState<StreamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { socket, isConnected } = useSocket(streamId)
  const { remoteStream, connectionState, viewerCount, streamEnded } = useViewer(socket, streamId, user)
  const { messages, sendMessage } = useLiveChat(socket, streamId, user)

  // Fetch stream details
  useEffect(() => {
    if (!streamId) return
    const fetchStream = async () => {
      try {
        const res = await api.get(`/livestream/${streamId}`)
        setStream(res.data)
        if (res.data.status === 'ended') {
          setError('This stream has ended.')
        }
      } catch {
        setError('Stream not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchStream()
  }, [streamId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error && !stream) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f9f9] gap-4">
        <p className="text-lg font-bold text-slate-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-rose-500 font-bold text-sm hover:underline"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#1c1917] text-sm font-bold border border-slate-200 rounded-full px-4 py-2 hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-black text-[#1c1917] tracking-tight leading-tight">
          {stream?.title || 'Untitled Livestream'}
        </h1>

        {/* Connection status */}
        {!isConnected && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-sm font-medium text-center">
            Connecting to streaming server...
          </div>
        )}

        {/* Video Player */}
        <LivestreamPlayer
          remoteStream={remoteStream}
          viewerCount={viewerCount}
          connectionState={connectionState}
          streamEnded={streamEnded || stream?.status === 'ended'}
          title={stream?.title}
        />

        {/* Description */}
        {stream?.description && (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600 leading-relaxed">{stream.description}</p>
          </div>
        )}

        {/* Live Chat */}
        <LivestreamComments
          messages={messages}
          onSendMessage={sendMessage}
          streamEnded={streamEnded || stream?.status === 'ended'}
        />

      </div>
    </div>
  )
}
