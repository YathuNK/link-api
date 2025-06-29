import { Request, Response, NextFunction } from 'express';
import { PersonService } from './service';
import { AsyncController, ApiResponse, QueryParams } from '../types/common';

const personService = new PersonService();

export const createPerson: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const person = await personService.createPerson(req.body);
    
    const response: ApiResponse = {
      success: true,
      data: person,
      message: 'Person created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPersonById: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const person = await personService.getPersonById(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      data: person
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getPersons: AsyncController = async (
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
      place: query['place']
    };

    const result = await personService.getPersons(options, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePerson: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const person = await personService.updatePerson(req.params['id'] || '', req.body);
    
    const response: ApiResponse = {
      success: true,
      data: person,
      message: 'Person updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deletePerson: AsyncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await personService.deletePerson(req.params['id'] || '');
    
    const response: ApiResponse = {
      success: true,
      message: 'Person deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    next(error);
  }
};
