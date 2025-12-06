import { Blog } from '../models/Blog.js';
import { validationResult } from 'express-validator';

function normalizePayload(body) {
  const tags = Array.isArray(body.tags)
    ? body.tags
    : (typeof body.tags === 'string' && body.tags.length
        ? body.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []);
  return {
    title: body.title,
    image: body.image || '',
    description: body.description,
    content: body.content,
    author: body.author,
    tags,
    published: typeof body.published === 'boolean' ? body.published : true,
  };
}

export async function createBlog(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const payload = normalizePayload(req.body);
    const blog = await Blog.create(payload);
    res.status(201).json(blog);
  } catch (err) {
    const message = err?.message || 'Failed to create blog';
    res.status(400).json({ message });
  }
}

export async function updateBlog(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const payload = normalizePayload(req.body);
    const updated = await Blog.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Blog not found' });
    res.json(updated);
  } catch (err) {
    const message = err?.message || 'Failed to update blog';
    res.status(400).json({ message });
  }
}

export async function deleteBlog(req, res) {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err?.message || 'Failed to delete blog' });
  }
}

export async function listAll(req, res) {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  res.json(blogs);
}


