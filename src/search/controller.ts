import { Request, Response, NextFunction } from 'express';
import { SearchService } from './service';
import { AsyncController, QueryParams } from '../types/common';

const searchService = new SearchService();

export const globalSearch: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as QueryParams;
    
    if (!query['q']) {
      res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required'
      });
      return;
    }

    const options = {
      page: parseInt(query.page || '1', 10),
      limit: parseInt(query.limit || '10', 10),
      sort: query.sort || 'relevance',
      order: (query.order as 'asc' | 'desc') || 'desc'
    };

    const result = await searchService.globalSearch(query['q'], options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const filteredSearch: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as QueryParams;
    
    const options = {
      page: parseInt(query.page || '1', 10),
      limit: parseInt(query.limit || '10', 10),
      sort: query.sort || 'relevance',
      order: (query.order as 'asc' | 'desc') || 'desc'
    };

    const filters = {
      type: query['type'],
      place: query['place'],
      entityType: query['entityType'],
      search: query['search']
    };

    const result = await searchService.filteredSearch(filters, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
