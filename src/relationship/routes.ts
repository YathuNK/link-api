import { Router } from 'express';
import { 
  createRelationship, 
  getRelationshipById, 
  getRelationships, 
  updateRelationship, 
  deleteRelationship 
} from './controller';
import { validateRequest } from '../middleware/validation';
import { validateCreateRelationship, validateUpdateRelationship } from './validation';

const router = Router();

// GET /api/relationships - List all relationships
router.get('/relationships', getRelationships);

// GET /api/relationship/:id - View specific relationship
router.get('/relationship/:id', getRelationshipById);

// POST /api/relationship - Create relationship (person-entity/place - handle the reverse relationship creation as well)
router.post('/relationship', validateRequest(validateCreateRelationship), createRelationship);

// PUT /api/relationship/:id - Update relationship
router.put('/relationship/:id', validateRequest(validateUpdateRelationship), updateRelationship);

// DELETE /api/relationship/:id - Remove a relationship
router.delete('/relationship/:id', deleteRelationship);

export { router as relationshipRoutes };
