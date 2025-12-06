import { Blog } from '../models/Blog.js';

export async function listBlogs(req, res) {
  const { page = 1, limit = 10, q } = req.query;
  const filter = { published: true };
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('title image description author createdAt tags')
      .lean(),
    Blog.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

export async function getBlogById(req, res) {
  const blog = await Blog.findById(req.params.id).lean();
  if (!blog || !blog.published) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
}


