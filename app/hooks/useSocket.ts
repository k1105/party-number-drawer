'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Participant {
  number: number;
  name: string;
  timestamp: number;
}

let socket: Socket | null = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Initialize socket connection only once
    if (!socket) {
      socket = io({
        path: '/api/socket',
        autoConnect: true,
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socket.on('participants-update', (data: Participant[]) => {
        console.log('Participants updated:', data);
        setParticipants(data);
      });

      socket.on('game-reset', () => {
        console.log('Game reset received');
        setParticipants([]);
      });
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, []);

  const emitQRScanned = (number: number) => {
    if (socket) {
      socket.emit('qr-scanned', { number });
    }
  };

  const submitName = (number: number, name: string) => {
    if (socket) {
      socket.emit('submit-name', { number, name });
    }
  };

  const resetGame = () => {
    if (socket) {
      socket.emit('reset-game');
    }
  };

  const onQRScannedNotification = (callback: (data: { number: number }) => void) => {
    if (socket) {
      socket.on('qr-scanned-notification', callback);
      return () => {
        socket?.off('qr-scanned-notification', callback);
      };
    }
  };

  return {
    isConnected,
    participants,
    emitQRScanned,
    submitName,
    resetGame,
    onQRScannedNotification,
  };
}
