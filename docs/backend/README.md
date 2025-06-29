# Backend Implementation Details

## Architecture Overview

The backend follows **Vertical Slice Architecture**, where each feature is organized as a complete vertical slice containing all necessary layers (routes, controllers, services, models, validation).

## Project Structure

```
api/
├── src/
│   ├── config/
│   │   └── config.ts              # Environment configuration
│   ├── middleware/
│   │   ├── errorHandler.ts        # Global error handling
│   │   ├── notFoundHandler.ts     # 404 handler
│   │   └── validation.ts          # Request validation middleware
│   ├── utils/
│   │   ├── db.ts                  # Database connection
│   │   └── seeder.ts              # Database seeding
│   ├── person/                    # Person vertical slice
│   │   ├── controller.ts          # Person controllers
│   │   ├── model.ts               # Person Mongoose model
│   │   ├── routes.ts              # Person routes
│   │   ├── service.ts             # Person business logic
│   │   └── validation.ts          # Person validation schemas
│   ├── entity/                    # Entity vertical slice
│   ├── place/                     # Place vertical slice
│   ├── relationship/              # Relationship vertical slice
│   ├── relationship-type/         # Relationship type vertical slice
│   ├── entity-type/               # Entity type vertical slice
│   ├── search/                    # Search vertical slice
│   └── app.ts                     # Application entry point
├── .env                           # Environment variables
├── package.json
└── tsconfig.json
```

## Core Features

### 1. Person Management
- **Model**: `src/person/model.ts`
- **Routes**: `/api/persons` (GET, POST), `/api/person/:id` (GET, PUT, DELETE)
- **Fields**: firstName, lastName, dateOfBirth, description, websites[], images[], place
- **Relationships**: Belongs to a Place (optional)

### 2. Entity Management  
- **Model**: `src/entity/model.ts`
- **Routes**: `/api/entities` (GET, POST), `/api/entity/:id` (GET, PUT, DELETE)
- **Fields**: type (EntityType), name, description, websites[], images[], place
- **Relationships**: Belongs to EntityType and Place (optional)

### 3. Place Management
- **Model**: `src/place/model.ts`
- **Routes**: `/api/places` (GET, POST), `/api/place/:id` (GET, PUT, DELETE)
- **Fields**: name, description, type, address, coordinates, websites[], images[]

### 4. Relationship Management
- **Model**: `src/relationship/model.ts`
- **Routes**: `/api/relationships` (GET, POST), `/api/relationship/:id` (GET, PUT, DELETE)
- **Fields**: type (RelationshipType), fromPerson, toPerson, fromEntity, toEntity, description

### 5. Search Functionality
- **Routes**: `/api/search`
- **Features**: Cross-collection search across People, Entities, Places
- **Query Parameters**: `q` (search term), `type` (filter by type)

## Data Models

### Person Schema
```typescript
interface IPerson {
  firstName: string;
  lastName?: string;
  dateOfBirth?: Date;
  description?: string;
  websites: string[];
  images: string[];
  place?: ObjectId; // Reference to Place
}
```

### Entity Schema
```typescript
interface IEntity {
  type: ObjectId; // Reference to EntityType
  name: string;
  description?: string;
  websites: string[];
  images: string[];
  place?: ObjectId; // Reference to Place
}
```

### Place Schema
```typescript
interface IPlace {
  name: string;
  description?: string;
  type: 'City' | 'Country' | 'Region' | 'Building' | 'Landmark';
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  websites: string[];
  images: string[];
}
```

### Relationship Schema
```typescript
interface IRelationship {
  type: ObjectId; // Reference to RelationshipType
  fromPerson?: ObjectId;
  toPerson?: ObjectId;
  fromEntity?: ObjectId;
  toEntity?: ObjectId;
  description?: string;
}
```

## Configuration

### Environment Variables (.env)
```bash
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Response Format

All API endpoints return standardized responses:

### Success Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current": 1,
    "pages": 1,
    "count": 10,
    "total": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Validation

Using Joi for request validation:
- Required field validation
- Type checking
- String length limits
- URL format validation
- Custom business logic validation

## Database Features

- **Indexes**: Optimized queries with proper indexing
- **Population**: Automatic population of referenced documents
- **Virtuals**: Virtual fields for computed properties
- **Timestamps**: Automatic createdAt/updatedAt timestamps

## Middleware

1. **CORS**: Cross-origin resource sharing
2. **Helmet**: Security headers
3. **Morgan**: HTTP request logging
4. **Compression**: Response compression
5. **Error Handling**: Global error handling
6. **Validation**: Request validation middleware

## File Upload

- **Service**: Cloudinary for image storage
- **Middleware**: Multer for handling multipart/form-data
- **Validation**: File type and size validation
- **Storage**: Cloud-based storage with automatic optimization

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Seed database
npm run seed
```

## Database Seeding

The seeder creates sample data for all collections:
- EntityTypes (Company, Organization, Government, etc.)
- RelationshipTypes (Family, Professional, etc.)
- Places (Cities, Countries)
- People with relationships
- Entities with relationships

## Error Handling

- Global error handler middleware
- Async error catching
- Custom error types
- Detailed error logging
- Client-friendly error messages

## Security Features

- Input validation and sanitization
- Rate limiting
- Security headers (Helmet)
- CORS configuration
- Environment variable protection

## Performance Considerations

- Database indexing
- Response compression
- Efficient querying with population
- Pagination for large datasets
- Connection pooling (MongoDB driver)
