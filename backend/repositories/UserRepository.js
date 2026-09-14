"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.UserRepository = void 0;var _prisma = require("../core/prisma");



class UserRepository {
  async create(data) {
    return _prisma.prisma.user.create({ data });
  }
  async findByEmail(email) {
    return _prisma.prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return _prisma.prisma.user.findUnique({ where: { id } });
  }

  async update(id, data) {
    return _prisma.prisma.user.update({ where: { id }, data });
  }

  async findMany(options) {
    return _prisma.prisma.user.findMany({
      where: options.where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy
    });
  }
}exports.UserRepository = UserRepository;