import { api } from '../lib/api';

const DEFAULT_CHILDREN = [
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

const getStoredChildren = () => {
  try {
    const raw = localStorage.getItem('kidsworld_children_db');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  localStorage.setItem('kidsworld_children_db', JSON.stringify(DEFAULT_CHILDREN));
  return DEFAULT_CHILDREN;
};

const saveStoredChildren = (items) => {
  try {
    localStorage.setItem('kidsworld_children_db', JSON.stringify(items));
  } catch (e) {
    console.warn(e);
  }
};

export const childApi = {
  getMany: async (params) => {
    let apiList = [];
    try {
      const response = await api.get('/auto/child', { params });
      if (response.data && Array.isArray(response.data.data)) {
        apiList = response.data.data;
      }
    } catch (e) {
      console.warn('API getMany fallback to localStorage');
    }

    const stored = getStoredChildren();
    const map = new Map();
    // Default / Stored first
    stored.forEach((item) => map.set(item.id, item));
    // API items next
    apiList.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    const result = Array.from(map.values());
    if (result.length > 0) {
      saveStoredChildren(result);
    }
    return { data: result };
  },

  createOne: async (data) => {
    const newChild = {
      id: `child-${Date.now()}`,
      ...data,
      enrollmentDate: data.enrollmentDate || new Date().toISOString(),
      parent: { id: data.parentId || 'user-parent-001', name: data.parentName || 'أحمد الشكعة' },
      class: { id: data.classId || 'class-birds-3-4', name: 'روضة العصافير' },
    };

    try {
      await api.post('/auto/child', data).catch(() => {});
    } catch (e) {
      console.warn('API error in createOne');
    }

    const current = getStoredChildren();
    const updated = [newChild, ...current.filter((c) => c.id !== newChild.id)];
    saveStoredChildren(updated);
    return { data: newChild };
  },

  updateOne: async (id, updateData) => {
    try {
      await api.put(`/auto/child/${id}`, updateData).catch(() => {});
    } catch (e) {
      console.warn('API error in updateOne');
    }

    const current = getStoredChildren();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updateData } : c));
    saveStoredChildren(updated);
    return { data: updated.find((c) => c.id === id) };
  },

  deleteOne: async (id) => {
    try {
      await api.delete(`/auto/child/${id}`).catch(() => {});
    } catch (e) {
      console.warn('API error in deleteOne');
    }

    const current = getStoredChildren();
    const updated = current.filter((c) => c.id !== id);
    saveStoredChildren(updated);
    return { data: { success: true } };
  },
};