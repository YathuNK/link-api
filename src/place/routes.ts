import { Router } from 'express';
import { 
  createPlace, 
  getPlaceById, 
  getPlaces, 
  updatePlace, 
  deletePlace 
} from './controller';
import { validateRequest } from '../middleware/validation';
import { validateCreatePlace, validateUpdatePlace } from './validation';

const router = Router();

// GET /api/places - List all places
router.get('/places', getPlaces);

// GET /api/place/:id - Get specific place details
router.get('/place/:id', getPlaceById);

// POST /api/place - Add a new place
router.post('/place', validateRequest(validateCreatePlace), createPlace);

// PUT /api/place/:id - Update a place
router.put('/place/:id', validateRequest(validateUpdatePlace), updatePlace);

// DELETE /api/place/:id - Delete a place
router.delete('/place/:id', deletePlace);

export { router as placeRoutes };
