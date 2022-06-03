import mongoose from 'mongoose';
import slugify from 'slugify';
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.model('Category', categorySchema);
