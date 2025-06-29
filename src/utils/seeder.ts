import mongoose from 'mongoose';
import { config } from '../config/config';
import { Person } from '../person/model';
import { Entity } from '../entity/model';
import { Place } from '../place/model';
import { EntityType } from '../entity-type/model';
import { RelationshipType } from '../relationship-type/model';
import { Relationship } from '../relationship/model';

const sampleData = {
  places: [
    { _id: new mongoose.Types.ObjectId(), name: 'Erlalai', description: 'A place in Northern Sri Lanka' },
    { _id: new mongoose.Types.ObjectId(), name: 'Moratuwa', description: 'A city in Western Province, Sri Lanka' },
    { _id: new mongoose.Types.ObjectId(), name: 'Jaffna', description: 'Northern capital of Sri Lanka' },
    { _id: new mongoose.Types.ObjectId(), name: 'Kaarainagar', description: 'A place in Northern Sri Lanka' }
  ],

  entityTypes: [
    { _id: new mongoose.Types.ObjectId(), name: 'Company', description: 'Business organization' },
    { _id: new mongoose.Types.ObjectId(), name: 'Shop', description: 'Retail establishment' }
  ],

  relationshipTypes: [
    { _id: new mongoose.Types.ObjectId(), name: 'brother' },
    { _id: new mongoose.Types.ObjectId(), name: 'parent' },
    { _id: new mongoose.Types.ObjectId(), name: 'child' },
    { _id: new mongoose.Types.ObjectId(), name: 'friend' },
    { _id: new mongoose.Types.ObjectId(), name: 'works at' },
    { _id: new mongoose.Types.ObjectId(), name: 'employee' }
  ]
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Person.deleteMany({}),
      Entity.deleteMany({}),
      Place.deleteMany({}),
      EntityType.deleteMany({}),
      RelationshipType.deleteMany({}),
      Relationship.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed Places
    await Place.insertMany(sampleData.places);
    console.log('📍 Seeded places');

    // Seed Entity Types
    await EntityType.insertMany(sampleData.entityTypes);
    console.log('🏷️  Seeded entity types');

    // Seed Relationship Types
    await RelationshipType.insertMany(sampleData.relationshipTypes);
    console.log('🔗 Seeded relationship types');

    // Find place IDs for reference
    const erlalai = sampleData.places.find(p => p.name === 'Erlalai')?._id;
    const moratuwa = sampleData.places.find(p => p.name === 'Moratuwa')?._id;
    const jaffna = sampleData.places.find(p => p.name === 'Jaffna')?._id;
    const kaarainagar = sampleData.places.find(p => p.name === 'Kaarainagar')?._id;

    // Find entity type IDs
    const companyType = sampleData.entityTypes.find(t => t.name === 'Company')?._id;

    // Seed Persons
    const persons = [
      { _id: new mongoose.Types.ObjectId(), firstName: 'Yathurshan', lastName: 'Kalanantharasan', description: 'me', place: erlalai },
      { _id: new mongoose.Types.ObjectId(), firstName: 'Mithurshan', lastName: 'Kalanantharasan', description: 'brother', place: erlalai },
      { _id: new mongoose.Types.ObjectId(), firstName: 'Kalanantharasan', place: erlalai },
      { _id: new mongoose.Types.ObjectId(), firstName: 'Nilaxshan', place: erlalai },
      { _id: new mongoose.Types.ObjectId(), firstName: 'Aathi', place: erlalai },
      { _id: new mongoose.Types.ObjectId(), firstName: 'Sivapriyan', place: kaarainagar },
      { _id: new mongoose.Types.ObjectId(), firstName: 'Thuvaragan', place: undefined }
    ];

    await Person.insertMany(persons);
    console.log('👤 Seeded persons');

    // Seed Entities
    const entities = [
      { _id: new mongoose.Types.ObjectId(), name: 'Mitra Innovation', type: companyType, websites: ['https://mitrai.com/'], place: moratuwa },
      { _id: new mongoose.Types.ObjectId(), name: 'Invorg', type: companyType, place: jaffna },
      { _id: new mongoose.Types.ObjectId(), name: 'GTN Globals', type: companyType }
    ];

    await Entity.insertMany(entities);
    console.log('🏢 Seeded entities');

    // Find relationship type IDs
    const brotherType = sampleData.relationshipTypes.find(t => t.name === 'brother')?._id;
    const parentType = sampleData.relationshipTypes.find(t => t.name === 'parent')?._id;
    const childType = sampleData.relationshipTypes.find(t => t.name === 'child')?._id;
    const friendType = sampleData.relationshipTypes.find(t => t.name === 'friend')?._id;
    const worksAtType = sampleData.relationshipTypes.find(t => t.name === 'works at')?._id;
    const employeeType = sampleData.relationshipTypes.find(t => t.name === 'employee')?._id;

    // Find person and entity IDs
    const me = persons.find(p => p.firstName === 'Yathurshan')?._id;
    const mithu = persons.find(p => p.firstName === 'Mithurshan')?._id;
    const father = persons.find(p => p.firstName === 'Kalanantharasan')?._id;
    const sana = persons.find(p => p.firstName === 'Nilaxshan')?._id;
    const aathi = persons.find(p => p.firstName === 'Aathi')?._id;
    const thuvaragan = persons.find(p => p.firstName === 'Thuvaragan')?._id;

    const mitra = entities.find(e => e.name === 'Mitra Innovation')?._id;
    const invorg = entities.find(e => e.name === 'Invorg')?._id;

    // Seed Relationships
    const relationships = [
      { from: me, to: mithu, fromModel: 'Person', toModel: 'Person', relationship: brotherType, reverseRelationship: brotherType },
      { from: me, to: father, fromModel: 'Person', toModel: 'Person', relationship: childType, reverseRelationship: parentType },
      { from: me, to: sana, fromModel: 'Person', toModel: 'Person', relationship: friendType, reverseRelationship: friendType },
      { from: sana, to: aathi, fromModel: 'Person', toModel: 'Person', relationship: brotherType, reverseRelationship: brotherType },
      { from: mithu, to: thuvaragan, fromModel: 'Person', toModel: 'Person', relationship: friendType, reverseRelationship: friendType },
      { from: me, to: mitra, fromModel: 'Person', toModel: 'Entity', relationship: worksAtType, reverseRelationship: employeeType },
      { from: mithu, to: invorg, fromModel: 'Person', toModel: 'Entity', relationship: worksAtType, reverseRelationship: employeeType }
    ];

    await Relationship.insertMany(relationships);
    console.log('🔗 Seeded relationships');

    console.log('✅ Database seeded successfully!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`Places: ${await Place.countDocuments()}`);
    console.log(`Entity Types: ${await EntityType.countDocuments()}`);
    console.log(`Relationship Types: ${await RelationshipType.countDocuments()}`);
    console.log(`Persons: ${await Person.countDocuments()}`);
    console.log(`Entities: ${await Entity.countDocuments()}`);
    console.log(`Relationships: ${await Relationship.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
