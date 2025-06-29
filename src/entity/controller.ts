import { Request, Response, NextFunction } from 'express';
import { EntityService } from './service';
import { AsyncController, ApiResponse, QueryParams } from '../types/common';

const entityService = new EntityService();

export const createEntity: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entity = await entityService.createEntity(req.body);
    
    const response: ApiResponse = {
      success: true,
      data: entity,
      message: 'Entity created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEntityById: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entity = await entityService.getEntityById(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      data: entity
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getEntities: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as QueryParams;
    
    const options = {
      page: parseInt(query.page || '1', 10),
      limit: parseInt(query.limit || '10', 10),
      sort: query.sort || 'createdAt',
      order: (query.order as 'asc' | 'desc') || 'desc'
    };

    const filters = {
      search: query.search,
      type: query['type'],
      place: query['place']
    };

    const result = await entityService.getEntities(options, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateEntity: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entity = await entityService.updateEntity(req.params['id'] || '', req.body);
    
    const response: ApiResponse = {
      success: true,
      data: entity,
      message: 'Entity updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteEntity: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await entityService.deleteEntity(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      message: 'Entity deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};
