import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
}

export const config: Config = {
  nodeEnv: process.env['NODE_ENV'] || 'development',
  port: parseInt(process.env['PORT'] || '8000', 10),
  mongodbUri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/link',
  cloudinary: {
    cloudName: process.env['CLOUDINARY_CLOUD_NAME'] || '',
    apiKey: process.env['CLOUDINARY_API_KEY'] || '',
    apiSecret: process.env['CLOUDINARY_API_SECRET'] || '',
  },
  jwtSecret: process.env['JWT_SECRET'] || 'your-secret-key',
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
  bcryptRounds: parseInt(process.env['BCRYPT_ROUNDS'] || '12', 10),
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
  },
  google: {
    clientId: process.env['GOOGLE_CLIENT_ID'] || '',
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || '',
  },
};
