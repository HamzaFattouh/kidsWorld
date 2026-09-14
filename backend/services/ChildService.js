"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ChildService = void 0;var _ChildRepository = require("../repositories/ChildRepository");
var _ClassRepository = require("../repositories/ClassRepository");
var _ContactRepository = require("../repositories/ContactRepository");
var _AppError = require("../core/errors/AppError");


class ChildService {
  constructor(
  childRepo = new _ChildRepository.ChildRepository(),
  classRepo = new _ClassRepository.ClassRepository(),
  contactRepo = new _ContactRepository.ContactRepository())
  {this.childRepo = childRepo;this.classRepo = classRepo;this.contactRepo = contactRepo;}

  async createChild(data) {
    const classInfo = await this.classRepo.findById(data.classId);
    if (!classInfo) throw new _AppError.ValidationError('Class not found');

    const count = await this.childRepo.countByClass(data.classId);
    if (count >= classInfo.capacity) throw new _AppError.ValidationError('Class is at full capacity');

    return this.childRepo.create(data);
  }

  async getChildById(id) {
    return this.childRepo.findById(id);
  }

  async listChildren(skip = 0, take = 10, classId, parentId) {
    const where = {};
    if (classId) where.classId = classId;
    if (parentId) where.parentId = parentId;

    return this.childRepo.findMany({ skip, take, where });
  }

  async addEmergencyContact(data) {
    return this.contactRepo.createEmergencyContact(data);
  }

  async addAuthorizedPickup(data) {
    return this.contactRepo.createAuthorizedPickup(data);
  }
}exports.ChildService = ChildService;