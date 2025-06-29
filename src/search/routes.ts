import { Router } from 'express';
import { globalSearch, filteredSearch } from './controller';

const router = Router();

// GET /api/search?q=term - Global search across people, entities, places
router.get('/search', globalSearch);

// GET /api/search/filter?type=person&place=Erlalai - Filtered results
router.get('/search/filter', filteredSearch);

export { router as searchRoutes };
