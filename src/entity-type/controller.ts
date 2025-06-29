import { Request, Response, NextFunction } from 'express';
import { EntityTypeService } from './service';
import { AsyncController, ApiResponse, QueryParams } from '../types/common';

const entityTypeService = new EntityTypeService();

export const createEntityType: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entityType = await entityTypeService.createEntityType(req.body);
    
    const response: ApiResponse = {
      success: true,
      data: entityType,
      message: 'Entity type created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEntityTypeById: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entityType = await entityTypeService.getEntityTypeById(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      data: entityType
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getEntityTypes: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as QueryParams;
    
    const options = {
      page: parseInt(query.page || '1', 10),
      limit: parseInt(query.limit || '10', 10),
      sort: query.sort || 'name',
      order: (query.order as 'asc' | 'desc') || 'asc'
    };

    const filters = {
      search: query.search
    };

    const result = await entityTypeService.getEntityTypes(options, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateEntityType: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const entityType = await entityTypeService.updateEntityType(req.params['id'] || '', req.body);
    
    const response: ApiResponse = {
      success: true,
      data: entityType,
      message: 'Entity type updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteEntityType: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await entityTypeService.deleteEntityType(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      message: 'Entity type deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};
