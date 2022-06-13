import User from '../models/user';
import Media from '../models/media';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';
import nanoid from 'nanoid';
import nodemailer from 'nodemailer';

require('dotenv').config();

export const signup = async (req, res) => {
  try {
    // validation
    const { name, email, password, confirm } = req.body;
    if (!name) {
      return res.json({
        error: 'Name is required',
      });
    }
    if (!email) {
      return res.json({
        error: 'Email is required',
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be 6 characters long',
      });
    }

    if (password !== confirm) {
      return res.json({
        error: 'Password and confirm password should match',
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: 'Email is taken',
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      const user = await new User({
        name,
        email,
        password: hashedPassword,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      // exclude password from response
      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if our db has user with that email
    const user = await User.findOne({ email }).populate('image', 'url');
    if (!user) {
      return res.json({
        error: 'Wrong Credentials',
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: 'Wrong Credentials',
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    user.password = undefined;
    user.secret = undefined;

    const media = await Media.findOne({ _id: user.image }).select('url');
    console.log(media);

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ error: 'User not found' });
  }
  // generate code
  const resetCode = nanoid(5).toUpperCase();
  // save to db
  user.resetCode = resetCode;
  user.save();
  // prepare email
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Password reset code',

    html: `<div style=" max-width: 700px; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px; font-family: Roboto; font-weight: 600; color: #3b5998; "><span>Reset Password</span></div><div style=" padding: 1rem 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; color: #141823; font-size: 17px; font-family: Roboto; "> <span>Hello ${user.email}</span> <div style="padding: 20px 0"> <span style="padding: 1.5rem 0" >It seems that you forgot your password, use this reset code in order to reset your password.</span > </div> <div style=" width: 200px; padding: 10px 15px; background: #4c649b; color: #fff; text-decoration: none; font-weight: 600; " > ${resetCode} </div> <br /></div>`,
  };
  // send email
  try {
    const data = await transporter.sendMail(emailData);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ ok: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;

    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    console.log(user);
    // if user not found
    if (!user) {
      return res.json({ error: 'Email or reset code is invalid' });
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be 6 characters long',
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = '';
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const currentUser = async (req, res) => {
  try {
    // const user = await User.findById(req.user._id).select('-password');
    // if (!user) {
    //   return res.json({
    //     error: 'User not found',
    //   });
    // }
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
