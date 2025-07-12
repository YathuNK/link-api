import { Place, IPlace } from './model';
import { AppError, PaginationOptions, PaginatedResponse } from '../types/common';
import mongoose from 'mongoose';

export class PlaceService {
  async createPlace(placeData: any): Promise<IPlace> {
    try {
      // Clean up region field - convert empty string to undefined
      if (placeData.region === '' || placeData.region === null) {
        delete placeData.region;
      }

      // Validate region if provided
      if (placeData.region && !mongoose.Types.ObjectId.isValid(placeData.region.toString())) {
        throw new AppError('Invalid region ID', 400);
      }

      // Check if region exists
      if (placeData.region) {
        const regionExists = await Place.findById(placeData.region);
        if (!regionExists) {
          throw new AppError('Region not found', 404);
        }
      }

      const place = new Place(placeData);
      return await place.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Place already exists', 409);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create place', 500);
    }
  }

  async getPlaceById(id: string): Promise<IPlace> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid place ID', 400);
    }

    const place = await Place.findById(id).populate('region').exec();

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

    // Filter by region
    if (filters.region) {
      if (mongoose.Types.ObjectId.isValid(filters.region)) {
        query.region = filters.region;
      }
    }

    // Get total count
    const total = await Place.countDocuments(query);

    // Get paginated results
    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const places = await Place.find(query)
      .populate('region')
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

  async updatePlace(id: string, updateData: any): Promise<IPlace> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid place ID', 400);
    }

    // Clean up region field - convert empty string to undefined
    if (updateData.region === '' || updateData.region === null) {
      delete updateData.region;
    }

    // Validate region if being updated
    if (updateData.region && !mongoose.Types.ObjectId.isValid(updateData.region.toString())) {
      throw new AppError('Invalid region ID', 400);
    }

    // Check if region exists
    if (updateData.region) {
      const regionExists = await Place.findById(updateData.region);
      if (!regionExists) {
        throw new AppError('Region not found', 404);
      }

      // Prevent circular reference (a place cannot be its own region)
      if (updateData.region.toString() === id) {
        throw new AppError('A place cannot be its own region', 400);
      }
    }

    const place = await Place.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('region');

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

  // Get places by region
  async getPlacesByRegion(regionId: string, options: PaginationOptions): Promise<PaginatedResponse<IPlace>> {
    if (!mongoose.Types.ObjectId.isValid(regionId)) {
      throw new AppError('Invalid region ID', 400);
    }

    const filters = { region: regionId };
    return this.getPlaces(options, filters);
  }

  // Get sub-places (places that have this place as their region)
  async getSubPlaces(placeId: string, options: PaginationOptions): Promise<PaginatedResponse<IPlace>> {
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      throw new AppError('Invalid place ID', 400);
    }

    const filters = { region: placeId };
    return this.getPlaces(options, filters);
  }

  // Check if a place can be deleted (no sub-places)
  async canDeletePlace(placeId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      throw new AppError('Invalid place ID', 400);
    }

    const subPlacesCount = await Place.countDocuments({ region: placeId });
    return subPlacesCount === 0;
  }
}
