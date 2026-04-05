import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import { AuthContext } from '../context/AuthContext';
import notesService from '../services/notesService';
import fileService from '../services/fileService';
import geminiService from '../services/geminiService';
import analyticsService from '../services/analyticsService';
import NoteEditor from '../components/NoteEditor';
import FileList from '../components/FileList';
import AIResultModal from '../components/AIResultModal';
import AnalyticsCard from '../components/AnalyticsCard';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const { user } = useContext(AuthContext);
  // Loading and Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const navigate = useNavigate();
  const isOwner = user && project && (String(project.owner._id || project.owner) === String(user._id || user.id || user));
  const [error, setError] = useState(null);

  // AI States
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const p = await projectService.getProject(id);
        if (p?.error) throw new Error(p.error);
        setProject(p);

        if (p?.isPublic && p?.publicId) {
          const url = `${window.location.origin}/public/project/${p.publicId}`;
          setShareUrl(url);
        }

        const n = await notesService.getNotesByProject(id);
        if (!n?.error) setNotes(n);

        const f = await fileService.getFilesByProject(id);
        if (!f?.error) setFiles(f);

        const a = await analyticsService.getAnalytics(id);
        if (!a?.error) setAnalytics(a);
      } catch (err) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSaveNote = async (payload) => {
    setIsSavingNote(true);
    const res = await notesService.createNote(id, payload);
    setIsSavingNote(false);

    if (!res?.error) {
      setNotes(prev => [res, ...prev]);
    } else {
      alert(res.error || 'Failed to save note');
    }
  };

  const handleAI = async (type, payload) => {
    setAiOpen(true);
    setIsAiLoading(true);
    setAiResult('');

    try {
      let res;
      if (type === 'explain') res = await geminiService.explain(payload);
      if (type === 'docs') res = await geminiService.docs(payload);
      if (type === 'readme') res = await geminiService.readme(payload);

      if (res?.error) {
        setAiResult(`Error: ${res.error}`);
      } else {
        setAiResult(res?.data || JSON.stringify(res));
      }
    } catch (err) {
      setAiResult(`Error: ${err.message || 'Failed to connect to AI service'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="mt-4 text-gray-600 font-medium">Loading project details...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 shadow-sm">
          <h3 className="font-bold text-lg mb-1">Failed to load project</h3>
          <p>{error}</p>
        </div>
      ) : project ? (
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h2>
            <p className="text-gray-600 text-lg">{project.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold text-xl mb-4 border-b pb-2">Notes</h3>
                <NoteEditor onSave={handleSaveNote} saving={isSavingNote} />
                {/** add scrolling when more than 1 note */}
                <div className={notes.length > 1 ? 'mt-6 space-y-4 max-h-56 overflow-auto pr-2' : 'mt-6 space-y-4'}>
                  {notes.map(n => (
                    <div key={n._id} className="p-4 border rounded-lg bg-gray-50 hover:bg-white transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                        <strong className="text-lg text-gray-800 mb-2 sm:mb-0">{n.title}</strong>
                        <div className="flex space-x-2">
                          <button
                            className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition-colors"
                            onClick={() => handleAI('explain', { text: n.content })}>
                            Explain with AI
                          </button>
                          <button
                            className="text-sm px-3 py-1.5 bg-green-100 text-green-700 font-medium rounded hover:bg-green-200 transition-colors"
                            onClick={() => handleAI('docs', { code: n.content })}>
                            Suggest Improvements
                          </button>
                        </div>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-3 rounded border font-mono">{n.content}</pre>
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-gray-500 text-center py-4">No notes yet. Create one above.</p>}
                </div>
              </div>

              {/* Analytics moved below Notes */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold text-xl mb-4 border-b pb-2">Analytics</h3>
                <div className="space-y-4">
                  <AnalyticsCard title="Notes per user" items={analytics?.notesPerUser} />
                  <AnalyticsCard title="Files per user" items={analytics?.filesPerUser} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold text-xl mb-4 border-b pb-2">AI Tools</h3>
                <button
                  className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
                  onClick={() => handleAI('readme', { projectInfo: project.description })}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <span>Generate README</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold text-xl mb-4 border-b pb-2">Files</h3>
                <div className="mb-4">
                  <label className="flex items-center gap-3">
                    <input type="file" className="hidden" id="fileInput" onChange={async (e) => {
                      const f = e.target.files[0];
                      if (!f) return;
                      const form = new FormData();
                      form.append('file', f);
                      form.append('projectId', id);
                      try {
                        setUploading(true);
                        setUploadProgress(0);
                        const res = await fileService.uploadFile(form, (p) => setUploadProgress(p));
                        if (res?._id) {
                          setFiles(prev => [res, ...prev]);
                        } else {
                          alert(res.error || 'Upload failed');
                        }
                      } catch (err) {
                        alert(err.message || 'Upload error');
                      } finally {
                        setUploading(false);
                        setUploadProgress(0);
                        e.target.value = null;
                      }
                    }} />
                    <label htmlFor="fileInput" className="px-3 py-2 bg-gray-100 rounded border cursor-pointer text-sm">Choose file</label>
                    <span className="text-sm text-gray-500">or drag and drop files here</span>
                  </label>
                  {uploading && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="h-2 bg-indigo-600" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</div>
                    </div>
                  )}
                </div>
                <FileList files={files} />
              </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="font-bold text-xl mb-4 border-b pb-2">Members</h3>
                  <div className="space-y-3 mb-4 max-h-40 overflow-auto pr-2">
                    {(project.members || []).map(m => (
                      <div key={m._id || m} className="flex items-center justify-between p-2 rounded border bg-gray-50">
                        <div>
                          <div className="font-medium text-sm">{m.name || m.email || 'Member'}</div>
                          <div className="text-xs text-gray-500">{m.email || ''}</div>
                        </div>
                        <div className="text-xs text-gray-400">{project.owner && String(project.owner._id || project.owner) === String(m._id || m) ? 'Owner' : ''}</div>
                      </div>
                    ))}
                  </div>
                  {isOwner ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <input value={memberEmail} onChange={(e)=>setMemberEmail(e.target.value)} placeholder="Invite by email" className="flex-1 px-3 py-2 border rounded" />
                        <button onClick={async ()=>{
                          if (!memberEmail) return alert('Enter email');
                          try {
                            setAddingMember(true);
                            const res = await projectService.addMember(id, { email: memberEmail });
                            if (res?.error) {
                              alert(res.error || 'Failed to add member');
                            } else {
                              const updated = await projectService.getProject(id);
                              if (!updated?.error) setProject(updated);
                              setMemberEmail('');
                            }
                          } catch (err) {
                            alert(err.message || 'Error adding member');
                          } finally {
                            setAddingMember(false);
                          }
                        }} className="px-3 py-2 bg-indigo-600 text-white rounded">{addingMember ? 'Adding...' : 'Add'}</button>
                      </div>

                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-semibold mb-2">Public Share</h4>
                        <div className="flex items-center gap-2">
                          <button onClick={async () => {
                            try {
                              setSharing(true);
                              const res = await projectService.shareProject(id);
                              if (res?.error) return alert(res.error);
                              const url = res.shareUrl || `${window.location.origin}/public/project/${res.publicId}`;
                              setShareUrl(url);
                              navigator.clipboard.writeText(url);
                              alert('Project shared. Link copied to clipboard');
                            } catch (err) {
                              alert(err.message || 'Share failed');
                            } finally { setSharing(false); }
                          }} className="px-3 py-2 bg-green-600 text-white rounded">{sharing ? 'Sharing...' : 'Make Public & Copy Link'}</button>
                          <button onClick={async () => {
                            try {
                              setSharing(true);
                              const res = await projectService.unshareProject(id);
                              if (res?.error) return alert(res.error);
                              setShareUrl('');
                              alert('Project unshared');
                            } catch (err) {
                              alert(err.message || 'Unshare failed');
                            } finally { setSharing(false); }
                          }} className="px-3 py-2 bg-red-100 text-red-700 rounded">Unshare</button>
                        </div>
                        {project.isPublic && shareUrl && <div className="mt-3 text-sm text-gray-600">Public Link: <a className="text-indigo-600 underline" href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a></div>}
                      </div>

                      <div className="mt-4">
                        <button className="w-full px-3 py-2 bg-red-600 text-white rounded" onClick={async ()=>{
                          if (!confirm('Delete this project and all its notes/files? This cannot be undone.')) return;
                          try {
                            const res = await projectService.deleteProject(id);
                            if (res?.error) return alert(res.error || 'Delete failed');
                            alert('Project deleted');
                            navigate('/');
                          } catch (err) {
                            alert(err.message || 'Delete failed');
                          }
                        }}>Delete Project</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Only project owner can invite members or change share settings.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        // </div>
      ) : null}

      <AIResultModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="AI Assistant"
        result={aiResult}
        isLoading={isAiLoading}
        projectId={id}
      />
    </div>
  );
};

export default ProjectPage;
