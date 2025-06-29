import { Request, Response, NextFunction } from 'express';
import { PlaceService } from './service';
import { AsyncController, ApiResponse, QueryParams } from '../types/common';

const placeService = new PlaceService();

export const createPlace: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const place = await placeService.createPlace(req.body);
    
    const response: ApiResponse = {
      success: true,
      data: place,
      message: 'Place created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPlaceById: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const place = await placeService.getPlaceById(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      data: place
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getPlaces: AsyncController = async (
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
      search: query.search
    };

    const result = await placeService.getPlaces(options, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePlace: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const place = await placeService.updatePlace(req.params['id'] || '', req.body);
    
    const response: ApiResponse = {
      success: true,
      data: place,
      message: 'Place updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deletePlace: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await placeService.deletePlace(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      message: 'Place deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};
