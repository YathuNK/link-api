import { Router } from 'express';
import { 
  createEntity, 
  getEntityById, 
  getEntities, 
  updateEntity, 
  deleteEntity 
} from './controller';
import { validateRequest } from '../middleware/validation';
import { validateCreateEntity, validateUpdateEntity } from './validation';

const router = Router();

// GET /api/entities - List all entities with filters
router.get('/entities', getEntities);

// GET /api/entity/:id - Get specific entity detail
router.get('/entity/:id', getEntityById);

// POST /api/entity - Create new entity
router.post('/entity', validateRequest(validateCreateEntity), createEntity);

// PUT /api/entity/:id - Update entity
router.put('/entity/:id', validateRequest(validateUpdateEntity), updateEntity);

// DELETE /api/entity/:id - Delete entity
router.delete('/entity/:id', deleteEntity);

export { router as entityRoutes };
