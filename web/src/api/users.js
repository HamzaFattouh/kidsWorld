import { api } from '../lib/api';

const DEFAULT_USERS = [
  {
    id: 'user-admin-001',
    email: 'admin@kidsworld.com',
    name: 'مدير النظام الرئيسي',
    role: 'ADMIN',
    isActive: true,
    phone: '0599000000',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-teacher-001',
    email: 'nora@kidsworld.com',
    name: 'أ. نورة النابلسي',
    role: 'TEACHER',
    isActive: true,
    phone: '0599111222',
    assignedClass: 'روضة العصافير',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-teacher-002',
    email: 'sara@kidsworld.com',
    name: 'أ. سارة الخالد',
    role: 'TEACHER',
    isActive: true,
    phone: '0599333444',
    assignedClass: 'روضة الزهور',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-parent-001',
    email: 'ahmed.parent@gmail.com',
    name: 'أحمد الشكعة',
    role: 'PARENT',
    isActive: true,
    phone: '0599888777',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-parent-002',
    email: 'marian.parent@gmail.com',
    name: 'مريم المصري',
    role: 'PARENT',
    isActive: true,
    phone: '0599555666',
    createdAt: new Date().toISOString(),
  },
];

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem('kidsworld_users_db');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  localStorage.setItem('kidsworld_users_db', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

const saveStoredUsers = (items) => {
  try {
    localStorage.setItem('kidsworld_users_db', JSON.stringify(items));
  } catch (e) {
    console.warn(e);
  }
};

export const usersApi = {
  getUsers: async (params) => {
    let apiList = [];
    try {
      const response = await api.get('/users', { params });
      if (response.data && Array.isArray(response.data.data)) {
        apiList = response.data.data;
      }
    } catch (e) {
      console.warn('API getUsers fallback to localStorage');
    }

    const stored = getStoredUsers();
    const map = new Map();
    stored.forEach((u) => map.set(u.id, u));
    apiList.forEach((u) => {
      if (!map.has(u.id)) map.set(u.id, u);
    });

    const result = Array.from(map.values());
    if (result.length > 0) {
      saveStoredUsers(result);
    }
    return { data: result };
  },

  createUser: async (data) => {
    const newUser = {
      id: `user-${Date.now()}`,
      ...data,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
    };

    try {
      await api.post('/users', data).catch(() => {});
    } catch (e) {
      console.warn('API createUser fallback');
    }

    const current = getStoredUsers();
    const updated = [newUser, ...current.filter((u) => u.id !== newUser.id)];
    saveStoredUsers(updated);
    return { data: newUser };
  },

  updateUser: async (id, updateData) => {
    try {
      await api.put(`/users/${id}`, updateData).catch(() => {});
    } catch (e) {
      console.warn('API updateUser fallback');
    }

    const current = getStoredUsers();
    const updated = current.map((u) => (u.id === id ? { ...u, ...updateData } : u));
    saveStoredUsers(updated);
    return { data: updated.find((u) => u.id === id) };
  },
};