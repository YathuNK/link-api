import { connectDB } from './db';
import { User } from '../user/model';

export async function seedUsers() {
  try {
    await connectDB();
    
    // Example users to seed - replace with actual users
    const users = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        isActive: true,
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      }
    }
    
    console.log('✅ User seeding completed');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedUsers().then(() => process.exit(0));
}
