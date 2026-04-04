import React, { useState } from 'react';
import fileService from '../services/fileService';

const AIResultModal = ({ open, onClose, title, result, isLoading, projectId }) => {
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!open) return null;

  const saveAsReadme = async () => {
    if (!result) return alert('Nothing to save');
    try {
      setSaving(true);
      setProgress(0);
      const blob = new Blob([result], { type: 'text/markdown;charset=utf-8' });
      const file = new File([blob], 'README.md', { type: 'text/markdown' });
      const form = new FormData();
      form.append('file', file);
      if (projectId) form.append('projectId', projectId);
      const res = await fileService.uploadFile(form, (p) => setProgress(p));
      if (res?.error) {
        alert(res.error || 'Failed to save README');
      } else {
        alert('README saved to project files');
        onClose();
      }
    } catch (err) {
      alert(err.message || 'Error saving README');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const copyToClipboard = async () => {
    try {
      const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch (err) {
      alert('Copy failed');
    }
  };

  const downloadResult = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-result.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-4xl w-full p-6 rounded-lg shadow-xl m-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
        </div>
        <div className="overflow-auto" style={{ maxHeight: '68vh' }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
               <span className="mt-4 text-gray-600 font-medium">Processing your request...</span>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded border overflow-auto">{result}</pre>
          )}
        </div>
        {!isLoading && (
          <div className="mt-4 flex items-center justify-end gap-3">
            <button onClick={copyToClipboard} className="px-3 py-2 border rounded">Copy</button>
            <button onClick={downloadResult} className="px-3 py-2 border rounded">Download</button>
            <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
            <button onClick={saveAsReadme} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">
              {saving ? `Saving... ${progress}%` : 'Save as README'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResultModal;
