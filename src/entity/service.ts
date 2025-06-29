import { Entity, IEntity } from './model';
import { AppError, PaginationOptions, PaginatedResponse } from '../types/common';
import mongoose from 'mongoose';

export class EntityService {
  async createEntity(entityData: Partial<IEntity>): Promise<IEntity> {
    try {
      const entity = new Entity(entityData);
      return await entity.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Entity already exists', 409);
      }
      throw new AppError('Failed to create entity', 500);
    }
  }

  async getEntityById(id: string): Promise<IEntity> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid entity ID', 400);
    }

    const entity = await Entity.findById(id)
      .populate('type', 'name description')
      .populate('place', 'name description')
      .exec();

    if (!entity) {
      throw new AppError('Entity not found', 404);
    }

    return entity;
  }

  async getEntities(options: PaginationOptions, filters: any = {}): Promise<PaginatedResponse<IEntity>> {
    const { page, limit, sort, order } = options;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.place) {
      query.place = filters.place;
    }

    // Get total count
    const total = await Entity.countDocuments(query);

    // Get paginated results
    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const entities = await Entity.find(query)
      .populate('type', 'name description')
      .populate('place', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data: entities,
      pagination: {
        current: page,
        pages,
        count: entities.length,
        total
      }
    };
  }

  async updateEntity(id: string, updateData: Partial<IEntity>): Promise<IEntity> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid entity ID', 400);
    }

    const entity = await Entity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('type', 'name description')
      .populate('place', 'name description');

    if (!entity) {
      throw new AppError('Entity not found', 404);
    }

    return entity;
  }

  async deleteEntity(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid entity ID', 400);
    }

    const entity = await Entity.findByIdAndDelete(id);

    if (!entity) {
      throw new AppError('Entity not found', 404);
    }
  }

  async getEntitiesByType(typeId: string): Promise<IEntity[]> {
    if (!mongoose.Types.ObjectId.isValid(typeId)) {
      throw new AppError('Invalid entity type ID', 400);
    }

    return await Entity.find({ type: typeId })
      .populate('type', 'name description')
      .populate('place', 'name description')
      .exec();
  }

  async getEntitiesByPlace(placeId: string): Promise<IEntity[]> {
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      throw new AppError('Invalid place ID', 400);
    }

    return await Entity.find({ place: placeId })
      .populate('type', 'name description')
      .populate('place', 'name description')
      .exec();
  }
}
