require('dotenv').config();
import User from '../models/user';
import expressJwt from 'express-jwt';
import Jwt from 'jsonwebtoken';

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
