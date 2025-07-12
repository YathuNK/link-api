import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User, IUser } from './model';

export interface GoogleTokenPayload {
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google's unique identifier
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Partial<IUser>;
  message?: string;
}

export class AuthService {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(config.google.clientId);
  }

  /**
   * Authenticate user with Google SSO token
   */
  async authenticateWithGoogle(googleToken: string): Promise<AuthResponse> {
    try {
      // Verify the Google token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleToken,
        audience: config.google.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return {
          success: false,
          message: 'Invalid Google token',
        };
      }

      const googleData: GoogleTokenPayload = {
        email: payload.email,
        name: payload.name || payload.email,
        sub: payload.sub,
      };
      
      if (payload.picture) {
        googleData.picture = payload.picture;
      }

      // Check if user exists in our database
      const existingUser = await User.findOne({
        email: googleData.email,
        isActive: true,
      });

      if (!existingUser) {
        return {
          success: false,
          message: 'User not authorized. Please contact administrator.',
        };
      }

      // Update user's Google ID and profile picture if not set
      if (!existingUser.googleId) {
        existingUser.googleId = googleData.sub;
      }
      if (!existingUser.profilePicture && googleData.picture) {
        existingUser.profilePicture = googleData.picture;
      }
      existingUser.lastLoginAt = new Date();
      
      await existingUser.save();

      // Generate JWT token
      const jwtToken = this.generateJwtToken(existingUser);

      return {
        success: true,
        token: jwtToken,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          ...(existingUser.profilePicture && { profilePicture: existingUser.profilePicture }),
          lastLoginAt: existingUser.lastLoginAt,
        },
      };

    } catch (error) {
      console.error('Google authentication error:', error);
      return {
        success: false,
        message: 'Authentication failed',
      };
    }
  }

  /**
   * Generate JWT token for authenticated user
   */
  private generateJwtToken(user: IUser): string {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
      issuer: 'link-api',
      audience: 'link-app',
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token and return user data
   */
  async verifyJwtToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload & {
        userId: string;
        email: string;
        role: string;
      };
      
      // Check if user still exists and is active
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return null;
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      console.error('JWT verification error:', error);
      return null;
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<Partial<IUser> | null> {
    try {
      const user = await User.findById(userId).select('-googleId');
      return user;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }
}
