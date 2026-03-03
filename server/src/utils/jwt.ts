import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';

const ACCESS_TOKEN_TTL = (process.env.ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn']) || '15m';
const REFRESH_TOKEN_TTL = (process.env.REFRESH_TOKEN_TTL as jwt.SignOptions['expiresIn']) || '7d';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT secrets are not configured');
}

export interface JwtPayload {
  userId: string;
  role: string;
  tokenVersion: number;
}

export const signAccessToken = (user: IUser) => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_TTL };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

export const signRefreshToken = (user: IUser) => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_TTL };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};

