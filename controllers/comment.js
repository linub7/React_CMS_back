import Post from '../models/post';
import Comment from '../models/comment';
export const createComment = async (req, res) => {
  try {
    const {
      params: { postId },
      user: { _id },
      body: { content },
    } = req;
    const post = await Post.findById({ _id: postId });
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    let comment = await Comment.create({
      content,
      postedBy: _id,
      post: postId,
    });

    comment = await comment.populate('postedBy', 'name');

    post.comments.push(comment._id);
    await post.save();
    return res.json({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const {
      params: { postId, commentId },
      user: { _id },
    } = req;

    const post = await Post.findById(postId);
    if (!post) return res.json({ error: 'Post not found.' });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.json({ error: 'Comment not found.' });

    if (comment.postedBy._id.toString() !== _id.toString()) {
      return res.json({ error: 'You are not authorized.' });
    }

    await comment.remove();

    post.comments = post.comments.filter((id) => id.toString() !== commentId);
    await post.save();

    return res.json({ message: 'Comment deleted successfully.', comment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const {
      params: { postId, commentId },
      user: { _id },
      body: { content },
    } = req;

    const post = await Post.findById(postId);
    if (!post) return res.json({ error: 'Post not found.' });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.json({ error: 'Comment not found.' });

    if (comment.postedBy._id.toString() !== _id.toString()) {
      return res.json({ error: 'You are not authorized.' });
    }

    comment.content = content;
    await comment.save();

    return res.json({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getCommentsByAdmin = async (req, res) => {
  try {
    let {
      query: { page },
    } = req;
    const perPage = 6;
    page = parseInt(page, 10) || 1;
    const comments = await Comment.find()
      .populate('postedBy', 'name')
      .populate('post', 'title slug')
      .skip((page - 1) * perPage)
      .sort({ createdAt: -1 })
      .limit(perPage);
    return res.json({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCommentByAdmin = async (req, res) => {
  try {
    const {
      params: { commentId },
    } = req;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.json({ error: 'Comment not found.' });
    await comment.remove();
    const post = await Post.findOne(comment.post);
    post.comments = post.comments.filter((id) => id.toString() !== commentId);
    await post.save();
    return res.json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateCommentByAdmin = async (req, res) => {
  try {
    const {
      params: { commentId },
      body: { content },
    } = req;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.json({ error: 'Comment not found.' });
    comment.content = content;
    await comment.save();

    return res.json({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getTotalCommentsByAdmin = async (req, res) => {
  try {
    const count = await Comment.countDocuments();

    return res.json({ count });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getCommentsByUser = async (req, res) => {
  try {
    const {
      user: { _id },
    } = req;
    const comments = await Comment.find({ postedBy: _id })
      .populate('post', 'title slug')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    return res.json({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
