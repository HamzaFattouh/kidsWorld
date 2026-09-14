"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ClassService = void 0;var _ClassRepository = require("../repositories/ClassRepository");


class ClassService {
  constructor(classRepo = new _ClassRepository.ClassRepository()) {this.classRepo = classRepo;}

  async createClass(data) {
    return this.classRepo.create(data);
  }

  async getClassById(id) {
    return this.classRepo.findById(id);
  }

  async listClasses(skip = 0, take = 10) {
    return this.classRepo.findMany({ skip, take });
  }

  async assignTeacherToClass(classId, teacherId) {
    return this.classRepo.assignTeacher(classId, teacherId);
  }
}exports.ClassService = ClassService;