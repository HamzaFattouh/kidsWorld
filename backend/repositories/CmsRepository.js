"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.CmsRepository = void 0;var _prisma = require("../core/prisma");


class CmsRepository {
  // Announcements
  async createAnnouncement(data) {
    return _prisma.prisma.announcement.create({ data });
  }

  async getAnnouncements(includeUnpublished = false) {
    const where = includeUnpublished ? {} : { isPublished: true };
    return _prisma.prisma.announcement.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  // Posts
  async createPost(data) {
    return _prisma.prisma.post.create({ data });
  }

  async getPosts(includeUnpublished = false) {
    const where = includeUnpublished ? {} : { isPublished: true };
    return _prisma.prisma.post.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
      include: { category: true }
    });
  }

  // Events
  async createEvent(data) {
    return _prisma.prisma.event.create({ data });
  }

  async getEvents(includeUnpublished = false) {
    const where = includeUnpublished ? {} : { isPublished: true };
    return _prisma.prisma.event.findMany({
      where,
      orderBy: { eventDate: 'asc' }
    });
  }

  // Gallery
  async addGalleryImage(data) {
    return _prisma.prisma.galleryImage.create({ data });
  }

  // Homepage Config
  async updateHomepageSection(section, data) {
    return _prisma.prisma.homepageConfig.upsert({
      where: { section },
      update: data,
      create: {
        section,
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        bodyEn: data.bodyEn,
        bodyAr: data.bodyAr
      }
    });
  }

  async getHomepageConfig() {
    return _prisma.prisma.homepageConfig.findMany({
      where: { isVisible: true },
      orderBy: { orderIndex: 'asc' }
    });
  }
}exports.CmsRepository = CmsRepository;