import mongoose from 'mongoose';
const { Schema } = mongoose;

const websiteSchema = new Schema(
  {
    page: {
      type: String,
      lowercase: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    fullWidthImage: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Website', websiteSchema);
