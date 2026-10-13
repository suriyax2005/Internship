import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import { FolderArchive, Download, FileText, Eye, ExternalLink } from 'lucide-react';

export const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documents');
        setDocuments(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          My Shared Documents & Apartment Rules
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access signed lease contracts, house rules, community guidelines, and uploaded receipts.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Accessing documents..." />
      ) : documents.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <FolderArchive className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Shared Files</h3>
          <p className="text-xs text-slate-500">Documents attached to your unit, apartment rules, or lease will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
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
                  <p className="text-xs text-slate-400 mt-1">Date: {formatDate(doc.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex-1 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Rules / File</span>
                </button>

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

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
