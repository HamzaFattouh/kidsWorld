"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listResource = exports.createResource = void 0;
var _prisma = require("../../../core/prisma");
const { dbStore } = require('../../../core/db/persistentStore');

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
      console.warn(`[AutoAPI] DB error for resource ${resource}, using persistent local database.json store`);
    }

    // Persistent storage collection lookup
    const pluralMap = {
      child: 'children',
      class: 'classes',
      user: 'users',
      complaint: 'complaints',
      attendanceRecord: 'attendance',
      teacherAttendanceRecord: 'teacherAttendance',
      mealRecord: 'meals',
      task: 'tasks',
    };

    const collectionName = pluralMap[resource] || `${resource}s`;
    const storedData = dbStore.get(collectionName);
    return res.json({ data: storedData });
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
      if (data) {
        const collectionName = resource === 'child' ? 'children' : `${resource}s`;
        dbStore.insert(collectionName, data);
        return res.status(201).json({ data });
      }
    } catch (dbErr) {
      console.warn(`[AutoAPI] DB offline, writing new ${resource} to persistent database.json store`);
    }

    const pluralMap = {
      child: 'children',
      class: 'classes',
      user: 'users',
      complaint: 'complaints',
      attendanceRecord: 'attendance',
      teacherAttendanceRecord: 'teacherAttendance',
      mealRecord: 'meals',
      task: 'tasks',
    };
    const collectionName = pluralMap[resource] || `${resource}s`;
    const newObj = {
      id: `${resource}-${Date.now()}`,
      ...req.body,
      enrollmentDate: req.body?.enrollmentDate || new Date().toISOString(),
    };
    dbStore.insert(collectionName, newObj);
    return res.status(201).json({ data: newObj });
  } catch (error) {
    next(error);
  }
};
exports.createResource = createResource;

const updateResource = async (req, res, next) => {
  try {
    const { resource, id } = req.params;
    if (!(resource in _prisma.prisma) || typeof _prisma.prisma[resource].update !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }
    try {
      const data = await _prisma.prisma[resource].update({
        where: { id },
        data: req.body,
      });
      if (data) return res.json({ data });
    } catch (dbErr) {
      console.warn(`[AutoAPI] DB offline, updating ${resource} in persistent database.json store`);
    }

    const pluralMap = {
      child: 'children',
      class: 'classes',
      user: 'users',
      complaint: 'complaints',
      attendanceRecord: 'attendance',
      teacherAttendanceRecord: 'teacherAttendance',
      mealRecord: 'meals',
      task: 'tasks',
    };
    const collectionName = pluralMap[resource] || `${resource}s`;
    
    // Update in memory db
    const items = dbStore.get(collectionName);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      const updated = { ...items[index], ...req.body };
      items[index] = updated;
      dbStore.save();
      return res.json({ data: updated });
    }
    return res.status(404).json({ error: { message: 'Not found' } });
  } catch (error) {
    next(error);
  }
};
exports.updateResource = updateResource;

const deleteResource = async (req, res, next) => {
  try {
    const { resource, id } = req.params;
    if (!(resource in _prisma.prisma) || typeof _prisma.prisma[resource].delete !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }
    try {
      await _prisma.prisma[resource].delete({ where: { id } });
      return res.json({ success: true });
    } catch (dbErr) {
      console.warn(`[AutoAPI] DB offline, deleting ${resource} from persistent database.json store`);
    }

    const pluralMap = {
      child: 'children',
      class: 'classes',
      user: 'users',
      complaint: 'complaints',
      attendanceRecord: 'attendance',
      teacherAttendanceRecord: 'teacherAttendance',
      mealRecord: 'meals',
      task: 'tasks',
    };
    const collectionName = pluralMap[resource] || `${resource}s`;
    
    const items = dbStore.get(collectionName);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      dbStore.save();
      return res.json({ success: true });
    }
    return res.status(404).json({ error: { message: 'Not found' } });
  } catch (error) {
    next(error);
  }
};
exports.deleteResource = deleteResource;