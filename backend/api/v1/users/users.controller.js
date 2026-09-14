"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.setupProfile = exports.listUsers = exports.createUser = void 0;
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _UserRepository = require("../../../repositories/UserRepository");
var _AuditService = require("../../../services/AuditService");
var _client = require("@prisma/client");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const userRepo = new _UserRepository.UserRepository();

const createUser = async (req, res, next) => {
  try {
    const { email, password, role, isActive, requiresPasswordChange } = req.body;
    const operatorId = req.user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    // Hash the password
    const passwordHash = await _bcrypt.default.hash(password, 10);

    const newUser = await userRepo.create({
      email,
      passwordHash,
      role,
      isActive,
      requiresPasswordChange: requiresPasswordChange !== undefined ? requiresPasswordChange : true,
      isVerified: true // Assuming admins creating users auto-verify them
    });

    await _AuditService.auditService.log({
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
    if (error instanceof _client.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: { message: 'User with this email already exists' } });
    }
    next(error);
  }
};exports.createUser = createUser;

const listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    const where = {};
    if (role) {
      where.role = role;
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
    const safeUsers = users.map((u) => {
      const { passwordHash: _, ...rest } = u;
      return rest;
    });

    // To get total count, we would add count to the repository, but for now we can just return the data.
    res.json({ data: safeUsers, meta: { page, limit } });
  } catch (error) {
    next(error);
  }
};exports.listUsers = listUsers;

const setupProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const { password, name, nationalId, phone, alternatePhone, address } = req.body;

    const updateData = {
      name,
      nationalId,
      phone,
      alternatePhone,
      address,
      requiresPasswordChange: false
    };

    if (password) {
      updateData.passwordHash = await _bcrypt.default.hash(password, 10);
    }

    const updatedUser = await userRepo.update(userId, updateData);

    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json({ data: safeUser });
  } catch (error) {
    next(error);
  }
};exports.setupProfile = setupProfile;