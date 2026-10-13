import { documentRepository } from '../repositories/documentRepository.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import path from 'path';

export const documentService = {
  uploadDocument: async (file, body, user) => {
    if (!file) {
      throw new ApiError(400, 'File is required for document upload.');
    }

    const tenantId = user.tenantId || user._id;

    // Upload file to Cloudinary or local fallback
    const uploadResult = await uploadToCloudinary(file.path, 'smart_rental_docs');

    const ext = path.extname(file.originalname).replace('.', '').toLowerCase();

    const payload = {
      title: body.title || file.originalname,
      documentType: body.documentType || 'OTHER',
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      fileType: ext,
      relatedId: body.relatedId || undefined,
      uploadedBy: user._id,
      tenantId,
    };

    return await documentRepository.create(payload);
  },

  getDocuments: async (tenantFilter, documentType = null) => {
    const filter = { ...tenantFilter };
    if (documentType) {
      filter.documentType = documentType;
    }
    return await documentRepository.findAll(filter);
  },

  getDocumentById: async (id, tenantFilter) => {
    const doc = await documentRepository.findById(id, tenantFilter);
    if (!doc) {
      throw new ApiError(404, 'Document not found.');
    }
    return doc;
  },

  updateDocument: async (id, file, body, tenantFilter) => {
    const doc = await documentRepository.findById(id, tenantFilter);
    if (!doc) {
      throw new ApiError(404, 'Document not found or unauthorized.');
    }

    const updatePayload = {};
    if (body.title) updatePayload.title = body.title;
    if (body.documentType) updatePayload.documentType = body.documentType;
    if (body.relatedId !== undefined) updatePayload.relatedId = body.relatedId;

    if (file) {
      if (doc.publicId) {
        await deleteFromCloudinary(doc.publicId);
      }
      const uploadResult = await uploadToCloudinary(file.path, 'smart_rental_docs');
      const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
      updatePayload.fileUrl = uploadResult.url;
      updatePayload.publicId = uploadResult.publicId;
      updatePayload.fileType = ext;
    }

    return await documentRepository.updateById(id, tenantFilter, updatePayload);
  },

  deleteDocument: async (id, tenantFilter) => {
    const doc = await documentRepository.findById(id, tenantFilter);
    if (!doc) {
      throw new ApiError(404, 'Document not found or unauthorized.');
    }

    if (doc.publicId) {
      await deleteFromCloudinary(doc.publicId);
    }

    await documentRepository.deleteById(id, tenantFilter);
    return true;
  },
};
