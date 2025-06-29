# Link API - Backend Server

A comprehensive backend API built with Node.js, TypeScript, Express, and MongoDB using Vertical Slice Architecture.

## Features

- **Vertical Slice Architecture** - Each feature is self-contained with its own routes, controller, service, model, and validation
- **MongoDB Integration** - Full database integration with Mongoose ODM
- **Cloudinary Integration** - Image upload and management
- **Comprehensive Validation** - Input validation using Joi
- **Error Handling** - Centralized error handling with custom error types
- **Search Functionality** - Global and filtered search across all entities
- **Relationship Management** - Complex relationship management between entities
- **Type Safety** - Full TypeScript implementation

## Project Structure

```
src/
├── person/                 # Person vertical slice
│   ├── routes.ts
│   ├── controller.ts
│   ├── service.ts
│   ├── model.ts
│   └── validation.ts
├── entity/                 # Entity vertical slice
├── place/                  # Place vertical slice
├── relationship/           # Relationship vertical slice
├── relationship-type/      # Relationship Type vertical slice
├── entity-type/           # Entity Type vertical slice
├── search/                # Search vertical slice
├── utils/                 # Utilities
│   ├── db.ts
│   └── cloudinary.ts
├── middleware/            # Middleware
│   ├── errorHandler.ts
│   ├── notFoundHandler.ts
│   └── validation.ts
├── types/                 # Type definitions
│   └── common.ts
├── config/                # Configuration
│   └── config.ts
└── app.ts                 # Main application file
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image hosting)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd link/api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/link
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Build and run the application:**
   ```bash
   # Development mode
   npm run dev

   # Production build
   npm run build
   npm start
   ```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Currently, the API doesn't require authentication. This can be added later as needed.

---

## API Endpoints

### 🏥 Health Check
- **GET** `/health` - Check server status

### 👤 Person APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/persons` | List all persons (paginated, filterable) |
| GET | `/api/person/:id` | Get a specific person's details |
| POST | `/api/person` | Create a new person |
| PUT | `/api/person/:id` | Update a person |
| DELETE | `/api/person/:id` | Delete a person |

**Query Parameters for GET /api/persons:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name and description
- `place` - Filter by place ID
- `sort` - Sort field (default: createdAt)
- `order` - asc/desc (default: desc)

**Person Schema:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (optional)",
  "description": "string (max 500 chars)",
  "dateOfBirth": "date",
  "websites": ["string (URLs)"],
  "images": ["string (Cloudinary URLs)"],
  "place": "ObjectId (Place reference)"
}
```

### 🏢 Entity APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/entities` | List all entities with filters |
| GET | `/api/entity/:id` | Get specific entity detail |
| POST | `/api/entity` | Create new entity |
| PUT | `/api/entity/:id` | Update entity |
| DELETE | `/api/entity/:id` | Delete entity |

**Query Parameters for GET /api/entities:**
- `page`, `limit`, `search`, `sort`, `order` (same as persons)
- `type` - Filter by entity type ID
- `place` - Filter by place ID

**Entity Schema:**
```json
{
  "type": "ObjectId (EntityType reference, required)",
  "name": "string (required)",
  "description": "string (max 1000 chars)",
  "websites": ["string (URLs)"],
  "images": ["string (Cloudinary URLs)"],
  "place": "ObjectId (Place reference)"
}
```

### 📍 Place APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/places` | List all places |
| GET | `/api/place/:id` | Get specific place details |
| POST | `/api/place` | Add a new place |
| PUT | `/api/place/:id` | Update a place |
| DELETE | `/api/place/:id` | Delete a place |

**Place Schema:**
```json
{
  "name": "string (required)",
  "description": "string (max 1000 chars)",
  "images": ["string (Cloudinary URLs)"]
}
```

### 🔗 Relationship APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/relationships` | List all relationships |
| GET | `/api/relationship/:id` | View specific relationship |
| POST | `/api/relationship` | Create relationship |
| PUT | `/api/relationship/:id` | Update relationship |
| DELETE | `/api/relationship/:id` | Remove a relationship |

**Relationship Schema:**
```json
{
  "from": "ObjectId (required)",
  "to": "ObjectId (required)",
  "fromModel": "Person | Entity (required)",
  "toModel": "Person | Entity (required)",
  "relationship": "ObjectId (RelationshipType reference, required)",
  "reverseRelationship": "ObjectId (RelationshipType reference, required)"
}
```

### 🔁 Relationship Type APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/relationship-types` | List all relationship types |
| GET | `/api/relationship-types/:id` | Get specific relationship type |
| POST | `/api/relationship-types` | Create new type |
| PUT | `/api/relationship-types/:id` | Update type |
| DELETE | `/api/relationship-types/:id` | Remove a relationship type |

### 🏷️ Entity Type APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/entity-types` | List all entity types |
| GET | `/api/entity-types/:id` | Get specific entity type |
| POST | `/api/entity-types` | Add a new entity type |
| PUT | `/api/entity-types/:id` | Update entity type |
| DELETE | `/api/entity-types/:id` | Remove an entity type |

### 🌐 Search APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/search?q=term` | Global search across people, entities, places |
| GET | `/api/search/filter` | Filtered search results |

**Search Query Parameters:**
- `q` - Search term (required for global search)
- `type` - Filter by type (person, entity, place)
- `place` - Filter by place ID
- `entityType` - Filter by entity type ID
- `search` - Search term for filtered search
- `page`, `limit` - Pagination

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {}, // or []
  "message": "Optional success message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "current": 1,
    "pages": 5,
    "count": 10,
    "total": 50
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Validation error details"] // Optional
}
```

## Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Architecture Decisions

### Vertical Slice Architecture
Each feature (Person, Entity, Place, etc.) is organized as a self-contained vertical slice containing:
- **Routes** - Express route definitions
- **Controller** - Request/response handling
- **Service** - Business logic
- **Model** - Database schema and operations
- **Validation** - Input validation rules

### Benefits:
- **Maintainability** - Each feature is self-contained
- **Scalability** - Easy to add new features
- **Testing** - Easy to test individual slices
- **Team Development** - Multiple developers can work on different features

### Database Design
- **MongoDB** with Mongoose for object modeling
- **Relationships** handled through ObjectId references
- **Flexible schema** for future extensions
- **Indexes** for performance optimization

### Error Handling
- **Centralized error handling** with custom AppError class
- **Validation errors** with detailed messages
- **HTTP status codes** properly implemented
- **Development vs Production** error responses

## Future Enhancements

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - API rate limiting

2. **File Upload**
   - Direct image upload to Cloudinary
   - File validation and processing
   - Bulk upload capabilities

3. **Real-time Features**
   - WebSocket integration
   - Real-time notifications
   - Live search

4. **Advanced Search**
   - Elasticsearch integration
   - Full-text search
   - Search analytics

5. **Caching**
   - Redis integration
   - Query result caching
   - Session management

6. **API Documentation**
   - Swagger/OpenAPI integration
   - Interactive API docs
   - Postman collection

## License

MIT License
