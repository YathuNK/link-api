import { Router } from 'express';
import { 
  createPlace, 
  getPlaceById, 
  getPlaces, 
  updatePlace, 
  deletePlace,
  getPlacesByRegion,
  getSubPlaces
} from './controller';
import { validateRequest } from '../middleware/validation';
import { validateCreatePlace, validateUpdatePlace } from './validation';

const router = Router();

// GET /api/places - List all places
router.get('/places', getPlaces);

// GET /api/places/region/:regionId - Get places by region
router.get('/places/region/:regionId', getPlacesByRegion);

// GET /api/place/:id - Get specific place details
router.get('/place/:id', getPlaceById);

// GET /api/place/:id/sub-places - Get sub-places (places that have this place as their region)
router.get('/place/:id/sub-places', getSubPlaces);

// POST /api/place - Add a new place
router.post('/place', validateRequest(validateCreatePlace), createPlace);

// PUT /api/place/:id - Update a place
router.put('/place/:id', validateRequest(validateUpdatePlace), updatePlace);

// DELETE /api/place/:id - Delete a place
router.delete('/place/:id', deletePlace);

export { router as placeRoutes };
