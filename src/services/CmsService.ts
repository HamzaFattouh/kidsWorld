import { CmsRepository } from '../repositories/CmsRepository';
import { Prisma } from '@prisma/client';
import { OperationsRepository } from '../repositories/OperationsRepository';

export class CmsService {
  constructor(private cmsRepo = new CmsRepository(), private opsRepo = new OperationsRepository()) {}

  async createAnnouncement(data: Prisma.AnnouncementUncheckedCreateInput, adminId: string) {
    const record = await this.cmsRepo.createAnnouncement(data);
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'CREATE_ANNOUNCEMENT',
      resource: 'Announcement',
      resourceId: record.id
    });
    return record;
  }

  async getAnnouncements(role?: string) {
    // Only ADMIN/TEACHER can see unpublished content in this simplistic model
    const includeUnpublished = role === 'ADMIN' || role === 'TEACHER';
    return this.cmsRepo.getAnnouncements(includeUnpublished);
  }

  async createPost(data: Prisma.PostUncheckedCreateInput, adminId: string) {
    const record = await this.cmsRepo.createPost(data);
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'CREATE_POST',
      resource: 'Post',
      resourceId: record.id
    });
    return record;
  }

  async getPosts(role?: string) {
    const includeUnpublished = role === 'ADMIN' || role === 'TEACHER';
    return this.cmsRepo.getPosts(includeUnpublished);
  }

  async uploadGalleryImage(url: string, captionEn: string, captionAr: string, adminId: string) {
    const record = await this.cmsRepo.addGalleryImage({ url, captionEn, captionAr, isPublished: true });
    await this.opsRepo.logAudit({
      userId: adminId,
      action: 'UPLOAD_GALLERY_IMAGE',
      resource: 'GalleryImage',
      resourceId: record.id
    });
    return record;
  }
}
