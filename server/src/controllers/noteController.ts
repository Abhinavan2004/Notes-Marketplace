import fs from 'fs';
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Note } from '../models/Note';
import { uploadPdf, uploadPreviewImage } from '../utils/cloudinary';
import { getPagination } from '../utils/pagination';

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { title, subject, description, price, tags } = req.body as {
      title: string;
      subject: string;
      description: string;
      price: number;
      tags?: string[] | string;
    };
    const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files;
    const pdfFile = files?.['pdf']?.[0];
    const previewFile = files?.['preview']?.[0];

    if (!pdfFile) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const pdfPath = pdfFile.path;
    const pdfUpload = await uploadPdf(pdfPath);

    let previewUpload;
    if (previewFile) {
      previewUpload = await uploadPreviewImage(previewFile.path);
    }

    const note = await Note.create({
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

    fs.unlink(pdfPath, () => {});
    if (previewFile) {
      fs.unlink(previewFile.path, () => {});
    }

    return res.status(201).json({ note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create note' });
  }
};

export const listNotes = async (req: Request, res: Response) => {
  try {
    const { subject, minPrice, maxPrice, rating, sortBy, search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const { skip } = getPagination({ page, limit });

    const filter: Record<string, unknown> = {};

    if (subject) {
      filter.subject = subject;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as any).$gte = Number(minPrice);
      if (maxPrice) (filter.price as any).$lte = Number(maxPrice);
    }
    if (rating) {
      filter.averageRating = { $gte: Number(rating) };
    }
    if (search) {
      filter.$text = { $search: String(search) };
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === 'price_asc') sort = { price: 1 };
    if (sortBy === 'price_desc') sort = { price: -1 };
    if (sortBy === 'most_sold') sort = { totalSales: -1 };
    if (sortBy === 'rating') sort = { averageRating: -1 };

    const [items, total] = await Promise.all([
      Note.find(filter)
        .select('title subject description price seller averageRating totalSales previewUrl createdAt')
        .populate('seller', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Note.countDocuments(filter),
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
  } catch (error) {
    return res.status(500).json({ message: 'Failed to list notes' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id)
      .select('title subject description price seller averageRating totalSales previewUrl createdAt')
      .populate('seller', 'name');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json({ note });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch note' });
  }
};

