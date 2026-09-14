"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.uploadGallery = exports.getPosts = exports.getAnnouncements = exports.createPost = exports.createAnnouncement = exports.createEvent = exports.getEvents = exports.updateHomepageConfig = exports.getHomepageConfig = void 0;
var _CmsService = require("../../../services/CmsService");

const cmsService = new _CmsService.CmsService();

const createAnnouncement = async (req, res, next) => {
  try {
    const user = req.user;
    const record = await cmsService.createAnnouncement(req.body, user.userId);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createAnnouncement = createAnnouncement;

const getAnnouncements = async (req, res, next) => {
  try {
    const role = req.user?.role;
    const records = await cmsService.getAnnouncements(role);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getAnnouncements = getAnnouncements;

const createPost = async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { ...req.body, authorId: user.userId };
    const record = await cmsService.createPost(payload, user.userId);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createPost = createPost;

const getPosts = async (req, res, next) => {
  try {
    const role = req.user?.role;
    const records = await cmsService.getPosts(role);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getPosts = getPosts;

const createEvent = async (req, res, next) => {
  try {
    const user = req.user;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const payload = { ...req.body, imageUrl, eventDate: new Date(req.body.eventDate) };
    if (typeof payload.isPublished === 'string') {
        payload.isPublished = payload.isPublished === 'true';
    }
    const record = await cmsService.createEvent(payload, user.userId);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.createEvent = createEvent;

const getEvents = async (req, res, next) => {
  try {
    const role = req.user?.role;
    const records = await cmsService.getEvents(role);
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getEvents = getEvents;

const updateHomepageConfig = async (req, res, next) => {
  try {
    const user = req.user;
    const record = await cmsService.updateHomepageSection(req.body.section, req.body, user.userId);
    res.json({ data: record });
  } catch (error) {next(error);}
};exports.updateHomepageConfig = updateHomepageConfig;

const getHomepageConfig = async (req, res, next) => {
  try {
    const records = await cmsService.getHomepageConfig();
    res.json({ data: records });
  } catch (error) {next(error);}
};exports.getHomepageConfig = getHomepageConfig;

const uploadGallery = async (req, res, next) => {
  try {
    const user = req.user;
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // In a real app, upload to S3 here. For now, store the local path.
    const url = `/uploads/${req.file.filename}`;
    const { captionEn, captionAr } = req.body;

    const record = await cmsService.uploadGalleryImage(url, captionEn, captionAr, user.userId);
    res.status(201).json({ data: record });
  } catch (error) {next(error);}
};exports.uploadGallery = uploadGallery;