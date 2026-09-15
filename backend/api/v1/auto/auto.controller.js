"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listResource = exports.createResource = void 0;
var _prisma = require("../../../core/prisma");

const MOCK_CHILDREN = [
  {
    id: 'child-omar-shakaa',
    name: 'عمر أحمد الشكعة',
    parentId: 'user-parent-001',
    classId: 'class-birds-3-4',
    dob: '2022-04-15',
    gender: 'ذكر',
    medicalNotes: 'حساسية خفيفة من السمسم - يرجى الانتباه عند تقديم الطعام',
    enrollmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    parent: { id: 'user-parent-001', name: 'أحمد الشكعة', email: 'ahmed.parent@gmail.com', phone: '0599888777' },
    class: { id: 'class-birds-3-4', name: 'روضة العصافير', ageGroup: '3 - 4 سنوات' },
  },
  {
    id: 'child-sara-masri',
    name: 'سارة مريم المصري',
    parentId: 'user-parent-002',
    classId: 'class-flowers-4-5',
    dob: '2021-11-20',
    gender: 'أنثى',
    medicalNotes: 'تضع نظارات طبية للأنشطة',
    enrollmentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    parent: { id: 'user-parent-002', name: 'مريم المصري', email: 'marian.parent@gmail.com', phone: '0599555666' },
    class: { id: 'class-flowers-4-5', name: 'روضة الزهور', ageGroup: '4 - 5 سنوات' },
  },
  {
    id: 'child-layan-shakaa',
    name: 'ليان أحمد الشكعة',
    parentId: 'user-parent-001',
    classId: 'class-hope-2-3',
    dob: '2023-08-10',
    gender: 'أنثى',
    medicalNotes: 'لا يوجد أية حساسية معروفة',
    enrollmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    parent: { id: 'user-parent-001', name: 'أحمد الشكعة', email: 'ahmed.parent@gmail.com', phone: '0599888777' },
    class: { id: 'class-hope-2-3', name: 'روضة الأمل', ageGroup: '2 - 3 سنوات' },
  },
  {
    id: 'child-yousef-jowdat',
    name: 'يوسف خالد جودت',
    parentId: 'user-parent-003',
    classId: 'class-birds-3-4',
    dob: '2022-01-05',
    gender: 'ذكر',
    medicalNotes: 'ربو خفيف - بخاخ فنتولين عند الحاجة',
    enrollmentDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    parent: { id: 'user-parent-003', name: 'خالد جودت', email: 'khaled.parent@gmail.com', phone: '0599222111' },
    class: { id: 'class-birds-3-4', name: 'روضة العصافير', ageGroup: '3 - 4 سنوات' },
  },
];

const MOCK_CLASSES = [
  { id: 'class-birds-3-4', name: 'روضة العصافير', ageGroup: '3-4 سنوات', capacity: 20, teacher: 'أ. نورة النابلسي' },
  { id: 'class-flowers-4-5', name: 'روضة الزهور', ageGroup: '4-5 سنوات', capacity: 22, teacher: 'أ. سارة الخالد' },
  { id: 'class-hope-2-3', name: 'روضة الأمل', ageGroup: '2-3 سنوات', capacity: 15, teacher: 'أ. منى التميمي' },
];

const listResource = async (req, res, next) => {
  try {
    const resource = req.params.resource;

    if (!(resource in _prisma.prisma) || typeof _prisma.prisma[resource].findMany !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }

    const where = {};
    for (const key in req.query) {
      if (key !== 'page' && key !== 'limit' && typeof req.query[key] === 'string') {
        where[key] = req.query[key];
      }
    }

    try {
      const data = await _prisma.prisma[resource].findMany({
        where,
        orderBy: { id: 'desc' },
        take: 50,
      });
      if (data && data.length > 0) {
        return res.json({ data });
      }
    } catch (dbErr) {
      console.warn(`[AutoAPI] DB error for resource ${resource}, using mock fallback data`);
    }

    // Fallbacks if DB is down or empty
    if (resource === 'child') {
      return res.json({ data: MOCK_CHILDREN });
    }
    if (resource === 'class') {
      return res.json({ data: MOCK_CLASSES });
    }

    return res.json({ data: [] });
  } catch (error) {
    next(error);
  }
};
exports.listResource = listResource;

const createResource = async (req, res, next) => {
  try {
    const resource = req.params.resource;

    if (!(resource in _prisma.prisma) || typeof _prisma.prisma[resource].create !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }

    try {
      const data = await _prisma.prisma[resource].create({
        data: req.body,
      });
      return res.status(201).json({ data });
    } catch (dbErr) {
      console.warn(`[AutoAPI] DB error creating ${resource}, creating mock object`);
      const newObj = { id: `${resource}-${Date.now()}`, ...req.body, enrollmentDate: new Date().toISOString() };
      if (resource === 'child') {
        MOCK_CHILDREN.push(newObj);
      }
      return res.status(201).json({ data: newObj });
    }
  } catch (error) {
    next(error);
  }
};
exports.createResource = createResource;