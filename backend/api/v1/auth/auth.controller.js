"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.verifyEmail = exports.resetPasswordSchema = exports.resetPassword = exports.logout = exports.loginSchema = exports.login = exports.forgotPassword = exports.forceChangePassword = exports.changePasswordSchema = void 0;
var _AuthService = require("../../../services/AuthService");
var _zod = require("zod");

const authService = new _AuthService.AuthService();

const loginSchema = exports.loginSchema = _zod.z.object({
  body: _zod.z.object({
    email: _zod.z.string().min(1, 'Username or Email is required'),
    password: _zod.z.string().min(1)
  })
});

const passwordComplexity = _zod.z.string().
min(8, 'Password must be at least 8 characters long').
regex(/[A-Z]/, 'Password must contain an uppercase letter').
regex(/[0-9]/, 'Password must contain a number').
regex(/[^A-Za-z0-9]/, 'Password must contain a special character');

const resetPasswordSchema = exports.resetPasswordSchema = _zod.z.object({
  body: _zod.z.object({
    token: _zod.z.string(),
    newPassword: passwordComplexity
  })
});

const changePasswordSchema = exports.changePasswordSchema = _zod.z.object({
  body: _zod.z.object({
    newPassword: passwordComplexity
  })
});

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const deviceInfo = req.headers['user-agent'] || 'unknown';

    const { token, user } = await authService.login(email, password, deviceInfo, ipAddress);

    // Secure cookie for web clients
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ data: { user, token } });
  } catch (error) {
    next(error);
  }
};exports.login = login;

const logout = async (req, res, next) => {
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
};exports.logout = logout;

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ data: { message: 'If the email exists, a reset link has been sent.' } });
  } catch (error) {
    next(error);
  }
};exports.forgotPassword = forgotPassword;

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};exports.resetPassword = resetPassword;

const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};exports.verifyEmail = verifyEmail;

const forceChangePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await authService.forcePasswordChange(userId, req.body.newPassword);
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};exports.forceChangePassword = forceChangePassword;