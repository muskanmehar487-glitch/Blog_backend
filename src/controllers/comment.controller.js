import { Comment } from '../models/Comment.js';

export async function addComment(req, res) {
  const { blogId, content } = req.body;
  const comment = await Comment.create({ blogId, userId: req.user.id, content });
  res.status(201).json(comment);
}

export async function getCommentsForBlog(req, res) {
  const { blogId } = req.params;
  const comments = await Comment.find({ blogId }).sort({ createdAt: -1 }).lean();
  res.json(comments);
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (req.user.role !== 'admin' && comment.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  await Comment.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
}

export async function updateComment(req, res) {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
  comment.content = req.body.content;
  await comment.save();
  res.json(comment);
}


