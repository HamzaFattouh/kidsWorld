import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { UserRepository } from '../../../repositories/UserRepository';
import { auditService } from '../../../services/AuditService';
import { Prisma } from '@prisma/client';

const userRepo = new UserRepository();

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role, isActive, requiresPasswordChange } = req.body;
    const operatorId = (req as any).user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userRepo.create({
      email,
      passwordHash,
      role,
      isActive,
      requiresPasswordChange: requiresPasswordChange !== undefined ? requiresPasswordChange : true,
      isVerified: true, // Assuming admins creating users auto-verify them
    });

    await auditService.log({
      action: 'USER_CREATED',
      userId: operatorId,
      resource: 'User',
      resourceId: newUser.id,
      ipAddress,
      details: `Created user ${email} with role ${role}`
    });

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ data: safeUser });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: { message: 'User with this email already exists' } });
    }
    next(error);
  }
};

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (role) {
      where.role = role as any;
    }
    if (search) {
      where.email = { contains: search };
    }

    const users = await userRepo.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    
    // Omit passwordHash
    const safeUsers = users.map(u => {
      const { passwordHash: _, ...rest } = u;
      return rest;
    });

    // To get total count, we would add count to the repository, but for now we can just return the data.
    res.json({ data: safeUsers, meta: { page, limit } });
  } catch (error) {
    next(error);
  }
};

export const setupProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const { password, name, nationalId, phone, alternatePhone, address } = req.body;
    
    const updateData: any = {
      name,
      nationalId,
      phone,
      alternatePhone,
      address,
      requiresPasswordChange: false,
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userRepo.update(userId, updateData);
    
    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json({ data: safeUser });
  } catch (error) {
    next(error);
  }
};
