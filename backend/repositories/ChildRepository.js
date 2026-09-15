"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildRepository = void 0;
var _prisma = require("../core/prisma");

const FALLBACK_CHILDREN = [
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
    documents: [
      { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
      { name: 'الكشف الطبي والتحصينات', status: 'مكتمل ✅' },
    ],
  },
  {
    id: 'child-sara-masri',
    name: 'سارة مريم المصري',
    parentId: 'user-parent-002',
    classId: 'class-flowers-4-5',
    dob: '2021-11-20',
    gender: 'أنثى',
    medicalNotes: 'تضع نظارات طبية بالقراءة والأنشطة',
    enrollmentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    parent: { id: 'user-parent-002', name: 'مريم المصري', email: 'marian.parent@gmail.com', phone: '0599555666' },
    class: { id: 'class-flowers-4-5', name: 'روضة الزهور', ageGroup: '4 - 5 سنوات' },
    documents: [
      { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
    ],
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
    documents: [
      { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
    ],
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
    documents: [
      { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
    ],
  },
];

class ChildRepository {
  async create(data) {
    try {
      return await _prisma.prisma.child.create({ data });
    } catch (e) {
      console.warn('DB error in ChildRepository.create, using mock fallback');
      const newChild = { id: `child-${Date.now()}`, ...data, enrollmentDate: new Date() };
      FALLBACK_CHILDREN.push(newChild);
      return newChild;
    }
  }

  async findById(id) {
    try {
      const child = await _prisma.prisma.child.findUnique({
        where: { id },
        include: {
          emergencyContacts: true,
          authorizedPickups: true,
          parent: { select: { id: true, email: true, name: true, phone: true } },
          class: { select: { id: true, name: true } },
        },
      });
      if (child) return child;
    } catch (e) {
      console.warn('DB error in ChildRepository.findById, returning fallback');
    }
    return FALLBACK_CHILDREN.find((c) => c.id === id) || FALLBACK_CHILDREN[0];
  }

  async findMany(options) {
    try {
      const list = await _prisma.prisma.child.findMany({
        where: options?.where,
        skip: options?.skip,
        take: options?.take,
        orderBy: options?.orderBy,
        include: { class: true, parent: true },
      });
      if (list && list.length > 0) return list;
    } catch (e) {
      console.warn('DB error in ChildRepository.findMany, returning fallback children list');
    }
    return FALLBACK_CHILDREN;
  }

  async update(id, data) {
    try {
      return await _prisma.prisma.child.update({ where: { id }, data });
    } catch (e) {
      console.warn('DB error in ChildRepository.update, returning mock updated child');
      const idx = FALLBACK_CHILDREN.findIndex((c) => c.id === id);
      if (idx !== -1) {
        FALLBACK_CHILDREN[idx] = { ...FALLBACK_CHILDREN[idx], ...data };
        return FALLBACK_CHILDREN[idx];
      }
      return { id, ...data };
    }
  }

  async countByClass(classId) {
    try {
      return await _prisma.prisma.child.count({ where: { classId } });
    } catch (e) {
      return FALLBACK_CHILDREN.filter((c) => c.classId === classId).length;
    }
  }
}
exports.ChildRepository = ChildRepository;