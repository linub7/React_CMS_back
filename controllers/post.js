import Post from '../models/post';
import User from '../models/user';
import Category from '../models/category';
import Media from '../models/media';
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const uploadImageFile = async (req, res) => {
  try {
    // we can't access req.body => because this is a formData
    // but we have req.files that provided by formidable
    const {
      files: {
        file: { path },
      },
    } = req;
    const result = await cloudinary.v2.uploader.upload(path);
    console.log(result);
    const media = await Media.create({
      url: result.url,
      public_id: result.public_id,
      postedBy: req.user._id,
    });
    console.log(media);
    res.json(media);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      body: { title, content, categories, published, featuredImage },
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
          ...req.body,
          title,
          content,
          categories: ids,
          published,
          postedBy: _id,
        });

        // push the postId to user's posts array
        await User.findByIdAndUpdate(
          _id,
          { $addToSet: { posts: post._id } },
          { new: true }
        );
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
      .populate('featuredImage')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const {
      params: { slug },
    } = req;
    const post = await Post.findOne({ slug })
      .populate('postedBy', '_id name')
      .populate('categories', 'name slug')
      .populate('featuredImage', 'url');

    if (!post) return res.status(404).json({ error: 'Post not found.' });

    res.json({ post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const {
      params: { postId },
      body: { title, content, categories, published, featuredImage },
    } = req;
    const post = await Post.findById(postId);
    if (!post) return res.json({ error: 'Post not found.' });

    let ids = [];
    for (let index = 0; index < categories.length; index++) {
      const category = await Category.findOne({
        name: categories[index],
      });
      ids.push(category._id);
    }

    const slug = slugify(title, { lower: true });

    setTimeout(async () => {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          content,
          categories: ids,
          published,
          featuredImage,
          slug,
        },
        { new: true }
      )
        .populate('postedBy', '_id name')
        .populate('categories', 'name slug')
        .populate('featuredImage', 'url');

      res.json({ updatedPost });
    }, 1000);
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

export const getMedia = async (req, res) => {
  try {
    const media = await Media.find()
      .populate('postedBy', '_id name')
      .sort('-createdAt');
    res.json(media);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getAuthorMedia = async (req, res) => {
  try {
    const {
      user: { _id },
    } = req;
    const media = await Media.find({ postedBy: _id })
      .populate('postedBy', '_id name')
      .sort('-createdAt');
    res.json(media);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const removeMedia = async (req, res) => {
  try {
    const {
      params: { mediaId },
    } = req;
    const media = await Media.findById({ _id: mediaId });
    if (!media) return res.status(404).json({ error: 'Media not found.' });
    await media.remove();
    res.json({ ok: true, message: 'Media deleted successfully.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getAuthorPosts = async (req, res) => {
  try {
    const {
      user: { _id },
    } = req;
    const posts = await Post.find({ postedBy: _id })
      .populate('postedBy', '_id name')
      .populate('categories')
      .populate('featuredImage')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
