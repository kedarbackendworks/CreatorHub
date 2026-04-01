'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Socket } from 'socket.io-client';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BROADCASTER HOOK — Used by the creator to publish their camera/mic
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function useBroadcaster(socket: Socket | null, streamId: string | null) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // Start broadcasting: capture camera/mic, emit create_stream
  const startBroadcast = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      setLocalStream(stream);
      localStreamRef.current = stream;

      if (socket && streamId) {
        socket.emit('create_stream', { streamId });
        setIsLive(true);
      }
    } catch (err) {
      console.error('[Broadcast] Failed to get media:', err);
      throw err;
    }
  }, [socket, streamId]);

  // Stop broadcasting: tear down everything
  const stopBroadcast = useCallback(() => {
    // Stop all tracks
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    localStreamRef.current = null;

    // Close all peer connections
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();

    // Notify server
    if (socket && streamId) {
      socket.emit('end_stream', { streamId });
    }
    setIsLive(false);
  }, [socket, streamId]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCameraOn((prev) => !prev);
  }, []);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMicOn((prev) => !prev);
  }, []);

  // Handle Socket.IO events for WebRTC signaling
  useEffect(() => {
    if (!socket || !localStreamRef.current) return;

    const handleViewerJoined = async ({ viewerSocketId }: { viewerSocketId: string }) => {
      console.log('[Broadcast] Viewer joined:', viewerSocketId);
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnections.current.set(viewerSocketId, pc);

      // Add local tracks to this peer connection
      localStreamRef.current!.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      // Send ICE candidates to the viewer
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice_candidate', {
            targetSocketId: viewerSocketId,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`[Broadcast] Connection to ${viewerSocketId}: ${pc.connectionState}`);
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          pc.close();
          peerConnections.current.delete(viewerSocketId);
        }
      };

      // Create and send offer
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc_offer', {
          targetSocketId: viewerSocketId,
          offer: pc.localDescription,
        });
      } catch (err) {
        console.error('[Broadcast] Error creating offer:', err);
      }
    };

    const handleAnswer = async ({
      senderSocketId,
      answer,
    }: {
      senderSocketId: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      const pc = peerConnections.current.get(senderSocketId);
      if (pc && pc.signalingState !== 'stable') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error('[Broadcast] Error setting answer:', err);
        }
      }
    };

    const handleIceCandidate = ({
      senderSocketId,
      candidate,
    }: {
      senderSocketId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      const pc = peerConnections.current.get(senderSocketId);
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
          console.error('[Broadcast] ICE candidate error:', err)
        );
      }
    };

    const handleViewerLeft = ({ viewerSocketId }: { viewerSocketId: string }) => {
      console.log('[Broadcast] Viewer left:', viewerSocketId);
      const pc = peerConnections.current.get(viewerSocketId);
      if (pc) {
        pc.close();
        peerConnections.current.delete(viewerSocketId);
      }
    };

    const handleViewerCount = (count: number) => setViewerCount(count);

    socket.on('viewer_joined', handleViewerJoined);
    socket.on('webrtc_answer', handleAnswer);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('viewer_left', handleViewerLeft);
    socket.on('viewer_count', handleViewerCount);

    return () => {
      socket.off('viewer_joined', handleViewerJoined);
      socket.off('webrtc_answer', handleAnswer);
      socket.off('ice_candidate', handleIceCandidate);
      socket.off('viewer_left', handleViewerLeft);
      socket.off('viewer_count', handleViewerCount);
    };
  }, [socket, localStream]);

  return {
    localStream,
    viewerCount,
    isLive,
    isCameraOn,
    isMicOn,
    startBroadcast,
    stopBroadcast,
    toggleCamera,
    toggleMic,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIEWER HOOK — Used by fans/users to watch a live stream
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function useViewer(
  socket: Socket | null,
  streamId: string | null,
  user: { _id: string; name: string; avatar?: string } | null
) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<string>('new');
  const [viewerCount, setViewerCount] = useState(0);
  const [streamEnded, setStreamEnded] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!socket || !streamId) return;

    // Tell the server we're joining
    socket.emit('join_stream', {
      streamId,
      userId: user?._id || 'anonymous',
      userName: user?.name || 'Anonymous',
      avatar: user?.avatar || '',
    });

    const handleOffer = async ({
      senderSocketId,
      offer,
    }: {
      senderSocketId: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log('[Viewer] Received offer from creator');

      // Close any existing connection
      if (pcRef.current) {
        pcRef.current.close();
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      // Handle incoming tracks
      pc.ontrack = (event) => {
        console.log('[Viewer] Got remote track:', event.track.kind);
        setRemoteStream(event.streams[0]);
      };

      // Send ICE candidates back to creator
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice_candidate', {
            targetSocketId: senderSocketId,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState);
        console.log('[Viewer] Connection state:', pc.connectionState);
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc_answer', {
          targetSocketId: senderSocketId,
          answer: pc.localDescription,
        });
      } catch (err) {
        console.error('[Viewer] Error handling offer:', err);
      }
    };

    const handleIceCandidate = ({
      candidate,
    }: {
      senderSocketId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      if (pcRef.current) {
        pcRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
          console.error('[Viewer] ICE candidate error:', err)
        );
      }
    };

    const handleViewerCount = (count: number) => setViewerCount(count);

    const handleStreamEnded = () => {
      console.log('[Viewer] Stream ended');
      setStreamEnded(true);
      setConnectionState('ended');
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };

    const handleStreamError = ({ message }: { message: string }) => {
      console.error('[Viewer] Stream error:', message);
      setStreamEnded(true);
    };

    socket.on('webrtc_offer', handleOffer);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('viewer_count', handleViewerCount);
    socket.on('stream_ended', handleStreamEnded);
    socket.on('stream_error', handleStreamError);

    return () => {
      socket.off('webrtc_offer', handleOffer);
      socket.off('ice_candidate', handleIceCandidate);
      socket.off('viewer_count', handleViewerCount);
      socket.off('stream_ended', handleStreamEnded);
      socket.off('stream_error', handleStreamError);

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      socket.emit('leave_stream', { streamId });
    };
  }, [socket, streamId, user?._id]);

  return { remoteStream, connectionState, viewerCount, streamEnded };
}
