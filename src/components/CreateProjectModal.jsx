import React, { useState, useEffect } from 'react';
import projectService from '../services/projectService';
import { useNavigate } from 'react-router-dom';

const CreateProjectModal = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setIsPublic(false);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    const res = await projectService.createProject({ title, description, isPublic });
    setLoading(false);
    if (res?._id) {
      onCreated && onCreated(res);
      // reset form before closing
      setTitle('');
      setDescription('');
      setIsPublic(false);
      onClose();
      navigate(`/project/${res._id}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-40">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Create Project</h3>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input className="w-full border px-3 py-2 rounded" value={title} onChange={(e)=>setTitle(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea className="w-full border px-3 py-2 rounded" value={description} onChange={(e)=>setDescription(e.target.value)} />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e)=>setIsPublic(e.target.checked)} />
            <label htmlFor="isPublic" className="text-sm text-gray-600">Public project</label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
