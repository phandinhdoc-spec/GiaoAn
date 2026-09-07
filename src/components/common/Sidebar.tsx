import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileSearch,
  Cpu,
  FileText,
  ShieldCheck,
  FileCode2,
  Library,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  User,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Project } from '../../types';
import { Badge } from './Badge';
import { TeacherProfile } from '../auth/TeacherAuthModal';

export type PageId =
  | 'dashboard'
  | 'new-lesson'
  | 'source-analysis'
  | 'generation'
  | 'editor'
  | 'review'
  | 'pdf-output'
  | 'templates';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  activeProject: Project | null;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  sidebarWidth: number;
  onResizeSidebar: (width: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  teacherProfile: TeacherProfile;
  onOpenTeacherAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  activeProject,
  projects,
  onSelectProject,
  sidebarWidth,
  onResizeSidebar,
  isCollapsed,
  onToggleCollapse,
  teacherProfile,
  onOpenTeacherAuth,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems: Array<{
    id: PageId;
    label: string;
    icon: React.ElementType;
    requiresProject?: boolean;
    badge?: string;
  }> = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { id: 'new-lesson', label: 'Tạo giáo án mới', icon: PlusCircle },
    {
      id: 'source-analysis',
      label: 'Phân tích tài liệu',
      icon: FileSearch,
      requiresProject: true,
      badge: activeProject ? `${activeProject.sourceCount} tệp` : undefined,
    },
    {
      id: 'generation',
      label: 'Tiến trình AI',
      icon: Cpu,
      requiresProject: true,
      badge: activeProject ? `${activeProject.progressPercentage}%` : undefined,
    },
    {
      id: 'editor',
      label: 'Soạn thảo giáo án',
      icon: FileText,
      requiresProject: true,
    },
    {
      id: 'review',
      label: 'Thẩm định sư phạm',
      icon: ShieldCheck,
      requiresProject: true,
    },
    {
      id: 'pdf-output',
      label: 'Xuất bản Typst / PDF',
      icon: FileCode2,
      requiresProject: true,
    },
    { id: 'templates', label: 'Kho mẫu bài dạy', icon: Library },
  ];

  // Handle drag resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(200, Math.min(420, e.clientX));
      onResizeSidebar(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResizeSidebar]);

  return (
    <aside
      ref={sidebarRef}
      id="app-sidebar"
      style={{ width: isCollapsed ? '72px' : `${sidebarWidth}px` }}
      className={`relative bg-slate-900 text-slate-200 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none z-30 transition-[width] duration-150 ${
        isResizing ? 'select-none transition-none' : ''
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white tracking-tight truncate">Giáo Án AI</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                  5512
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">Trợ lý Sư phạm Thông minh</p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Collapse toggle button */}
        {!isCollapsed && (
          <button
            id="sidebar-btn-collapse"
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Thu gọn thanh điều hướng"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* When collapsed, show expand button */}
      {isCollapsed && (
        <div className="p-2 border-b border-slate-800 flex justify-center">
          <button
            id="sidebar-btn-expand"
            onClick={onToggleCollapse}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Mở rộng thanh điều hướng"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Project Selector / Context Pill */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
            <span>Dự án đang mở</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          {projects.length > 0 ? (
            <select
              id="sidebar-project-select"
              value={activeProject?.id || ''}
              onChange={(e) => onSelectProject(e.target.value)}
              className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.subject} {p.grade} - {p.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-slate-500 px-1 py-1 italic">Chưa có dự án nào</div>
          )}
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
            Quy trình biên soạn
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isDisabled = item.requiresProject && !activeProject;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => !isDisabled && onNavigate(item.id)}
              disabled={isDisabled}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-3' : 'justify-between px-3 py-2.5'
              } rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : isDisabled
                  ? 'text-slate-600 cursor-not-allowed opacity-50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive
                      ? 'bg-indigo-700 text-indigo-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User / Teacher Profile Info (Interactive!) */}
      <div
        id="sidebar-teacher-profile"
        onClick={onOpenTeacherAuth}
        className="p-3 border-t border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 transition-colors cursor-pointer"
        title="Quản lý thông tin Giáo viên & Đăng nhập"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white border border-indigo-400/40 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {teacherProfile.avatarText || 'GV'}
          </div>
          {!isCollapsed && (
            <div className="truncate flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-200 truncate">{teacherProfile.name}</p>
              </div>
              <p className="text-[11px] text-indigo-300 truncate">{teacherProfile.schoolName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Resize Handle Drag Bar on Right Edge */}
      {!isCollapsed && (
        <div
          id="sidebar-resize-handle"
          onMouseDown={() => setIsResizing(true)}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/80 transition-colors group flex items-center justify-center"
          title="Kéo sang trái/phải để thay đổi độ rộng thanh công cụ"
        >
          <div className="w-0.5 h-8 bg-slate-600 group-hover:bg-white rounded-full" />
        </div>
      )}
    </aside>
  );
};
