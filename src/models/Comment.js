import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export const Comment = mongoose.model('Comment', commentSchema);


