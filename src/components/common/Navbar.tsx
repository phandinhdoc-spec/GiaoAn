import React from 'react';
import {
  ChevronRight,
  Sparkles,
  FileCheck,
  FileDown,
  User,
  PanelLeft,
  GraduationCap,
} from 'lucide-react';
import { Project } from '../../types';
import { Badge } from './Badge';
import { PageId } from './Sidebar';
import { TeacherProfile } from '../auth/TeacherAuthModal';

interface NavbarProps {
  currentPage: PageId;
  activeProject: Project | null;
  onNavigate: (page: PageId) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  teacherProfile: TeacherProfile;
  onOpenTeacherAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activeProject,
  onNavigate,
  isSidebarCollapsed,
  onToggleSidebar,
  teacherProfile,
  onOpenTeacherAuth,
}) => {
  const workflowSteps: Array<{ id: PageId; label: string; stage: string }> = [
    { id: 'source-analysis', label: 'Tài liệu nguồn', stage: 'uploaded' },
    { id: 'generation', label: 'Phân tích AI', stage: 'analyzing' },
    { id: 'editor', label: 'Soạn thảo', stage: 'writing' },
    { id: 'review', label: 'Thẩm định 5512', stage: 'reviewing' },
    { id: 'pdf-output', label: 'Xuất bản PDF', stage: 'completed' },
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Đã hoàn thành</Badge>;
      case 'reviewing':
        return <Badge variant="warning">Đang thẩm định</Badge>;
      case 'planning':
      case 'writing':
        return <Badge variant="info">Đang tạo giáo án</Badge>;
      case 'analyzing':
      case 'converting':
        return <Badge variant="purple">Đang phân tích</Badge>;
      default:
        return <Badge variant="default">Khởi tạo</Badge>;
    }
  };

  return (
    <header
      id="app-navbar"
      className="h-16 bg-white border-b border-slate-200 px-5 flex items-center justify-between z-20 shrink-0 select-none shadow-2xs"
    >
      {/* Left: Sidebar toggle + Project title & metadata */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          id="navbar-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          title={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {activeProject ? (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 truncate max-w-sm sm:max-w-md">
                {activeProject.title}
              </h1>
              {getStatusBadge(activeProject.status)}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-semibold text-slate-700">{activeProject.subject}</span>
              <span>•</span>
              <span className="font-medium text-slate-600">{activeProject.grade}</span>
              <span>•</span>
              <span>{activeProject.periods} tiết</span>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-sm font-bold text-slate-900">Hệ Thống Soạn Kế Hoạch Bài Dạy AI</h1>
            <p className="text-xs text-slate-500">Mẫu chuẩn sư phạm Công văn 5512/BGDĐT-GDTrH</p>
          </div>
        )}
      </div>

      {/* Center: Workflow Stepper Navigation */}
      {activeProject && (
        <div className="hidden xl:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          {workflowSteps.map((step, idx) => {
            const isCurrent = currentPage === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  id={`stepper-btn-${step.id}`}
                  onClick={() => onNavigate(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{step.label}</span>
                </button>
                {idx < workflowSteps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Right: Actions & Teacher Profile button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {activeProject && (
          <>
            <button
              id="navbar-action-review"
              onClick={() => onNavigate('review')}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Thẩm định 5512</span>
            </button>

            <button
              id="navbar-action-pdf"
              onClick={() => onNavigate('pdf-output')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Xuất PDF</span>
            </button>
          </>
        )}

        {/* Teacher Auth / Profile Trigger Button */}
        <button
          id="navbar-btn-teacher-auth"
          onClick={onOpenTeacherAuth}
          className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
          title="Thông tin Giáo viên & Đăng nhập"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
            {teacherProfile.avatarText || 'GV'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
              {teacherProfile.name.replace('Thầy ', '').replace('Cô ', '').replace('ThS. ', '')}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight truncate">
              {teacherProfile.isLoggedIn ? 'Đã đăng nhập' : 'Đăng nhập'}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
