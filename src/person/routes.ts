import { Router } from 'express';
import { 
  createPerson, 
  getPersonById, 
  getPersons, 
  updatePerson, 
  deletePerson 
} from './controller';
import { validateRequest } from '../middleware/validation';
import { validateCreatePerson, validateUpdatePerson } from './validation';

const router = Router();

// GET /api/persons - List all persons (paginated, filterable)
router.get('/persons', getPersons);

// GET /api/person/:id - Get a specific person's details
router.get('/person/:id', getPersonById);

// POST /api/person - Create a new person
router.post('/person', validateRequest(validateCreatePerson), createPerson);

// PUT /api/person/:id - Update a person
router.put('/person/:id', validateRequest(validateUpdatePerson), updatePerson);

// DELETE /api/person/:id - Delete a person
router.delete('/person/:id', deletePerson);

export { router as personRoutes };
