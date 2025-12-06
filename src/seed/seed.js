import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Blog } from '../models/Blog.js';
import { connectToDatabase } from '../utils/db.js';

async function run() {
  await connectToDatabase();

  await Promise.all([User.deleteMany({}), Blog.deleteMany({})]);

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  const [admin, user] = await User.create([
    { username: 'admin', email: 'admin@example.com', password: adminPassword, role: 'admin' },
    { username: 'johndoe', email: 'john@example.com', password: userPassword, role: 'user' }
  ]);

  await Blog.create([
    {
      title: 'Welcome to the Blog',
      image: '',
      description: 'An intro to our new platform',
      content: 'Full content of the intro blog post',
      author: admin.username,
      tags: ['intro', 'welcome'],
      published: true
    },
    {
      title: 'Second Post',
      image: '',
      description: 'Another example post',
      content: 'Rich text content goes here... ',
      author: user.username,
      tags: ['example'],
      published: true
    }
  ]);

  console.log('Seeded users and blogs');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


