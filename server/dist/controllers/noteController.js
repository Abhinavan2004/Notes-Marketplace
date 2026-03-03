"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNoteById = exports.listNotes = exports.createNote = void 0;
const fs_1 = __importDefault(require("fs"));
const Note_1 = require("../models/Note");
const cloudinary_1 = require("../utils/cloudinary");
const pagination_1 = require("../utils/pagination");
const createNote = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { title, subject, description, price, tags } = req.body;
        const files = req.files;
        const pdfFile = files?.['pdf']?.[0];
        const previewFile = files?.['preview']?.[0];
        if (!pdfFile) {
            return res.status(400).json({ message: 'PDF file is required' });
        }
        const pdfPath = pdfFile.path;
        const pdfUpload = await (0, cloudinary_1.uploadPdf)(pdfPath);
        let previewUpload;
        if (previewFile) {
            previewUpload = await (0, cloudinary_1.uploadPreviewImage)(previewFile.path);
        }
        const note = await Note_1.Note.create({
            title,
            subject,
            description,
            price,
            fileUrl: pdfUpload.secure_url,
            filePublicId: pdfUpload.public_id,
            previewUrl: previewUpload?.secure_url,
            previewPublicId: previewUpload?.public_id,
            seller: req.user.id,
            tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim())) : [],
        });
        fs_1.default.unlink(pdfPath, () => { });
        if (previewFile) {
            fs_1.default.unlink(previewFile.path, () => { });
        }
        return res.status(201).json({ note });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to create note' });
    }
};
exports.createNote = createNote;
const listNotes = async (req, res) => {
    try {
        const { subject, minPrice, maxPrice, rating, sortBy, search } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const { skip } = (0, pagination_1.getPagination)({ page, limit });
        const filter = {};
        if (subject) {
            filter.subject = subject;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        if (rating) {
            filter.averageRating = { $gte: Number(rating) };
        }
        if (search) {
            filter.$text = { $search: String(search) };
        }
        let sort = { createdAt: -1 };
        if (sortBy === 'price_asc')
            sort = { price: 1 };
        if (sortBy === 'price_desc')
            sort = { price: -1 };
        if (sortBy === 'most_sold')
            sort = { totalSales: -1 };
        if (sortBy === 'rating')
            sort = { averageRating: -1 };
        const [items, total] = await Promise.all([
            Note_1.Note.find(filter)
                .select('title subject description price seller averageRating totalSales previewUrl createdAt')
                .populate('seller', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Note_1.Note.countDocuments(filter),
        ]);
        return res.json({
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to list notes' });
    }
};
exports.listNotes = listNotes;
const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note_1.Note.findById(id)
            .select('title subject description price seller averageRating totalSales previewUrl createdAt')
            .populate('seller', 'name');
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        return res.json({ note });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch note' });
    }
};
exports.getNoteById = getNoteById;
