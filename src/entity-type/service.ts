import { EntityType, IEntityType } from './model';
import { AppError, PaginationOptions, PaginatedResponse } from '../types/common';
import mongoose from 'mongoose';

export class EntityTypeService {
  async createEntityType(typeData: Partial<IEntityType>): Promise<IEntityType> {
    try {
      const entityType = new EntityType(typeData);
      return await entityType.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Entity type already exists', 409);
      }
      throw new AppError('Failed to create entity type', 500);
    }
  }

  async getEntityTypeById(id: string): Promise<IEntityType> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid entity type ID', 400);
    }

    const entityType = await EntityType.findById(id).exec();

    if (!entityType) {
      throw new AppError('Entity type not found', 404);
    }

    return entityType;
  }

  async getEntityTypes(options: PaginationOptions, filters: any = {}): Promise<PaginatedResponse<IEntityType>> {
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

    // Get total count
    const total = await EntityType.countDocuments(query);

    // Get paginated results
    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const entityTypes = await EntityType.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data: entityTypes,
      pagination: {
        current: page,
        pages,
        count: entityTypes.length,
        total
      }
    };
  }

  async updateEntityType(id: string, updateData: Partial<IEntityType>): Promise<IEntityType> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid entity type ID', 400);
    }

    const entityType = await EntityType.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!entityType) {
      throw new AppError('Entity type not found', 404);
    }

    return entityType;
  }

  async deleteEntityType(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid entity type ID', 400);
    }

    const entityType = await EntityType.findByIdAndDelete(id);

    if (!entityType) {
      throw new AppError('Entity type not found', 404);
    }
  }

  async getAllEntityTypes(): Promise<IEntityType[]> {
    return await EntityType.find({}).sort({ name: 1 }).exec();
  }
}
