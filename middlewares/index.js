require('dotenv').config();
import User from '../models/user';
import Post from '../models/post';
import Media from '../models/media';
import expressJwt from 'express-jwt';

// req.user = _id
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

export const requireAdmin = async (req, res, next) => {
  try {
    // another way to authorize admin
    // if (req.headers.authorization) {
    //   const token = req.headers.authorization.split(' ')[1];
    //   const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    //   const user = await User.findById(decoded._id);
    //   if (user.role.toString() === 'admin') {
    //     next();
    //   } else {
    //     return res.status(403).json({
    //       error: 'You are not admin',
    //     });
    //   }
    // }
    const user = await User.findById(req.user._id);
    if (user.role.toString() !== 'admin') {
      return res.status(403).json({
        error: 'Access denied! You are not an admin',
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export const requireAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role.toString() !== 'author') {
      return res.status(403).json({
        error: 'Access denied! You are not an author',
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

//
export const canCreateAndRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case 'admin':
        next();
        break;
      case 'author':
        next();
        break;

      default:
        return res.status(403).json({ error: 'UnAuthorized' });
    }
  } catch (err) {
    console.log(err);
  }
};

export const canCreateAndReadWithSubscriber = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case 'admin':
        next();
        break;
      case 'author':
        next();
        break;
      case 'Subscriber':
        next();
        break;

      default:
        return res.status(403).json({ error: 'UnAuthorized' });
    }
  } catch (err) {
    console.log(err);
  }
};

export const canUpdateAndDeletePost = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.postId);

    switch (user.role) {
      case 'admin':
        next();
        break;
      case 'author':
        // because of we are using `===` we have to convert both sides to string.
        // we can also use == without .toString() in the sides.
        post.postedBy.toString() !== user._id.toString()
          ? res.status(403).json({ error: 'UnAuthorized' })
          : next();
        break;

      default:
        return res.status(403).json({ error: 'UnAuthorized' });
    }
  } catch (err) {
    console.log(err);
  }
};

export const canDeleteMedia = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const media = await Media.findById(req.params.mediaId);

    switch (user.role) {
      case 'admin':
        next();
        break;
      case 'author':
        media.postedBy.toString() !== user._id.toString()
          ? res.status(403).json({ error: 'UnAuthorized' })
          : next();
        break;

      default:
        return res.status(403).json({ error: 'UnAuthorized' });
    }
  } catch (err) {
    console.log(err);
  }
};
