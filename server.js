const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Participant data structure
const participants = [];

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    path: '/api/socket',
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
    socket.on('qr-scanned', (data) => {
      console.log('QR scanned:', data);
      // Notify all clients (especially the host) that a QR was scanned
      io.emit('qr-scanned-notification', data);
    });

    // Handle name submission
    socket.on('submit-name', (data) => {
      console.log('Name submitted:', data);

      // Check if participant already exists
      const existingIndex = participants.findIndex((p) => p.number === data.number);

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
      io.emit('participants-update', participants);
    });

    // Handle reset request from host
    socket.on('reset-game', () => {
      console.log('Game reset requested');
      participants.length = 0; // Clear array
      io.emit('participants-update', participants);
      io.emit('game-reset');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
