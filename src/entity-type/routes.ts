import { Router } from 'express';
import { 
  createEntityType, 
  getEntityTypeById, 
  getEntityTypes, 
  updateEntityType, 
  deleteEntityType 
} from './controller';
import { validateRequest } from '../middleware/validation';
import { validateCreateEntityType, validateUpdateEntityType } from './validation';

const router = Router();

// GET /api/entity-types - List all entity types
router.get('/entity-types', getEntityTypes);

// GET /api/entity-types/:id - Get specific entity type details
router.get('/entity-types/:id', getEntityTypeById);

// POST /api/entity-types - Add a new entity type
router.post('/entity-types', validateRequest(validateCreateEntityType), createEntityType);

// PUT /api/entity-types/:id - Update entity type
router.put('/entity-types/:id', validateRequest(validateUpdateEntityType), updateEntityType);

// DELETE /api/entity-types/:id - Remove an entity type
router.delete('/entity-types/:id', deleteEntityType);

export { router as entityTypeRoutes };
