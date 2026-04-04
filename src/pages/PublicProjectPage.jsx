import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import notesService from '../services/notesService';
import fileService from '../services/fileService';
import FileList from '../components/FileList';

const PublicProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const load = async () => {
      const p = await projectService.getPublicProject(id);
      if (!p?.error) setProject(p);
      const n = await notesService.getNotesByProject(id);
      if (!n?.error) setNotes(n);
      const f = await fileService.getFilesByProject(id);
      if (!f?.error) setFiles(f);
    };
    load();
  }, [id]);

  if (!project) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl">{project.title}</h2>
      <p className="text-sm text-gray-600">{project.description}</p>
      <h3 className="mt-4 font-bold">Notes</h3>
      <div className={notes.length > 1 ? 'space-y-3 max-h-56 overflow-auto pr-2' : 'space-y-3'}>
        {notes.map(n => (
          <div key={n._id} className="p-2 border rounded">
            <strong>{n.title}</strong>
            <pre className="whitespace-pre-wrap text-sm mt-2">{n.content}</pre>
          </div>
        ))}
      </div>
      <h3 className="mt-4 font-bold">Files</h3>
      <FileList files={files} />
    </div>
  );
};

export default PublicProjectPage;
