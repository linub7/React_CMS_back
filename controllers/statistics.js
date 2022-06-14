import Category from '../models/category';
import Post from '../models/post';
import Comment from '../models/comment';
import User from '../models/user';

export const statistics = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const postsCount = await Post.countDocuments();
    const commentsCount = await Comment.countDocuments();
    const categoriesCount = await Category.countDocuments();
    res.json({
      usersCount,
      postsCount,
      commentsCount,
      categoriesCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};
