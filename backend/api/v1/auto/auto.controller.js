"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.listResource = exports.createResource = void 0;
var _prisma = require("../../../core/prisma");

const listResource = async (req, res, next) => {
  try {
    const resource = req.params.resource; // e.g. "child", "class"

    // Safety check to ensure it's a valid prisma model
    if (!(resource in _prisma.prisma) || typeof _prisma.prisma[resource].findMany !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }

    // Build where clause from query params
    const where = {};
    for (const key in req.query) {
      if (key !== 'page' && key !== 'limit' && typeof req.query[key] === 'string') {
        where[key] = req.query[key];
      }
    }

    const data = await _prisma.prisma[resource].findMany({
      where,
      orderBy: { id: 'desc' },
      take: 50
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
};exports.listResource = listResource;

const createResource = async (req, res, next) => {
  try {
    const resource = req.params.resource;

    if (!(resource in _prisma.prisma) || typeof _prisma.prisma[resource].create !== 'function') {
      return res.status(404).json({ error: { message: 'Resource not found' } });
    }

    const data = await _prisma.prisma[resource].create({
      data: req.body
    });

    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};exports.createResource = createResource;