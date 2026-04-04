import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from '../components/CreateProjectModal';

const CreateProjectPage = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // open modal immediately when visiting page
    setOpen(true);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Project</h2>
      <p className="text-sm text-gray-600 mb-6">Use the form to create a new project. The modal will open automatically.</p>

      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded mb-6"
      >Open Create Project</button>

      <CreateProjectModal
        open={open}
        onClose={() => {
          setOpen(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default CreateProjectPage;
