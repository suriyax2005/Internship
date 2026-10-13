import { documentService } from '../services/documentService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const uploadDocument = async (req, res, next) => {
  try {
    const document = await documentService.uploadDocument(req.file, req.body, req.user);
    return ApiResponse.success(res, 'Document uploaded successfully', document, 201);
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const documentType = req.query.documentType || null;
    const documents = await documentService.getDocuments(req.tenantFilter, documentType);
    return ApiResponse.success(res, 'Documents retrieved successfully', documents);
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Document details retrieved', document);
  } catch (error) {
    next(error);
  }
};

export const updateDocument = async (req, res, next) => {
  try {
    const document = await documentService.updateDocument(
      req.params.id,
      req.file,
      req.body,
      req.tenantFilter
    );
    return ApiResponse.success(res, 'Document updated successfully', document);
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id, req.tenantFilter);
    return ApiResponse.success(res, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
};
