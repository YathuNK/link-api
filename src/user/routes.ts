import { Router } from 'express';
import { AuthController } from './controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validation';
import { googleAuthSchema } from './validation';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/auth/google', validate(googleAuthSchema), authController.authenticateWithGoogle);
router.get('/auth/profile', authMiddleware, authController.getUserProfile);
router.post('/auth/verify-token', authController.verifyToken);

export { router as authRoutes };
