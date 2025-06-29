import { Request, Response, NextFunction } from 'express';
import { RelationshipService } from './service';
import { AsyncController, ApiResponse, QueryParams } from '../types/common';

const relationshipService = new RelationshipService();

export const createRelationship: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const relationship = await relationshipService.createRelationship(req.body);
    
    const response: ApiResponse = {
      success: true,
      data: relationship,
      message: 'Relationship created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getRelationshipById: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const relationship = await relationshipService.getRelationshipById(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      data: relationship
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getRelationships: AsyncController = async (
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
      from: query['from'],
      to: query['to'],
      fromModel: query['fromModel'],
      toModel: query['toModel'],
      relationship: query['relationship']
    };

    const result = await relationshipService.getRelationships(options, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateRelationship: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const relationship = await relationshipService.updateRelationship(req.params['id'] || '', req.body);
    
    const response: ApiResponse = {
      success: true,
      data: relationship,
      message: 'Relationship updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteRelationship: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await relationshipService.deleteRelationship(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      message: 'Relationship deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};
