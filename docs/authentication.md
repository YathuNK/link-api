# User Authentication System

## Overview
This system implements Google SSO authentication with JWT tokens for API access. Users must be pre-registered in the database to authenticate successfully.

## User Model
- **Email**: Unique identifier for users
- **Name**: Display name
- **Role**: `admin` or `user`
- **Google ID**: Linked Google account identifier
- **Profile Picture**: From Google account
- **Active Status**: For enabling/disabling users

## Authentication Flow

### 1. Google SSO Authentication
**Endpoint**: `POST /api/auth/google`

**Request Body**:
```json
{
  "googleToken": "google_id_token_here"
}
```

**Response** (Success):
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "profilePicture": "https://...",
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Response** (Failure):
```json
{
  "success": false,
  "message": "User not authorized. Please contact administrator."
}
```

### 2. Get User Profile
**Endpoint**: `GET /api/auth/profile`
**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "profilePicture": "https://...",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Token Verification
**Endpoint**: `POST /api/auth/verify-token`
**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Protected Routes
All API routes (except authentication routes) are protected by authentication middleware at the app level. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Authentication Flow
1. Authentication routes (`/api/auth/*`) - No authentication required
2. All other API routes (`/api/*`) - Authentication required

### Route Protection
The authentication middleware is applied at the application level, automatically protecting:
- `/api/persons` - Person management
- `/api/entities` - Entity management  
- `/api/places` - Place management
- `/api/relationships` - Relationship management
- `/api/relationship-types` - Relationship type management
- `/api/entity-types` - Entity type management
- `/api/search` - Search functionality
Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## User Management

### Adding Users Manually
Users must be added directly to the database. Use the seed script:

```bash
npm run seed:users
```

Or manually insert into MongoDB:

```javascript
// Example MongoDB insertion
db.users.insertOne({
  email: "newuser@example.com",
  name: "New User",
  role: "user",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### User Roles
- **admin**: Full access to all APIs
- **user**: Standard access to all APIs

Note: Currently, all authenticated users have access to all protected routes. Role-based restrictions can be added per route as needed.

## Frontend Integration

### Google Sign-In Setup
1. Include Google Sign-In library in your frontend
2. Configure with your Google Client ID
3. On successful Google sign-in, send the ID token to `/api/auth/google`
4. Store the received JWT token for API calls

### Example Frontend Code (React)
```javascript
import { GoogleLogin } from '@react-oauth/google';

const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleToken: credentialResponse.credential
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token and user info
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }
};

// Component
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => console.log('Login Failed')}
/>
```

## Security Features
- JWT tokens with expiration
- User email verification against database
- Application-level authentication middleware
- Token blacklisting on user deactivation
- Secure password storage (not used for SSO)

## Error Handling
- Invalid tokens return 401 Unauthorized
- Missing tokens return 400 Bad Request
- Insufficient permissions return 403 Forbidden
- Server errors return 500 Internal Server Error

## Testing
Use the provided test endpoints to verify authentication:
- `/api/auth/verify-token` - Test token validity
- `/api/auth/profile` - Test authenticated user access
