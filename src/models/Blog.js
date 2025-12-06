import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const Blog = mongoose.model('Blog', blogSchema);


