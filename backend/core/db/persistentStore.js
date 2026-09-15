"use strict";
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/database.json');

// Initial seed template for permanent storage
const INITIAL_DATA = {
  users: [
    {
      id: 'user-admin-001',
      email: 'admin@kidsworld.com',
      name: 'مدير النظام الرئيسي',
      passwordHash: '$2b$10$U6yRUKHu5ERTIlKdzbNnhe4DAIW2f3bMWmQemtloOcfuSUZh1j87.', // admin123
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
      requiresPasswordChange: false,
      phone: '0599000000',
      address: 'نابلس- نابلس الجديدة',
      createdAt: '2026-09-15T10:00:00.000Z',
      permissions: {
        editCms: true,
        manageEvents: true,
        uploadJournal: true,
        recordAttendance: true,
        recordMeals: true,
        writeEvaluations: true,
        sendMessages: true,
        viewCameras: true,
      },
    },
    {
      id: 'user-teacher-001',
      email: 'nora@kidsworld.com',
      name: 'أ. نورة النابلسي',
      passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
      role: 'TEACHER',
      isActive: true,
      isVerified: true,
      requiresPasswordChange: false,
      phone: '0599111222',
      assignedClass: 'روضة العصافير',
      address: 'نابلس- نابلس الجديدة',
      createdAt: '2026-09-15T10:00:00.000Z',
    },
    {
      id: 'user-teacher-002',
      email: 'sara@kidsworld.com',
      name: 'أ. سارة الخالد',
      passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
      role: 'TEACHER',
      isActive: true,
      isVerified: true,
      requiresPasswordChange: false,
      phone: '0599333444',
      assignedClass: 'روضة الزهور',
      address: 'نابلس- نابلس الجديدة',
      createdAt: '2026-09-15T10:00:00.000Z',
    },
    {
      id: 'user-parent-001',
      email: 'ahmed.parent@gmail.com',
      name: 'أحمد الشكعة',
      passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
      role: 'PARENT',
      isActive: true,
      isVerified: true,
      requiresPasswordChange: false,
      phone: '0599888777',
      address: 'نابلس- نابلس الجديدة',
      createdAt: '2026-09-15T10:00:00.000Z',
    },
    {
      id: 'user-parent-002',
      email: 'marian.parent@gmail.com',
      name: 'مريم المصري',
      passwordHash: '$2b$10$jMr7bNJ6DV6g5PfbE3bajO7.n6yIRO3SssgCcJ2mF.Usg/VrVX/pu', // 123456
      role: 'PARENT',
      isActive: true,
      isVerified: true,
      requiresPasswordChange: false,
      phone: '0599555666',
      address: 'نابلس- نابلس الجديدة',
      createdAt: '2026-09-15T10:00:00.000Z',
    },
  ],

  children: [
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
  ],

  classes: [
    {
      id: 'class-birds-3-4',
      name: 'روضة العصافير 🐥',
      ageGroup: '3 - 4 سنوات',
      capacity: 20,
      teacher: 'أ. نورة النابلسي',
      students: [
        { id: 'child-omar-shakaa', name: 'عمر أحمد الشكعة', gender: 'ذكر', parent: 'أحمد الشكعة' },
        { id: 'child-yousef-jowdat', name: 'يوسف خالد جودت', gender: 'ذكر', parent: 'خالد جودت' },
      ],
    },
    {
      id: 'class-flowers-4-5',
      name: 'روضة الزهور 🌸',
      ageGroup: '4 - 5 سنوات',
      capacity: 22,
      teacher: 'أ. سارة الخالد',
      students: [
        { id: 'child-sara-masri', name: 'سارة مريم المصري', gender: 'أنثى', parent: 'مريم المصري' },
      ],
    },
    {
      id: 'class-hope-2-3',
      name: 'روضة الأمل 🌟',
      ageGroup: '2 - 3 سنوات',
      capacity: 15,
      teacher: 'أ. منى التميمي',
      students: [
        { id: 'child-layan-shakaa', name: 'ليان أحمد الشكعة', gender: 'أنثى', parent: 'أحمد الشكعة' },
      ],
    },
  ],

  attendance: [
    { id: 'att-1', childId: 'child-omar-shakaa', date: '2026-09-15', status: 'PRESENT', notes: 'حضور مبكر ونشاط ممتاز' },
    { id: 'att-2', childId: 'child-sara-masri', date: '2026-09-15', status: 'PRESENT', notes: 'تفاعل ممتاز' },
  ],

  meals: [
    { id: 'meal-1', childId: 'child-omar-shakaa', date: '2026-09-15', type: 'BREAKFAST', notes: 'أكل وجبته اليومية بنجاح 🍏', consumed: 'ALL' },
  ],

  complaints: [
    {
      id: 'comp-1',
      title: 'استفسار عن برنامج الوجبات اليومية والمواصلات',
      description: 'نود الاستفسار عن تفاصيل وجبة الإفطار للأسبوع القادم وهل تشمل الفواكه الطازجة.',
      status: 'RESOLVED',
      parentId: 'user-parent-001',
      childId: 'child-omar-shakaa',
      createdAt: new Date().toISOString(),
    },
  ],
};

class PersistentStore {
  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  ensureDataDir() {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return { ...INITIAL_DATA, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load database.json, initializing fresh store:', e.message);
    }
    this.saveData(INITIAL_DATA);
    return { ...INITIAL_DATA };
  }

  saveData(dataToSave) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save to database.json:', e.message);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.saveData();
  }

  find(collection, predicate) {
    const items = this.get(collection);
    return items.find(predicate) || null;
  }

  filter(collection, predicate) {
    const items = this.get(collection);
    return items.filter(predicate);
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].push(item);
    this.saveData();
    return item;
  }

  update(collection, idKey, idVal, updateData) {
    const items = this.get(collection);
    const idx = items.findIndex((it) => it[idKey] === idVal);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updateData };
      this.saveData();
      return items[idx];
    }
    const newObj = { [idKey]: idVal, ...updateData };
    items.push(newObj);
    this.saveData();
    return newObj;
  }

  delete(collection, idKey, idVal) {
    if (!this.data[collection]) return;
    this.data[collection] = this.data[collection].filter((it) => it[idKey] !== idVal);
    this.saveData();
  }
}

const dbStore = new PersistentStore();
module.exports = { dbStore };
