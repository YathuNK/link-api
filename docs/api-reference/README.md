# API Reference

## Base URL
```
http://localhost:8000
```

## Response Format

All API endpoints return JSON responses in the following format:

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

## People Endpoints

### GET /api/persons
Get list of all people with pagination and filtering.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `search` (string, optional): Search in firstName, lastName, description
- `place` (string, optional): Filter by place ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "description": "Software developer",
      "websites": ["https://johndoe.com"],
      "images": ["https://example.com/image.jpg"],
      "place": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "New York",
        "type": "City"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "count": 1,
    "total": 1
  }
}
```

### GET /api/person/:id
Get a specific person by ID.

**Parameters:**
- `id` (string, required): Person ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    // ... other fields
  }
}
```

### POST /api/person
Create a new person.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "description": "Software developer",
  "websites": ["https://johndoe.com"],
  "place": "507f1f77bcf86cd799439012"
}
```

**Validation Rules:**
- `firstName`: Required, string, max 50 characters
- `lastName`: Optional, string, max 50 characters
- `dateOfBirth`: Optional, valid date
- `description`: Optional, string, max 1000 characters
- `websites`: Optional, array of valid URLs
- `place`: Optional, valid ObjectId reference

### PUT /api/person/:id
Update an existing person.

**Parameters:**
- `id` (string, required): Person ID

**Request Body:** Same as POST, all fields optional

### DELETE /api/person/:id
Delete a person.

**Parameters:**
- `id` (string, required): Person ID

## Entities Endpoints

### GET /api/entities
Get list of all entities.

**Query Parameters:**
- `page`, `limit`, `search` (same as people)
- `type` (string, optional): Filter by entity type ID

### GET /api/entity/:id
Get a specific entity by ID.

### POST /api/entity
Create a new entity.

**Request Body:**
```json
{
  "type": "507f1f77bcf86cd799439013",
  "name": "Acme Corp",
  "description": "Technology company",
  "websites": ["https://acme.com"],
  "place": "507f1f77bcf86cd799439012"
}
```

**Validation Rules:**
- `type`: Required, valid ObjectId reference to EntityType
- `name`: Required, string, max 100 characters
- `description`: Optional, string, max 1000 characters
- `websites`: Optional, array of valid URLs
- `place`: Optional, valid ObjectId reference

### PUT /api/entity/:id
Update an existing entity.

### DELETE /api/entity/:id
Delete an entity.

## Places Endpoints

### GET /api/places
Get list of all places.

**Query Parameters:**
- `page`, `limit`, `search` (same as people)
- `type` (string, optional): Filter by place type

### GET /api/place/:id
Get a specific place by ID.

### POST /api/place
Create a new place.

**Request Body:**
```json
{
  "name": "New York",
  "description": "The largest city in the United States",
  "type": "City",
  "address": "New York, NY, USA",
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "websites": ["https://nyc.gov"]
}
```

**Validation Rules:**
- `name`: Required, string, max 100 characters
- `description`: Optional, string, max 1000 characters
- `type`: Required, enum: 'City', 'Country', 'Region', 'Building', 'Landmark'
- `address`: Optional, string, max 500 characters
- `coordinates`: Optional, object with latitude and longitude numbers
- `websites`: Optional, array of valid URLs

### PUT /api/place/:id
Update an existing place.

### DELETE /api/place/:id
Delete a place.

## Relationships Endpoints

### GET /api/relationships
Get list of all relationships.

**Query Parameters:**
- `page`, `limit` (same as people)
- `type` (string, optional): Filter by relationship type ID
- `person` (string, optional): Filter by person ID (either from or to)
- `entity` (string, optional): Filter by entity ID (either from or to)

### GET /api/relationship/:id
Get a specific relationship by ID.

### POST /api/relationship
Create a new relationship.

**Request Body:**
```json
{
  "type": "507f1f77bcf86cd799439014",
  "fromPerson": "507f1f77bcf86cd799439011",
  "toPerson": "507f1f77bcf86cd799439015",
  "description": "Father-son relationship"
}
```

**Validation Rules:**
- `type`: Required, valid ObjectId reference to RelationshipType
- Must have at least one valid relationship pair:
  - `fromPerson` and `toPerson` (both valid ObjectId references)
  - `fromPerson` and `toEntity` (both valid ObjectId references)
  - `fromEntity` and `toPerson` (both valid ObjectId references)
  - `fromEntity` and `toEntity` (both valid ObjectId references)
- `description`: Optional, string, max 500 characters

### PUT /api/relationship/:id
Update an existing relationship.

### DELETE /api/relationship/:id
Delete a relationship.

## Entity Types Endpoints

### GET /api/entity-types
Get list of all entity types.

### GET /api/entity-type/:id
Get a specific entity type by ID.

### POST /api/entity-type
Create a new entity type.

**Request Body:**
```json
{
  "name": "Company",
  "description": "Business organization"
}
```

### PUT /api/entity-type/:id
Update an existing entity type.

### DELETE /api/entity-type/:id
Delete an entity type.

## Relationship Types Endpoints

### GET /api/relationship-types
Get list of all relationship types.

### GET /api/relationship-type/:id
Get a specific relationship type by ID.

### POST /api/relationship-type
Create a new relationship type.

**Request Body:**
```json
{
  "name": "Family",
  "description": "Family relationship"
}
```

### PUT /api/relationship-type/:id
Update an existing relationship type.

### DELETE /api/relationship-type/:id
Delete a relationship type.

## Search Endpoint

### GET /api/search
Global search across people, entities, and places.

**Query Parameters:**
- `q` (string, required): Search query
- `type` (string, optional): Filter by type ('person', 'entity', 'place')
- `limit` (number, optional): Maximum results per type (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "people": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "type": "person"
      }
    ],
    "entities": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "name": "Acme Corp",
        "type": "entity"
      }
    ],
    "places": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "New York",
        "type": "place"
      }
    ]
  }
}
```

## Error Codes

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error

### Custom Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `DUPLICATE_ENTRY` - Resource already exists
- `REFERENCE_ERROR` - Referenced resource not found
- `CONSTRAINT_VIOLATION` - Database constraint violation

## Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## File Upload

### POST /api/upload
Upload images to Cloudinary.

**Request:** multipart/form-data with `image` field
**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "image_id"
  }
}
```

## Authentication

Currently, the API does not implement authentication. All endpoints are publicly accessible. This is planned for future implementation.

## CORS

The API is configured to accept requests from:
- `http://localhost:3000` (development frontend)
- Production domains (when deployed)
