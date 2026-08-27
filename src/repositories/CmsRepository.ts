import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';

export class CmsRepository {
  // Announcements
  async createAnnouncement(data: Prisma.AnnouncementUncheckedCreateInput) {
    return prisma.announcement.create({ data });
  }

  async getAnnouncements(includeUnpublished: boolean = false) {
    const where = includeUnpublished ? {} : { isPublished: true };
    return prisma.announcement.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  // Posts
  async createPost(data: Prisma.PostUncheckedCreateInput) {
    return prisma.post.create({ data });
  }

  async getPosts(includeUnpublished: boolean = false) {
    const where = includeUnpublished ? {} : { isPublished: true };
    return prisma.post.findMany({ 
      where, 
      orderBy: { orderIndex: 'asc' },
      include: { category: true }
    });
  }

  // Gallery
  async addGalleryImage(data: Prisma.GalleryImageUncheckedCreateInput) {
    return prisma.galleryImage.create({ data });
  }

  // Homepage Config
  async updateHomepageSection(section: string, data: Prisma.HomepageConfigUpdateInput) {
    return prisma.homepageConfig.upsert({
      where: { section },
      update: data,
      create: { 
        section, 
        titleEn: data.titleEn as string, 
        titleAr: data.titleAr as string, 
        bodyEn: data.bodyEn as string, 
        bodyAr: data.bodyAr as string 
      }
    });
  }

  async getHomepageConfig() {
    return prisma.homepageConfig.findMany({ 
      where: { isVisible: true },
      orderBy: { orderIndex: 'asc' } 
    });
  }
}
