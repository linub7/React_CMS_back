import Post from '../models/post';
import Category from '../models/category';
import cloudinary from 'cloudinary';
import slugify from 'slugify';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    const {
      body: { image },
    } = req;
    const result = await cloudinary.v2.uploader.upload(image);
    res.json({
      url: result.url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      body: { title, content, categories, published },
      user: { _id },
    } = req;
    const slug = slugify(title, { lower: true });

    const existingPost = await Post.findOne({ slug });

    if (existingPost) return res.json({ error: 'Title is already taken.' });

    // get category ids based on category names
    let ids = [];
    for (let index = 0; index < categories.length; index++) {
      const category = await Category.findOne({
        name: categories[index],
      });
      ids.push(category._id);
    }

    // save post, in order to get the ids of categories we have to use setTimeout.
    setTimeout(async () => {
      try {
        const post = await Post.create({
          title,
          content,
          categories: ids,
          published,
          postedBy: _id,
        });
        res.json({ post });
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('postedBy', '_id name')
      .populate('categories')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const {
      params: { postId },
    } = req;
    const post = await Post.findById({ _id: postId });
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    await post.remove();
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
