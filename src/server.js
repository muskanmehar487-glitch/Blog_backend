import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { connectToDatabase } from './utils/db.js';

const PORT = process.env.PORT || 81;

async function start() {
  try {
    console.log('Starting server...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
    console.log('PORT:', PORT);

    // Try to connect to database with retries
    let retries = 5;
    let connected = false;
    
    while (retries > 0 && !connected) {
      try {
        await connectToDatabase();
        connected = true;
        console.log('Database connected successfully');
      } catch (dbError) {
        retries--;
        console.error(`Database connection failed. Retries left: ${retries}`, dbError.message);
        if (retries > 0) {
          console.log('Retrying in 5 seconds...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          console.error('Failed to connect to database after retries. Starting server anyway...');
          // Don't exit - let the server start even if DB fails
        }
      }
    }

    // Start the server regardless of DB connection status
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
      console.log(`Server started successfully${connected ? ' with database connection' : ' (database connection failed)'}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();


