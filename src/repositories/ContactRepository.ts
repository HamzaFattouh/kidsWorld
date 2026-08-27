import { prisma } from '../core/prisma';
import { Prisma } from '@prisma/client';

export class ContactRepository {
  async createEmergencyContact(data: Prisma.EmergencyContactUncheckedCreateInput) {
    return prisma.emergencyContact.create({ data });
  }

  async createAuthorizedPickup(data: Prisma.AuthorizedPickupUncheckedCreateInput) {
    return prisma.authorizedPickup.create({ data });
  }

  async getEmergencyContactsByChild(childId: string) {
    return prisma.emergencyContact.findMany({ where: { childId } });
  }

  async getAuthorizedPickupsByChild(childId: string) {
    return prisma.authorizedPickup.findMany({ where: { childId } });
  }
}
