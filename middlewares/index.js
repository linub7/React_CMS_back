import User from '../models/user';
import expressJwt from 'express-jwt';

// req.user = _id
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

export const requireAdmin = async (req, res, next) => {
  try {
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
