import { RelationshipType, IRelationshipType } from './model';
import { AppError, PaginationOptions, PaginatedResponse } from '../types/common';
import mongoose from 'mongoose';

export class RelationshipTypeService {
  async createRelationshipType(typeData: Partial<IRelationshipType>): Promise<IRelationshipType> {
    try {
      const relationshipType = new RelationshipType(typeData);
      return await relationshipType.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Relationship type already exists', 409);
      }
      throw new AppError('Failed to create relationship type', 500);
    }
  }

  async getRelationshipTypeById(id: string): Promise<IRelationshipType> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid relationship type ID', 400);
    }

    const relationshipType = await RelationshipType.findById(id).exec();

    if (!relationshipType) {
      throw new AppError('Relationship type not found', 404);
    }

    return relationshipType;
  }

  async getRelationshipTypes(options: PaginationOptions, filters: any = {}): Promise<PaginatedResponse<IRelationshipType>> {
    const { page, limit, sort, order } = options;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    // Get total count
    const total = await RelationshipType.countDocuments(query);

    // Get paginated results
    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const relationshipTypes = await RelationshipType.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data: relationshipTypes,
      pagination: {
        current: page,
        pages,
        count: relationshipTypes.length,
        total
      }
    };
  }

  async updateRelationshipType(id: string, updateData: Partial<IRelationshipType>): Promise<IRelationshipType> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid relationship type ID', 400);
    }

    const relationshipType = await RelationshipType.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!relationshipType) {
      throw new AppError('Relationship type not found', 404);
    }

    return relationshipType;
  }

  async deleteRelationshipType(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid relationship type ID', 400);
    }

    const relationshipType = await RelationshipType.findByIdAndDelete(id);

    if (!relationshipType) {
      throw new AppError('Relationship type not found', 404);
    }
  }

  async getAllRelationshipTypes(): Promise<IRelationshipType[]> {
    return await RelationshipType.find({}).sort({ name: 1 }).exec();
  }
}
