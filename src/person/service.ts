import { Person, IPerson } from './model';
import { AppError, PaginationOptions, PaginatedResponse } from '../types/common';
import mongoose from 'mongoose';

export class PersonService {
  async createPerson(personData: Partial<IPerson>): Promise<IPerson> {
    try {
      const person = new Person(personData);
      return await person.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Person already exists', 409);
      }
      throw new AppError('Failed to create person', 500);
    }
  }

  async getPersonById(id: string): Promise<IPerson> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid person ID', 400);
    }

    const person = await Person.findById(id)
      .populate('place', 'name description')
      .exec();

    if (!person) {
      throw new AppError('Person not found', 404);
    }

    return person;
  }

  async getPersons(options: PaginationOptions, filters: any = {}): Promise<PaginatedResponse<IPerson>> {
    const { page, limit, sort, order } = options;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.place) {
      query.place = filters.place;
    }

    // Get total count
    const total = await Person.countDocuments(query);

    // Get paginated results
    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const persons = await Person.find(query)
      .populate('place', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const pages = Math.ceil(total / limit);

    return {
      success: true,
      data: persons,
      pagination: {
        current: page,
        pages,
        count: persons.length,
        total
      }
    };
  }

  async updatePerson(id: string, updateData: Partial<IPerson>): Promise<IPerson> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid person ID', 400);
    }

    const person = await Person.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('place', 'name description');

    if (!person) {
      throw new AppError('Person not found', 404);
    }

    return person;
  }

  async deletePerson(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid person ID', 400);
    }

    const person = await Person.findByIdAndDelete(id);

    if (!person) {
      throw new AppError('Person not found', 404);
    }
  }

  async getPersonsByPlace(placeId: string): Promise<IPerson[]> {
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      throw new AppError('Invalid place ID', 400);
    }

    return await Person.find({ place: placeId })
      .populate('place', 'name description')
      .exec();
  }
}
