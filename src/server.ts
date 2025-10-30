import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { supabase, testConnection } from './config/supabase';
import routes from './routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Supabase connection test endpoint
app.get('/db-status', async (req: Request, res: Response) => {
  try {
    const isConnected = await testConnection();
    res.status(200).json({
      database: isConnected ? 'Connected' : 'Disconnected',
      provider: 'Supabase',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      database: 'Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Customer API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      dbStatus: '/db-status',
      customers: '/api/customers'
    }
  });
});

// API Routes
app.use('/api', routes);

// Start server and test Supabase connection
const startServer = async () => {
  try {
    // Test Supabase connection on startup
    console.log('🔄 Testing Supabase connection...');
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Server URL: http://localhost:${PORT}`);
      console.log(`💚 Supabase: Connected`);
      console.log(`\n📋 Available Endpoints:`);
      console.log(`   GET  /health - Health check`);
      console.log(`   GET  /db-status - Database status`);
      console.log(`   POST /api/customers - Create customer`);
      console.log(`   GET  /api/customers/:id - Get customer by ID`);
      console.log(`   GET  /api/customers - Get all customers`);
      console.log(`${'='.repeat(50)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
