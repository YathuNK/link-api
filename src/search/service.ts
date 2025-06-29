import { Person } from '../person/model';
import { Entity } from '../entity/model';
import { Place } from '../place/model';
import { AppError, PaginationOptions } from '../types/common';

export interface SearchResult {
  type: 'person' | 'entity' | 'place';
  data: any;
  score?: number;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  pagination: {
    current: number;
    pages: number;
    count: number;
    total: number;
  };
}

export class SearchService {
  async globalSearch(query: string, options: PaginationOptions): Promise<SearchResponse> {
    if (!query || query.trim().length === 0) {
      throw new AppError('Search query is required', 400);
    }

    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const searchRegex = { $regex: query, $options: 'i' };
    
    // Search in parallel
    const [persons, entities, places] = await Promise.all([
      Person.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { description: searchRegex }
        ]
      }).populate('place', 'name'),
      
      Entity.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).populate('type', 'name').populate('place', 'name'),
      
      Place.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      })
    ]);

    // Combine results with type information
    const results: SearchResult[] = [
      ...persons.map(person => ({ type: 'person' as const, data: person })),
      ...entities.map(entity => ({ type: 'entity' as const, data: entity })),
      ...places.map(place => ({ type: 'place' as const, data: place }))
    ];

    // Sort by relevance (simple implementation - can be enhanced)
    results.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a.data, query);
      const scoreB = this.calculateRelevanceScore(b.data, query);
      return scoreB - scoreA;
    });

    // Apply pagination
    const total = results.length;
    const paginatedResults = results.slice(skip, skip + limit);
    const pages = Math.ceil(total / limit);

    return {
      success: true,
      results: paginatedResults,
      pagination: {
        current: page,
        pages,
        count: paginatedResults.length,
        total
      }
    };
  }

  async filteredSearch(filters: any, options: PaginationOptions): Promise<SearchResponse> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    let results: SearchResult[] = [];

    // Search by type
    if (filters.type === 'person') {
      const query: any = {};
      if (filters.place) query.place = filters.place;
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const persons = await Person.find(query).populate('place', 'name');
      results = persons.map(person => ({ type: 'person' as const, data: person }));

    } else if (filters.type === 'entity') {
      const query: any = {};
      if (filters.place) query.place = filters.place;
      if (filters.entityType) query.type = filters.entityType;
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const entities = await Entity.find(query)
        .populate('type', 'name')
        .populate('place', 'name');
      results = entities.map(entity => ({ type: 'entity' as const, data: entity }));

    } else if (filters.type === 'place') {
      const query: any = {};
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const places = await Place.find(query);
      results = places.map(place => ({ type: 'place' as const, data: place }));
    }

    // Apply pagination
    const total = results.length;
    const paginatedResults = results.slice(skip, skip + limit);
    const pages = Math.ceil(total / limit);

    return {
      success: true,
      results: paginatedResults,
      pagination: {
        current: page,
        pages,
        count: paginatedResults.length,
        total
      }
    };
  }

  private calculateRelevanceScore(item: any, query: string): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Check if query matches at the beginning of name/firstName (higher score)
    const name = item.name || item.firstName || '';
    if (name.toLowerCase().startsWith(lowerQuery)) {
      score += 10;
    } else if (name.toLowerCase().includes(lowerQuery)) {
      score += 5;
    }

    // Check other fields
    if (item.lastName && item.lastName.toLowerCase().includes(lowerQuery)) {
      score += 3;
    }

    if (item.description && item.description.toLowerCase().includes(lowerQuery)) {
      score += 2;
    }

    return score;
  }
}
