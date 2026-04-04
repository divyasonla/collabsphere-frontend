import React, { useState } from 'react';

const NoteEditor = ({ initial = { title: '', content: '' }, onSave, saving }) => {
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content });
    if (!saving) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
        placeholder="Note Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2.5 border border-gray-300 rounded h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow font-mono text-sm"
        placeholder="Write markdown content here..."
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <div className="flex justify-end">
        <button
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition-colors flex items-center shadow-sm disabled:bg-indigo-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={saving}
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
