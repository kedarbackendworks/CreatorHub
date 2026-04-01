'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Radio, Users, Calendar, Clock } from 'lucide-react'
import api from '@/src/lib/api'

interface LivestreamItem {
  _id: string
  title: string
  description?: string
  thumbnail: string
  status: 'live' | 'scheduled' | 'ended'
  scheduledTime?: string
  startedAt?: string
  createdAt: string
  peakViewers?: number
  creatorId?: {
    name: string
    avatar: string
    username: string
  }
}

interface LivestreamFeedProps {
  creatorId: string
}

export default function LivestreamFeed({ creatorId }: LivestreamFeedProps) {
  const [streams, setStreams] = useState<LivestreamItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await api.get(`/livestream/creator/${creatorId}`)
        setStreams(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Error fetching livestreams:', err)
      } finally {
        setLoading(false)
      }
    }
    if (creatorId) fetchStreams()
  }, [creatorId])

  if (loading) {
    return <div className="p-10 text-center w-full text-[#9a9a9a]">Loading livestreams...</div>
  }

  if (streams.length === 0) {
    return (
      <div className="col-span-full p-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#f6f4f1] rounded-full flex items-center justify-center">
            <Radio className="w-7 h-7 text-[#9a9a9a]" />
          </div>
          <p className="text-[#9a9a9a] font-medium text-sm">No livestreams yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] w-full max-w-full">
      {streams.map((stream) => (
        <Link
          key={stream._id}
          href={`/livestream/${stream._id}`}
          className="group flex flex-col gap-[12px] items-start shrink-0"
        >
          {/* Thumbnail */}
          <div className="flex flex-col h-[200px] items-start justify-end overflow-hidden p-[12px] relative rounded-[12px] w-full">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none rounded-[12px] flex items-center justify-center bg-[#ebebeb]"
            >
              <Image
                src={stream.thumbnail || '/assets/creator/thumbnail.png'}
                alt={stream.title}
                fill
                className="object-cover rounded-[12px] group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Status badge */}
            {stream.status === 'live' && (
              <div className="bg-[#ef4444] flex gap-[6px] items-center justify-center px-[10px] py-[5px] relative rounded-[32px] shrink-0 backdrop-blur-sm z-10 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <p className="font-semibold text-[11px] text-white tracking-[0.22px] whitespace-nowrap uppercase">
                  Live Now
                </p>
              </div>
            )}

            {stream.status === 'scheduled' && (
              <div className="bg-[rgba(26,26,26,0.6)] flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative rounded-[32px] shrink-0 backdrop-blur-sm z-10">
                <Calendar className="w-3 h-3 text-white" />
                <p className="font-semibold text-[11px] text-white tracking-[0.22px] whitespace-nowrap">
                  Scheduled
                </p>
              </div>
            )}

            {stream.status === 'ended' && (
              <div className="bg-[rgba(26,26,26,0.4)] flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative rounded-[32px] shrink-0 backdrop-blur-sm z-10">
                <Clock className="w-3 h-3 text-white/70" />
                <p className="font-semibold text-[11px] text-white/70 tracking-[0.22px] whitespace-nowrap">
                  Ended
                </p>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-[4px] items-start justify-end w-full">
            <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[#3a3a3a] text-[13px] tracking-[0.26px] whitespace-nowrap truncate w-full group-hover:text-[#1a1a1a]">
              {stream.title}
            </p>

            <div className="flex gap-[10px] items-center text-[#9a9a9a] flex-wrap">
              <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px] whitespace-nowrap">
                {new Date(stream.scheduledTime || stream.createdAt).toLocaleDateString()}
              </p>

              {stream.peakViewers !== undefined && stream.peakViewers > 0 && (
                <div className="flex gap-[4px] items-center">
                  <Users className="w-[14px] h-[14px]" />
                  <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px]">
                    {stream.peakViewers}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
