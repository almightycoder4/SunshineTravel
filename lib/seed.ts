import connectToDatabase from './mongodb';
import Job from '@/models/Job';
import User from '@/models/User';
import { jobs } from './jobs';
import { hash } from 'bcrypt';

export async function seedJobs() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Check if jobs collection is empty
    const jobCount = await Job.countDocuments();
    
    if (jobCount === 0) {
      console.log('Seeding jobs collection...');
      
      // Prepare jobs data (convert id to MongoDB format)
      const jobsData = jobs.map(job => {
        // Remove the id field as MongoDB will create its own _id
        const { id, ...jobWithoutId } = job;
        return jobWithoutId;
      });

      // Insert jobs
      await Job.insertMany(jobsData);
      console.log(`${jobsData.length} jobs seeded successfully`);
    } else {
      console.log(`Jobs collection already has ${jobCount} documents. Skipping seed.`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error seeding jobs:', error);
    return { success: false, error };
  }
}

export async function seedAdminUser() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@sunshine.com' });
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      // Hash password
      const hashedPassword = await hash('password123', 10);
      
      // Create admin user
      await User.create({
        name: 'Admin',
        email: 'admin@sunshine.com',
        password: hashedPassword,
        role: 'admin',
      });
      
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists. Skipping creation.');
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error };
  }
}