"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.ContactRepository = void 0;var _prisma = require("../core/prisma");


class ContactRepository {
  async createEmergencyContact(data) {
    return _prisma.prisma.emergencyContact.create({ data });
  }

  async createAuthorizedPickup(data) {
    return _prisma.prisma.authorizedPickup.create({ data });
  }

  async getEmergencyContactsByChild(childId) {
    return _prisma.prisma.emergencyContact.findMany({ where: { childId } });
  }

  async getAuthorizedPickupsByChild(childId) {
    return _prisma.prisma.authorizedPickup.findMany({ where: { childId } });
  }
}exports.ContactRepository = ContactRepository;