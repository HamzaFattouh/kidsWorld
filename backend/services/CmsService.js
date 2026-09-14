"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.CmsService = void 0;var _CmsRepository = require("../repositories/CmsRepository");

var _OperationsRepository = require("../repositories/OperationsRepository");

class CmsService {
  constructor(cmsRepo = new _CmsRepository.CmsRepository(), opsRepo = new _OperationsRepository.OperationsRepository()) {this.cmsRepo = cmsRepo;this.opsRepo = opsRepo;}

  async createAnnouncement(data, adminId) {
    const record = await this.cmsRepo.createAnnouncement(data);
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'CREATE_ANNOUNCEMENT',
      resource: 'Announcement',
      resourceId: record.id
    });
    return record;
  }

  async getAnnouncements(role) {
    // Only ADMIN/TEACHER can see unpublished content in this simplistic model
    const includeUnpublished = role === 'ADMIN' || role === 'TEACHER';
    return this.cmsRepo.getAnnouncements(includeUnpublished);
  }

  async createPost(data, adminId) {
    const record = await this.cmsRepo.createPost(data);
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'CREATE_POST',
      resource: 'Post',
      resourceId: record.id
    });
    return record;
  }

  async getPosts(role) {
    const includeUnpublished = role === 'ADMIN' || role === 'TEACHER';
    return this.cmsRepo.getPosts(includeUnpublished);
  }

  async createEvent(data, adminId) {
    const record = await this.cmsRepo.createEvent(data);
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'CREATE_EVENT',
      resource: 'Event',
      resourceId: record.id
    });
    return record;
  }

  async getEvents(role) {
    const includeUnpublished = role === 'ADMIN' || role === 'TEACHER';
    return this.cmsRepo.getEvents(includeUnpublished);
  }

  async updateHomepageSection(section, data, adminId) {
    const record = await this.cmsRepo.updateHomepageSection(section, data);
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'UPDATE_HOMEPAGE_CONFIG',
      resource: 'HomepageConfig',
      resourceId: record.id
    });
    return record;
  }

  async getHomepageConfig() {
    return this.cmsRepo.getHomepageConfig();
  }

  async uploadGalleryImage(url, captionEn, captionAr, adminId) {
    const record = await this.cmsRepo.addGalleryImage({ url, captionEn, captionAr, isPublished: true });
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'UPLOAD_GALLERY_IMAGE',
      resource: 'GalleryImage',
      resourceId: record.id
    });
    return record;
  }
}exports.CmsService = CmsService;