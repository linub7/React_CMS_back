import User from '../models/user';
import Post from '../models/post';
import validator from 'email-validator';
import nodemailer from 'nodemailer';
import { hashPassword } from '../helpers/auth';

export const createUser = async (req, res) => {
  try {
    const {
      body: { name, email, password, role, checked, website },
    } = req;
    const isValidEmail = validator.validate(email);

    if (!name) return res.json({ error: 'Name is required' });
    if (!email) return res.json({ error: 'Email is required' });
    if (!isValidEmail) return res.json({ error: 'Email is invalid' });
    if (!password || password.length < 6)
      return res.json({
        error: 'Password is required & should be at least 6 characters',
      });

    const existUser = await User.findOne({ email });
    if (existUser) return res.json({ error: 'User already exists' });

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'User created',
      html: `<div style=" max-width: 700px; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px; font-family: Roboto; font-weight: 600; color: #191a19; "> <span>Create Account</span></div><div style=" padding: 1rem 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; color: #141823; font-size: 17px; font-family: Roboto; "> <span>Hello ${email}</span> <div style="padding: 20px 0"> <span style="padding: 1.5rem 0"> Your account has been created. Please write this password and delete this email. You can change your password after you login. </span> </div> <div style=" width: 200px; padding: 10px 15px; background: #171816; color: #fff; text-decoration: none; font-weight: 600; " > Your Email: ${email} Your Password: ${password} Your role: ${
        role !== '' ? role : 'Subscriber'
      } </div> <br /></div>`,
    };

    if (checked) {
      await transporter.sendMail(emailData);
    }

    // hash password
    const encryptedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
      role: role !== '' ? role : 'Subscriber',
      website,
    });

    return res.json({
      ok: true,
      message: checked
        ? 'Your account details have been sent to your email, please check your inbox!'
        : null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -secret -resetCode')
      .populate('posts')
      .sort({ createdAt: -1 });

    return res.json({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const {
      user: { _id },
      params: { userId },
    } = req;
    const user = await User.findById(userId);
    if (!user) return res.json({ error: 'User not found' });
    if (user._id.toString() === _id.toString())
      return res.json({ error: 'You cannot delete yourself' });
    if (user.role === 'admin')
      return res.json({ error: 'You cannot delete an admin' });
    await user.remove();
    return res.json({ message: 'User deleted Successfully', user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
