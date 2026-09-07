import React, { useState, useEffect } from 'react';
import { Project } from './types';
import { apiService } from './services/api';
import { Sidebar, PageId } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { NewLessonPage } from './components/new-lesson/NewLessonPage';
import { SourceAnalysisPage } from './components/source-analysis/SourceAnalysisPage';
import { GenerationProgressPage } from './components/generation/GenerationProgressPage';
import { LessonEditorPage } from './components/editor/LessonEditorPage';
import { ReviewPage } from './components/review/ReviewPage';
import { PdfOutputPage } from './components/output/PdfOutputPage';
import { TemplatesPage } from './components/templates/TemplatesPage';
import { TeacherAuthModal, TeacherProfile } from './components/auth/TeacherAuthModal';

const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  id: 'teacher-1',
  name: 'Thầy Phan Đình Đốc',
  email: 'phandinhdoc@gmail.com',
  role: 'Tổ trưởng Chuyên môn KHTN',
  schoolName: 'Trường THCS Nguyễn Du',
  subject: 'Khoa học tự nhiên',
  gradeLevels: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
  signatureEnabled: true,
  avatarText: 'PĐ',
  isLoggedIn: true,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Sidebar resizability & collapse state
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = localStorage.getItem('giaoan_sidebar_width');
    return saved ? parseInt(saved, 10) : 260;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('giaoan_sidebar_collapsed');
    return saved === 'true';
  });

  // Teacher profile state & auth modal
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('giaoan_teacher_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TEACHER_PROFILE;
      }
    }
    return DEFAULT_TEACHER_PROFILE;
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
      if (data.length > 0 && !activeProject) {
        setActiveProject(data[0]);
      }
    } catch (err) {
      console.error('Failed to initialize projects:', err);
    }
  };

  const handleResizeSidebar = (newWidth: number) => {
    setSidebarWidth(newWidth);
    localStorage.setItem('giaoan_sidebar_width', newWidth.toString());
  };

  const handleToggleCollapseSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('giaoan_sidebar_collapsed', next.toString());
      return next;
    });
  };

  const handleUpdateTeacherProfile = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    localStorage.setItem('giaoan_teacher_profile', JSON.stringify(profile));
  };

  const handleSelectProject = async (projectId: string) => {
    try {
      const project = await apiService.getProject(projectId);
      setActiveProject(project);
      const list = await apiService.getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to select project:', err);
    }
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased select-text">
      {/* Left Resizable Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        activeProject={activeProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        sidebarWidth={sidebarWidth}
        onResizeSidebar={handleResizeSidebar}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapseSidebar}
        teacherProfile={teacherProfile}
        onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Navbar */}
        <Navbar
          currentPage={currentPage}
          activeProject={activeProject}
          onNavigate={handleNavigate}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleCollapseSidebar}
          teacherProfile={teacherProfile}
          onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onSelectProject={handleSelectProject}
            />
          )}

          {currentPage === 'new-lesson' && (
            <NewLessonPage
              onNavigate={handleNavigate}
              onSelectProject={handleSelectProject}
            />
          )}

          {currentPage === 'source-analysis' && (
            <SourceAnalysisPage
              activeProject={activeProject}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'generation' && (
            <GenerationProgressPage
              activeProject={activeProject}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'editor' && (
            <LessonEditorPage
              activeProject={activeProject}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'review' && (
            <ReviewPage
              activeProject={activeProject}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'pdf-output' && (
            <PdfOutputPage
              activeProject={activeProject}
              onNavigate={handleNavigate}
              teacherProfile={teacherProfile}
            />
          )}

          {currentPage === 'templates' && (
            <TemplatesPage
              activeProject={activeProject}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* Teacher Authentication & Profile Modal */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        currentProfile={teacherProfile}
        onUpdateProfile={handleUpdateTeacherProfile}
      />
    </div>
  );
}
