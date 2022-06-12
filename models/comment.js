import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true, maxlength: 2000 },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
