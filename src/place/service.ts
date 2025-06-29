import { Place, IPlace } from './model';
import { AppError, PaginationOptions, PaginatedResponse } from '../types/common';
import mongoose from 'mongoose';

export class PlaceService {
  async createPlace(placeData: Partial<IPlace>): Promise<IPlace> {
    try {
      const place = new Place(placeData);
      return await place.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Place already exists', 409);
      }
      throw new AppError('Failed to create place', 500);
    }
  }

  async getPlaceById(id: string): Promise<IPlace> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid place ID', 400);
    }

    const place = await Place.findById(id).exec();

    if (!place) {
      throw new AppError('Place not found', 404);
    }

    return place;
  }

  async getPlaces(options: PaginationOptions, filters: any = {}): Promise<PaginatedResponse<IPlace>> {
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
    const total = await Place.countDocuments(query);

    // Get paginated results
    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const places = await Place.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data: places,
      pagination: {
        current: page,
        pages,
        count: places.length,
        total
      }
    };
  }

  async updatePlace(id: string, updateData: Partial<IPlace>): Promise<IPlace> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid place ID', 400);
    }

    const place = await Place.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!place) {
      throw new AppError('Place not found', 404);
    }

    return place;
  }

  async deletePlace(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid place ID', 400);
    }

    const place = await Place.findByIdAndDelete(id);

    if (!place) {
      throw new AppError('Place not found', 404);
    }
  }
}
