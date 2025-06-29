import { Router } from 'express';
import { 
  createRelationshipType, 
  getRelationshipTypeById, 
  getRelationshipTypes, 
  updateRelationshipType, 
  deleteRelationshipType 
} from './controller';
import { validateRequest } from '../middleware/validation';
import { validateCreateRelationshipType, validateUpdateRelationshipType } from './validation';

const router = Router();

// GET /api/relationship-types - List all relationship types
router.get('/relationship-types', getRelationshipTypes);

// GET /api/relationship-types/:id - Get specific relationship type details
router.get('/relationship-types/:id', getRelationshipTypeById);

// POST /api/relationship-types - Create new type with reverse
router.post('/relationship-types', validateRequest(validateCreateRelationshipType), createRelationshipType);

// PUT /api/relationship-types/:id - Update type and reverse
router.put('/relationship-types/:id', validateRequest(validateUpdateRelationshipType), updateRelationshipType);

// DELETE /api/relationship-types/:id - Remove a relationship type
router.delete('/relationship-types/:id', deleteRelationshipType);

export { router as relationshipTypeRoutes };
