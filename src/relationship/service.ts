import { Relationship, IRelationship } from './model';
import { AppError, PaginationOptions, PaginatedResponse } from '../types/common';
import mongoose from 'mongoose';

export class RelationshipService {
  async createRelationship(relationshipData: Partial<IRelationship>): Promise<IRelationship> {
    try {
      // Check if relationship already exists
      const existingRelationship = await Relationship.findOne({
        from: relationshipData.from,
        to: relationshipData.to,
        relationship: relationshipData.relationship
      });

      if (existingRelationship) {
        throw new AppError('Relationship already exists', 409);
      }

      const relationship = new Relationship(relationshipData);
      const savedRelationship = await relationship.save();

      // Populate the relationship for response
      return await this.getRelationshipById(savedRelationship._id.toString());
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create relationship', 500);
    }
  }

  async getRelationshipById(id: string): Promise<IRelationship> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid relationship ID', 400);
    }

    const relationship = await Relationship.findById(id)
      .populate('from')
      .populate('to')
      .populate('relationship', 'name')
      .populate('reverseRelationship', 'name')
      .exec();

    if (!relationship) {
      throw new AppError('Relationship not found', 404);
    }

    return relationship;
  }

  async getRelationships(options: PaginationOptions, filters: any = {}): Promise<PaginatedResponse<IRelationship>> {
    const { page, limit, sort, order } = options;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (filters.from) {
      query.from = filters.from;
    }

    if (filters.to) {
      query.to = filters.to;
    }

    if (filters.fromModel) {
      query.fromModel = filters.fromModel;
    }

    if (filters.toModel) {
      query.toModel = filters.toModel;
    }

    if (filters.relationship) {
      query.relationship = filters.relationship;
    }

    // Get total count
    const total = await Relationship.countDocuments(query);

    // Get paginated results
    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const relationships = await Relationship.find(query)
      .populate('from')
      .populate('to')
      .populate('relationship', 'name')
      .populate('reverseRelationship', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data: relationships,
      pagination: {
        current: page,
        pages,
        count: relationships.length,
        total
      }
    };
  }

  async updateRelationship(id: string, updateData: Partial<IRelationship>): Promise<IRelationship> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid relationship ID', 400);
    }

    const relationship = await Relationship.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('from')
      .populate('to')
      .populate('relationship', 'name')
      .populate('reverseRelationship', 'name');

    if (!relationship) {
      throw new AppError('Relationship not found', 404);
    }

    return relationship;
  }

  async deleteRelationship(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid relationship ID', 400);
    }

    const relationship = await Relationship.findByIdAndDelete(id);

    if (!relationship) {
      throw new AppError('Relationship not found', 404);
    }
  }

  async getRelationshipsByEntity(entityId: string, entityModel: 'Person' | 'Entity'): Promise<IRelationship[]> {
    if (!mongoose.Types.ObjectId.isValid(entityId)) {
      throw new AppError('Invalid entity ID', 400);
    }

    return await Relationship.find({
      $or: [
        { from: entityId, fromModel: entityModel },
        { to: entityId, toModel: entityModel }
      ]
    })
      .populate('from')
      .populate('to')
      .populate('relationship', 'name')
      .populate('reverseRelationship', 'name')
      .exec();
  }
}
