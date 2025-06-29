import { Request, Response, NextFunction } from 'express';
import { RelationshipTypeService } from './service';
import { AsyncController, ApiResponse, QueryParams } from '../types/common';

const relationshipTypeService = new RelationshipTypeService();

export const createRelationshipType: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const relationshipType = await relationshipTypeService.createRelationshipType(req.body);
    
    const response: ApiResponse = {
      success: true,
      data: relationshipType,
      message: 'Relationship type created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getRelationshipTypeById: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const relationshipType = await relationshipTypeService.getRelationshipTypeById(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      data: relationshipType
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getRelationshipTypes: AsyncController = async (
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

    const result = await relationshipTypeService.getRelationshipTypes(options, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateRelationshipType: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const relationshipType = await relationshipTypeService.updateRelationshipType(req.params['id'] || '', req.body);
    
    const response: ApiResponse = {
      success: true,
      data: relationshipType,
      message: 'Relationship type updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteRelationshipType: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await relationshipTypeService.deleteRelationshipType(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      message: 'Relationship type deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};
