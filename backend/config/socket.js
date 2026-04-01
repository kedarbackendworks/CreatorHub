/**
 * Socket.IO Signaling Server for WebRTC Live Streaming + Live Chat
 *
 * Responsibilities:
 *  - Relay WebRTC SDP offers/answers and ICE candidates between creator and viewers
 *  - Manage stream rooms (join / leave / end)
 *  - Broadcast live chat messages within a stream room
 *  - Track real-time viewer count
 */

// In-memory store: streamId → { creatorSocketId, viewers: Set<socketId> }
const streams = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ─── Creator creates/starts a stream room ──────────────────────
    socket.on('create_stream', ({ streamId }) => {
      socket.join(`stream:${streamId}`);
      let stream = streams.get(streamId);
      if (!stream) {
        stream = { creatorSocketId: socket.id, viewers: new Map() };
        streams.set(streamId, stream);
      } else {
        stream.creatorSocketId = socket.id;
        // Notify the creator about viewers who joined BEFORE the stream started
        for (const [viewerSocketId, viewerInfo] of stream.viewers.entries()) {
          io.to(socket.id).emit('viewer_joined', {
            viewerSocketId,
            ...viewerInfo
          });
        }
      }
      console.log(`[Stream] Created: ${streamId} by ${socket.id}`);
    });

    // ─── Viewer joins a stream room ────────────────────────────────
    socket.on('join_stream', ({ streamId, userId, userName, avatar }) => {
      socket.join(`stream:${streamId}`);

      let stream = streams.get(streamId);
      if (!stream) {
         // Create waiting room if creator hasn't started yet
         stream = { creatorSocketId: null, viewers: new Map() };
         streams.set(streamId, stream);
      }

      const viewerInfo = { userId, userName, avatar };
      stream.viewers.set(socket.id, viewerInfo);

      // Notify the creator about the new viewer so they can create a PeerConnection
      if (stream.creatorSocketId) {
        io.to(stream.creatorSocketId).emit('viewer_joined', {
          viewerSocketId: socket.id,
          ...viewerInfo
        });
      }

      // Broadcast updated viewer count
      io.to(`stream:${streamId}`).emit('viewer_count', stream.viewers.size);
      console.log(`[Stream] Viewer ${socket.id} joined ${streamId}  (${stream.viewers.size} viewers)`);
    });

    // ─── WebRTC Signaling: SDP Offer ───────────────────────────────
    socket.on('webrtc_offer', ({ targetSocketId, offer }) => {
      io.to(targetSocketId).emit('webrtc_offer', {
        senderSocketId: socket.id,
        offer,
      });
    });

    // ─── WebRTC Signaling: SDP Answer ──────────────────────────────
    socket.on('webrtc_answer', ({ targetSocketId, answer }) => {
      io.to(targetSocketId).emit('webrtc_answer', {
        senderSocketId: socket.id,
        answer,
      });
    });

    // ─── WebRTC Signaling: ICE Candidate ───────────────────────────
    socket.on('ice_candidate', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('ice_candidate', {
        senderSocketId: socket.id,
        candidate,
      });
    });

    // ─── Live Chat Message ─────────────────────────────────────────
    socket.on('chat_message', ({ streamId, userId, userName, avatar, text }) => {
      const message = {
        userId,
        userName,
        avatar,
        text,
        timestamp: new Date().toISOString(),
      };
      io.to(`stream:${streamId}`).emit('chat_message', message);
    });

    // ─── Creator ends stream ───────────────────────────────────────
    socket.on('end_stream', ({ streamId }) => {
      io.to(`stream:${streamId}`).emit('stream_ended');

      // Clean up all peer connections by notifying the room
      const stream = streams.get(streamId);
      if (stream) {
        stream.viewers.clear();
      }
      streams.delete(streamId);
      console.log(`[Stream] Ended: ${streamId}`);
    });

    // ─── Viewer leaves ─────────────────────────────────────────────
    socket.on('leave_stream', ({ streamId }) => {
      socket.leave(`stream:${streamId}`);
      const stream = streams.get(streamId);
      if (stream) {
        stream.viewers.delete(socket.id);

        // Tell the creator to tear down that viewer's PeerConnection
        io.to(stream.creatorSocketId).emit('viewer_left', {
          viewerSocketId: socket.id,
        });

        io.to(`stream:${streamId}`).emit('viewer_count', stream.viewers.size);
      }
    });

    // ─── Disconnect (handle creator crash / tab close) ─────────────
    socket.on('disconnect', () => {
      for (const [streamId, stream] of streams.entries()) {
        if (stream.creatorSocketId === socket.id) {
          // Creator disconnected — end the stream for everyone
          io.to(`stream:${streamId}`).emit('stream_ended');
          streams.delete(streamId);
          console.log(`[Stream] Creator disconnected, ending ${streamId}`);
        } else if (stream.viewers.has(socket.id)) {
          stream.viewers.delete(socket.id);

          io.to(stream.creatorSocketId).emit('viewer_left', {
            viewerSocketId: socket.id,
          });

          io.to(`stream:${streamId}`).emit('viewer_count', stream.viewers.size);
        }
      }
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
};
