import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../services/AuthService';
import { z } from 'zod';

const authService = new AuthService();

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const passwordComplexity = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character');

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: passwordComplexity,
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    newPassword: passwordComplexity,
  }),
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    const { token, user } = await authService.login(email, password, deviceInfo, ipAddress);

    // Secure cookie for web clients
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ data: { user, token } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      await authService.logout(token);
    }
    res.clearCookie('token');
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ data: { message: 'If the email exists, a reset link has been sent.' } });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};

export const forceChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    await authService.forcePasswordChange(userId, req.body.newPassword);
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};
