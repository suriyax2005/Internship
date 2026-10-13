import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments, uploadDocument, updateDocument, deleteDocument } from '../../store/slices/documentSlice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import { FolderArchive, Upload, Trash2, Download, FileText, Edit3, Eye, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Documents = () => {
  const dispatch = useDispatch();
  const { list: documents, loading } = useSelector((state) => state.documents);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const openUploadModal = () => {
    setEditingDoc(null);
    reset({
      title: '',
      documentType: 'LEASE',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setValue('title', doc.title);
    setValue('documentType', doc.documentType);
    setIsModalOpen(true);
  };

  const onSaveDocument = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('documentType', data.documentType);
    if (data.file && data.file[0]) {
      formData.append('file', data.file[0]);
    }

    if (editingDoc) {
      const res = await dispatch(updateDocument({ id: editingDoc._id, formData }));
      if (updateDocument.fulfilled.match(res)) {
        reset();
        setEditingDoc(null);
        setIsModalOpen(false);
      }
    } else {
      const res = await dispatch(uploadDocument(formData));
      if (uploadDocument.fulfilled.match(res)) {
        reset();
        setIsModalOpen(false);
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this document entry?')) {
      dispatch(deleteDocument(id));
    }
  };

  const filteredDocs = selectedType
    ? documents.filter((d) => d.documentType === selectedType)
    : documents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Document Cloud Vault
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store, update, and retrieve lease contracts, tenant IDs, property rules, and payment receipts.
          </p>
        </div>

        <button
          onClick={openUploadModal}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Type Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {['', 'LEASE', 'TENANT', 'PROPERTY', 'RECEIPT', 'OTHER'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedType === type
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {type === 'PROPERTY' ? 'Property Rules & Guidelines' : (type || 'All Documents')}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Accessing document vault..." />
      ) : filteredDocs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <FolderArchive className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Documents Stored</h3>
          <p className="text-xs text-slate-500">Upload lease agreements or property compliance files.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
                    <FileText className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {doc.documentType === 'PROPERTY' ? 'PROPERTY RULES' : doc.documentType}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Uploaded: {formatDate(doc.createdAt)}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                    title="Open in new tab / download"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-1.5 text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                    title="Edit Document"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDoc(null);
        }}
        title={editingDoc ? 'Update Document / Rules' : 'Upload File to Vault'}
      >
        <form onSubmit={handleSubmit(onSaveDocument)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Document title is required' })}
              placeholder="e.g. Property Rules and Tenant Guidelines 2026"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Category
            </label>
            <select
              {...register('documentType')}
              defaultValue="LEASE"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="LEASE">Lease Agreement</option>
              <option value="TENANT">Tenant Identification</option>
              <option value="PROPERTY">Property Rules & Guidelines</option>
              <option value="RECEIPT">Payment Receipt</option>
              <option value="OTHER">Other Reference File</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {editingDoc ? 'Replace File (Optional)' : 'Choose File (PDF, Image, Doc) *'}
            </label>
            <input
              type="file"
              {...register('file', { required: editingDoc ? false : 'File selection is required' })}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
            />
            {errors.file && <p className="text-xs text-rose-500 mt-1">{errors.file.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            {editingDoc ? 'Save Updates' : 'Upload to Vault'}
          </button>
        </form>
      </Modal>

      {/* In-app Document Viewer Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span>Category: <strong className="text-slate-700 dark:text-slate-200">{previewDoc.documentType}</strong></span>
              <span>Uploaded: {formatDate(previewDoc.createdAt)}</span>
            </div>

            <div className="w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <iframe
                src={previewDoc.fileUrl}
                title={previewDoc.title}
                className="w-full h-full rounded-2xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={previewDoc.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </a>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
