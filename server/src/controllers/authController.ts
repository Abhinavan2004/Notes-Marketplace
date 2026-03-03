import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { sendOtpEmail } from '../utils/email';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

const OTP_EXPIRY_MINUTES = 5;

const setRefreshTokenCookie = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashed = await hashPassword(password);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashed,
      isVerified: false,
      otpCode: otp,
      otpExpiresAt,
    });

    await sendOtpEmail(user.email, otp);

    return res.status(201).json({
      message: 'Signup successful, please verify OTP sent to your email',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to sign up' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP found for this user' });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.userId);
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    setRefreshTokenCookie(res, newRefreshToken);

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        await User.findByIdAndUpdate(payload.userId, { $inc: { tokenVersion: 1 } });
      } catch {
        // ignore token errors on logout
      }
    }

    res.clearCookie('refreshToken', {
      path: '/api/auth/refresh',
    });

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to logout' });
  }
};

