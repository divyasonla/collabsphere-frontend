import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import PublicProjectPage from './pages/PublicProjectPage';
import ProfilePage from './pages/ProfilePage';
import MyProjectsPage from './pages/MyProjectsPage';
// removed default import

const HomeRedirect = () => {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};
import Sidebar from './components/Sidebar';
import CreateProjectModal from './components/CreateProjectModal';
import CreateProjectPage from './pages/CreateProjectPage';

const Layout = () => {
  const { token } = useContext(AuthContext);
  const [createOpen, setCreateOpen] = useState(false);
  const contentClass = token ? 'flex-1 min-h-screen ml-64' : 'flex-1 min-h-screen';
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  useEffect(() => {
    const handler = () => setCreateOpen(true);
    window.addEventListener('openCreateProject', handler);
    return () => window.removeEventListener('openCreateProject', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {token && <Sidebar onCreateClick={openCreate} />}
      <div className={contentClass}>
        {!hideHeader && <Navbar />}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><MyProjectsPage /></PrivateRoute>} />
            <Route path="/create-project" element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
            <Route path="/project/:id" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/public/project/:id" element={<PublicProjectPage />} />
          </Routes>
        </main>
      </div>
      <CreateProjectModal open={createOpen} onClose={closeCreate} />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
