import { Request, Response } from 'express';
import { AuthService } from './service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Authenticate user with Google SSO
   */
  public authenticateWithGoogle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { googleToken } = req.body;

      if (!googleToken) {
        res.status(400).json({
          success: false,
          message: 'Google token is required',
        });
        return;
      }

      const authResult = await this.authService.authenticateWithGoogle(googleToken);

      if (authResult.success) {
        res.status(200).json({
          success: true,
          message: 'Authentication successful',
          data: {
            token: authResult.token,
            user: authResult.user,
          },
        });
      } else {
        res.status(401).json({
          success: false,
          message: authResult.message || 'Authentication failed',
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  /**
   * Get current user profile
   */
  public getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const user = await this.authService.getUserProfile(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  /**
   * Verify token endpoint (for debugging/testing)
   */
  public verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token is required',
        });
        return;
      }

      const verified = await this.authService.verifyJwtToken(token);

      if (verified) {
        res.status(200).json({
          success: true,
          message: 'Token is valid',
          data: verified,
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
}
