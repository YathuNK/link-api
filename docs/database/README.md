# Database Schema and Relationships

## Database Overview

Link uses MongoDB as the primary database with Mongoose ODM for object modeling. The database is designed to efficiently store and query relationships between people, entities, and places.

## Collection Schema

### 1. People Collection

```javascript
{
  _id: ObjectId,
  firstName: String (required, max: 50),
  lastName: String (optional, max: 50),
  dateOfBirth: Date (optional),
  description: String (optional, max: 1000),
  websites: [String] (URL validation),
  images: [String] (Cloudinary URLs),
  place: ObjectId (ref: 'Place', optional),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

**Indexes:**
- `firstName` (text index)
- `lastName` (text index)
- `place` (reference index)
- `{ firstName: 1, lastName: 1 }` (compound index)

### 2. Entities Collection

```javascript
{
  _id: ObjectId,
  type: ObjectId (ref: 'EntityType', required),
  name: String (required, max: 100),
  description: String (optional, max: 1000),
  websites: [String] (URL validation),
  images: [String] (Cloudinary URLs),
  place: ObjectId (ref: 'Place', optional),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

**Indexes:**
- `name` (text index)
- `type` (reference index)
- `place` (reference index)

### 3. Places Collection

```javascript
{
  _id: ObjectId,
  name: String (required, max: 100),
  description: String (optional, max: 1000),
  type: String (enum: ['City', 'Country', 'Region', 'Building', 'Landmark']),
  address: String (optional, max: 500),
  coordinates: {
    latitude: Number (optional, range: -90 to 90),
    longitude: Number (optional, range: -180 to 180)
  },
  websites: [String] (URL validation),
  images: [String] (Cloudinary URLs),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

**Indexes:**
- `name` (text index)
- `type` (category index)
- `coordinates` (2dsphere index for geospatial queries)

### 4. Relationships Collection

```javascript
{
  _id: ObjectId,
  type: ObjectId (ref: 'RelationshipType', required),
  fromPerson: ObjectId (ref: 'Person', optional),
  toPerson: ObjectId (ref: 'Person', optional),
  fromEntity: ObjectId (ref: 'Entity', optional),
  toEntity: ObjectId (ref: 'Entity', optional),
  description: String (optional, max: 500),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

**Validation Rules:**
- Must have at least one valid relationship pair
- Cannot have circular references in the same document

**Indexes:**
- `type` (reference index)
- `fromPerson` (reference index)
- `toPerson` (reference index)
- `fromEntity` (reference index)
- `toEntity` (reference index)
- `{ fromPerson: 1, toPerson: 1 }` (compound index)
- `{ fromEntity: 1, toEntity: 1 }` (compound index)

### 5. EntityTypes Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique, max: 50),
  description: String (optional, max: 500),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

**Indexes:**
- `name` (unique index)

**Default Values:**
- Company
- Organization
- Government
- Institution
- NGO
- Media
- Educational

### 6. RelationshipTypes Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique, max: 50),
  description: String (optional, max: 500),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

**Indexes:**
- `name` (unique index)

**Default Values:**
- Family
- Professional
- Friend
- Colleague
- Business Partner
- Mentor
- Student

## Relationships Diagram

```
┌─────────────┐         ┌─────────────┐
│   Person    │◄────────┤Relationship │
│             │         │             │
│ - firstName │         │ - type      │
│ - lastName  │         │ - from*     │
│ - place ────┼────┐    │ - to*       │
└─────────────┘    │    └─────────────┘
                   │            │
                   │            │
┌─────────────┐    │    ┌─────────────┐
│   Entity    │◄───┼────┤             │
│             │    │    │             │
│ - name      │    │    │             │
│ - type ─────┼────┼───►│             │
│ - place ────┼────┘    │             │
└─────────────┘         │             │
       │                │             │
       ▼                ▼             │
┌─────────────┐  ┌─────────────┐      │
│ EntityType  │  │    Place    │◄─────┘
│             │  │             │
│ - name      │  │ - name      │
│ - desc      │  │ - type      │
└─────────────┘  │ - coords    │
                 └─────────────┘
                        ▲
                        │
                ┌─────────────┐
                │RelationType │
                │             │
                │ - name      │
                │ - desc      │
                └─────────────┘
```

## Data Relationships

### 1. One-to-Many Relationships
- **Place → People**: One place can have many people
- **Place → Entities**: One place can have many entities
- **EntityType → Entities**: One entity type can have many entities
- **RelationshipType → Relationships**: One relationship type can have many relationships

### 2. Many-to-Many Relationships
- **People ↔ People**: Through Relationships collection
- **People ↔ Entities**: Through Relationships collection
- **Entities ↔ Entities**: Through Relationships collection

### 3. Optional Relationships
- **Person → Place**: A person may or may not be associated with a place
- **Entity → Place**: An entity may or may not be associated with a place

## Query Patterns

### 1. Population Queries
```javascript
// Get person with populated place
Person.findById(id).populate('place')

// Get entity with populated type and place
Entity.findById(id).populate('type place')

// Get relationships with all references populated
Relationship.find().populate('type fromPerson toPerson fromEntity toEntity')
```

### 2. Search Queries
```javascript
// Text search across people
Person.find({
  $text: { $search: searchTerm }
})

// Geographic search
Place.find({
  coordinates: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 1000
    }
  }
})
```

### 3. Relationship Queries
```javascript
// Find all relationships for a person
Relationship.find({
  $or: [
    { fromPerson: personId },
    { toPerson: personId }
  ]
}).populate('type')

// Find connections between two entities
Relationship.find({
  $or: [
    { fromEntity: entityId1, toEntity: entityId2 },
    { fromEntity: entityId2, toEntity: entityId1 }
  ]
})
```

## Data Validation

### 1. Schema Validation
- **Required Fields**: Enforced at schema level
- **String Lengths**: Maximum character limits
- **URL Validation**: Custom validators for website fields
- **Date Validation**: Proper date format validation
- **Reference Validation**: ObjectId format and existence

### 2. Business Logic Validation
- **Relationship Pairs**: At least one valid from/to pair required
- **Circular References**: Prevention of self-referencing relationships
- **Duplicate Prevention**: Unique constraints where applicable

### 3. Custom Validators
```javascript
// URL validation
websites: [{
  type: String,
  validate: {
    validator: function(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    message: 'Invalid URL format'
  }
}]

// Coordinate validation
coordinates: {
  latitude: {
    type: Number,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180
  }
}
```

## Performance Considerations

### 1. Indexing Strategy
- **Text Indexes**: For search functionality
- **Reference Indexes**: For join operations
- **Compound Indexes**: For frequently combined queries
- **Geospatial Indexes**: For location-based queries

### 2. Query Optimization
- **Selective Population**: Only populate needed references
- **Projection**: Select only required fields
- **Pagination**: Limit result sets for large collections
- **Aggregation**: Use aggregation pipeline for complex queries

### 3. Data Size Management
- **Image Storage**: External storage (Cloudinary) with URL references
- **Text Limits**: Reasonable limits on text fields
- **Archival Strategy**: Soft delete for historical data

## Migration Scripts

### 1. Initial Setup
```javascript
// Create collections with indexes
db.people.createIndex({ "firstName": "text", "lastName": "text" })
db.entities.createIndex({ "name": "text" })
db.places.createIndex({ "name": "text" })
db.places.createIndex({ "coordinates": "2dsphere" })
```

### 2. Data Seeding
```javascript
// Insert default entity types
db.entitytypes.insertMany([
  { name: "Company", description: "Business organization" },
  { name: "NGO", description: "Non-governmental organization" },
  // ... more types
])

// Insert default relationship types
db.relationshiptypes.insertMany([
  { name: "Family", description: "Family relationship" },
  { name: "Professional", description: "Work-related relationship" },
  // ... more types
])
```

## Backup and Recovery

### 1. Backup Strategy
- **Daily Backups**: Automated daily MongoDB dumps
- **Incremental Backups**: Oplog-based incremental backups
- **Cloud Storage**: Backups stored in cloud storage
- **Point-in-Time Recovery**: Using MongoDB Atlas or replica sets

### 2. Data Export/Import
- **JSON Export**: For data portability
- **CSV Export**: For analysis and reporting
- **Bulk Import**: For migrating large datasets

## Security Considerations

### 1. Data Protection
- **Connection Security**: SSL/TLS for database connections
- **Authentication**: Database user authentication
- **Authorization**: Role-based access control
- **Input Sanitization**: Prevent NoSQL injection

### 2. Privacy
- **Personal Data**: Proper handling of personal information
- **Data Retention**: Policies for data retention and deletion
- **Consent Management**: Track user consent for data processing
- **Anonymization**: Options for data anonymization

## Monitoring and Analytics

### 1. Performance Monitoring
- **Query Performance**: Slow query logging and optimization
- **Index Usage**: Monitor index effectiveness
- **Connection Pooling**: Monitor connection usage
- **Disk Usage**: Track database growth

### 2. Data Analytics
- **Relationship Analysis**: Graph analysis of connections
- **Growth Metrics**: Track data growth over time
- **Usage Patterns**: Analyze query patterns and user behavior
