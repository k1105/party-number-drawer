import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

// Global socket server instance
let io: SocketIOServer | null = null;

// Participant data structure
interface Participant {
  number: number;
  name: string;
  timestamp: number;
}

const participants: Participant[] = [];

export async function GET(req: NextRequest) {
  // This endpoint is used to initialize the socket server
  // In production, you'd use a custom server, but for dev this works

  return new Response(
    JSON.stringify({
      message: 'WebSocket server should be running on the same port',
      participants
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function initSocketServer(server: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current participants list to newly connected client
    socket.emit('participants-update', participants);

    // Handle QR code scanned event
    socket.on('qr-scanned', (data: { number: number }) => {
      console.log('QR scanned:', data);
      // Notify all clients (especially the host) that a QR was scanned
      io?.emit('qr-scanned-notification', data);
    });

    // Handle name submission
    socket.on('submit-name', (data: { number: number; name: string }) => {
      console.log('Name submitted:', data);

      // Check if participant already exists
      const existingIndex = participants.findIndex(p => p.number === data.number);

      if (existingIndex >= 0) {
        // Update existing participant
        participants[existingIndex] = {
          ...data,
          timestamp: Date.now(),
        };
      } else {
        // Add new participant
        participants.push({
          ...data,
          timestamp: Date.now(),
        });
      }

      // Broadcast updated participants list to all clients
      io?.emit('participants-update', participants);
    });

    // Handle reset request from host
    socket.on('reset-game', () => {
      console.log('Game reset requested');
      participants.length = 0; // Clear array
      io?.emit('participants-update', participants);
      io?.emit('game-reset');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
