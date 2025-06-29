import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config/config';
import { connectDB } from './utils/db';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

// Import all route modules
import { personRoutes } from './person/routes';
import { entityRoutes } from './entity/routes';
import { placeRoutes } from './place/routes';
import { relationshipRoutes } from './relationship/routes';
import { relationshipTypeRoutes } from './relationship-type/routes';
import { entityTypeRoutes } from './entity-type/routes';
import { searchRoutes } from './search/routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(morgan('combined'));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api', personRoutes);
    this.app.use('/api', entityRoutes);
    this.app.use('/api', placeRoutes);
    this.app.use('/api', relationshipRoutes);
    this.app.use('/api', relationshipTypeRoutes);
    this.app.use('/api', entityTypeRoutes);
    this.app.use('/api', searchRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Database: ${config.mongodbUri}`);
    });
  }
}

async function bootstrap() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    const app = new App();
    app.listen();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

bootstrap();
// trigger restart
