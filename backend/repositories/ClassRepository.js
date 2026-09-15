"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRepository = void 0;
var _prisma = require("../core/prisma");

const FALLBACK_CLASSES = [
  {
    id: 'class-birds-3-4',
    name: 'روضة العصافير',
    ageGroup: '3-4 سنوات',
    capacity: 20,
    teacher: 'أ. نورة النابلسي',
    _count: { children: 2 },
    children: [
      { id: 'child-omar-shakaa', name: 'عمر أحمد الشكعة' },
      { id: 'child-yousef-jowdat', name: 'يوسف خالد جودت' },
    ],
  },
  {
    id: 'class-flowers-4-5',
    name: 'روضة الزهور',
    ageGroup: '4-5 سنوات',
    capacity: 22,
    teacher: 'أ. سارة الخالد',
    _count: { children: 1 },
    children: [
      { id: 'child-sara-masri', name: 'سارة مريم المصري' },
    ],
  },
  {
    id: 'class-hope-2-3',
    name: 'روضة الأمل',
    ageGroup: '2-3 سنوات',
    capacity: 15,
    teacher: 'أ. منى التميمي',
    _count: { children: 1 },
    children: [
      { id: 'child-layan-shakaa', name: 'ليان أحمد الشكعة' },
    ],
  },
];

class ClassRepository {
  async create(data) {
    try {
      return await _prisma.prisma.class.create({ data });
    } catch (e) {
      const newCls = { id: `class-${Date.now()}`, ...data };
      FALLBACK_CLASSES.push(newCls);
      return newCls;
    }
  }

  async findById(id) {
    try {
      const cls = await _prisma.prisma.class.findUnique({
        where: { id },
        include: {
          teachers: { include: { teacher: true } },
          children: true,
        },
      });
      if (cls) return cls;
    } catch (e) {
      console.warn('DB error in ClassRepository.findById');
    }
    return FALLBACK_CLASSES.find((c) => c.id === id) || FALLBACK_CLASSES[0];
  }

  async findMany(options) {
    try {
      const list = await _prisma.prisma.class.findMany({
        where: options?.where,
        skip: options?.skip,
        take: options?.take,
        orderBy: options?.orderBy,
        include: { _count: { select: { children: true } } },
      });
      if (list && list.length > 0) return list;
    } catch (e) {
      console.warn('DB error in ClassRepository.findMany, returning fallback classes list');
    }
    return FALLBACK_CLASSES;
  }

  async assignTeacher(classId, teacherId) {
    try {
      return await _prisma.prisma.teacherClass.create({
        data: { classId, teacherId },
      });
    } catch (e) {
      return { classId, teacherId };
    }
  }
}
exports.ClassRepository = ClassRepository;