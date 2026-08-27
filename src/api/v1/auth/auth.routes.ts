import { Router } from 'express';
import { login, logout, forgotPassword, resetPassword, verifyEmail, loginSchema, forceChangePassword, resetPasswordSchema, changePasswordSchema } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/sessionValidator';
import { authLimiter } from '../../middlewares/rateLimiter';

const authRouter = Router();

authRouter.post('/login', authLimiter, validateRequest(loginSchema), login);
authRouter.post('/logout', logout);
authRouter.post('/forgot-password', authLimiter, forgotPassword);
authRouter.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/change-password', requireAuth, validateRequest(changePasswordSchema), forceChangePassword);

export default authRouter;
