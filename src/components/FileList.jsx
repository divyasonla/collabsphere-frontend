import React, { useState } from 'react';

// determine backend base URL (remove trailing /api if present)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const BACKEND_BASE = API_BASE.replace(/\/api\/?$/, '') || 'http://localhost:3000';

const FilePreviewModal = ({ open, onClose, file, content, type }) => {
  if (!open || !file) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-xl flex flex-col max-h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg truncate pr-4">{file.originalName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center min-h-[50vh] p-4">
          {type === 'image' && (
            <img src={`${BACKEND_BASE}/uploads/${file.filename}`} alt={file.originalName} className="max-w-full max-h-[60vh] object-contain shadow-sm" />
          )}
          {type === 'text' && (
            <pre className="w-full h-full text-sm font-mono text-gray-800 whitespace-pre-wrap bg-white p-4 rounded border shadow-sm max-h-[60vh] overflow-auto">{content}</pre>
          )}
          {type === 'loading' && (
            <div className="flex flex-col items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <span className="mt-4 text-gray-500 font-medium">Loading preview...</span>
            </div>
          )}
          {type === 'error' && (
            <div className="text-red-500 py-12 flex flex-col items-center">
              <svg className="w-12 h-12 mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Failed to load text preview.</span>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end bg-white">
          <a href={`${BACKEND_BASE}/uploads/${file.filename}`} target="_blank" rel="noreferrer" className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-medium shadow-sm">
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  );
};

const FileList = ({ files }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [previewType, setPreviewType] = useState('');

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-gray-500 font-medium text-sm">No files uploaded yet</span>
      </div>
    );
  }

  const handlePreview = async (file) => {
    setPreviewFile(file);
      if (file.mimeType.startsWith('image/')) {
      setPreviewType('image');
    } else if (file.mimeType.startsWith('text/') || file.mimeType === 'application/json' || file.mimeType === 'application/javascript') {
      setPreviewType('loading');
      try {
        const res = await fetch(`${BACKEND_BASE}/uploads/${file.filename}`);
        if (!res.ok) throw new Error('Failed to load text');
        const text = await res.text();
        setPreviewContent(text);
        setPreviewType('text');
      } catch (e) {
        setPreviewType('error');
      }
    } else {
      window.open(`${BACKEND_BASE}/uploads/${file.filename}`, '_blank');
      setPreviewFile(null);
    }
  };

  const listContainerClass = (files.length || 0) > 2 ? 'max-h-56 overflow-auto pr-2' : '';

  return (
    <>
      <div className={listContainerClass}>
        <ul className="space-y-3">
          {files.map(f => (
            <li key={f._id} className="p-3 border rounded-lg bg-gray-50 hover:bg-white transition-all flex justify-between items-center group shadow-sm hover:shadow">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="flex-shrink-0 p-2 bg-indigo-100 text-indigo-600 rounded">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 truncate text-sm">{f.originalName}</div>
                  <div className="text-xs text-gray-500 mt-1">{f.mimeType.split('/')[1]?.toUpperCase() || f.mimeType} • {Math.round((f.size || 0) / 1024)} KB</div>
                </div>
              </div>
              <button
                onClick={() => handlePreview(f)}
                className="flex-shrink-0 ml-4 text-sm px-4 py-1.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
              >
                Preview
              </button>
            </li>
          ))}
        </ul>
      </div>
      <FilePreviewModal
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        content={previewContent}
        type={previewType}
      />
    </>
  );
};

export default FileList;
