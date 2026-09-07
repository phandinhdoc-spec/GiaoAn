import React, { useState, useEffect } from 'react';
import {
  Plus,
  BookOpen,
  FileCheck2,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  Edit3,
  FileSearch,
  FileCode2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  Search,
  Filter,
} from 'lucide-react';
import { Project, JobStatus } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../common/Badge';
import { PageId } from '../common/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onSelectProject: (projectId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Thầy/Cô có chắc chắn muốn xóa kế hoạch bài dạy này không?')) {
      await apiService.deleteProject(id);
      loadProjects();
    }
  };

  const handleOpenProject = (id: string, targetPage: PageId = 'editor') => {
    onSelectProject(id);
    onNavigate(targetPage);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? p.status === 'completed'
        : statusFilter === 'in_progress'
        ? p.status !== 'completed' && p.status !== 'failed'
        : true;

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.grade.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const inProgressCount = projects.filter((p) => p.status !== 'completed').length;

  return (
    <div id="dashboard-page" className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Quick Create */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-7 rounded-2xl shadow-lg border border-slate-800">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Kiến tạo Giáo án theo Công văn 5512/BGDĐT-GDTrH</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý Kế hoạch Bài dạy Khoa học tự nhiên
          </h1>
          <p className="text-sm text-slate-300">
            Tự động chuyển đổi tài liệu nguồn (SGK, bài giảng, tài liệu chuyên khảo) thành kế hoạch bài dạy chuẩn sư phạm, phân tích mục tiêu, thẩm định và xuất bản PDF/Typst.
          </p>
        </div>

        <button
          id="dashboard-btn-create"
          onClick={() => onNavigate('new-lesson')}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Tạo Giáo Án Mới</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số giáo án
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-800">{projects.length}</div>
            <p className="text-xs text-slate-500 mt-1">Đã lưu trữ trong bộ nhớ hệ thống</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đã xuất bản Typst / PDF
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700">{completedCount}</div>
            <p className="text-xs text-slate-500 mt-1">Chuẩn format in ấn A4 Bộ GD&ĐT</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đang phân tích & thẩm định
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-700">{inProgressCount}</div>
            <p className="text-xs text-slate-500 mt-1">Tiến trình AI & rà soát mục tiêu</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tiết kiệm thời gian
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-indigo-700">~85%</div>
            <p className="text-xs text-slate-500 mt-1">So với soạn thảo thủ công truyền thống</p>
          </div>
        </div>
      </div>

      {/* Projects List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800">Danh sách Kế hoạch Bài dạy gần đây</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
              {filteredProjects.length} giáo án
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="dashboard-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên bài học, môn, lớp..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white w-64"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                id="filter-all"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tất cả
              </button>
              <button
                id="filter-completed"
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hoàn thành
              </button>
              <button
                id="filter-inprogress"
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  statusFilter === 'in_progress'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Đang xử lý
              </button>
            </div>
          </div>
        </div>

        {/* Project Cards / Table List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
            Đang tải dữ liệu kế hoạch bài dạy...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Chưa có kế hoạch bài dạy nào phù hợp</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Thầy/Cô có thể tạo giáo án mới bằng cách tải lên tài liệu SGK hoặc tài liệu tham khảo.
            </p>
            <button
              onClick={() => onNavigate('new-lesson')}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Tạo Kế Hoạch Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProjects.map((project) => {
              const isCompleted = project.status === 'completed';
              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => handleOpenProject(project.id, 'editor')}
                  className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 min-w-0 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </span>
                      {isCompleted ? (
                        <Badge variant="success">Hoàn tất 100%</Badge>
                      ) : (
                        <Badge variant="info">Tiến độ: {project.progressPercentage}%</Badge>
                      )}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {project.periods} tiết
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {project.learningOutcomes || project.additionalNotes || 'Chưa có mô tả mục tiêu'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="font-medium text-slate-600">
                        {project.subject} • {project.grade}
                      </span>
                      <span>•</span>
                      <span>{project.sourceCount} tài liệu nguồn</span>
                      <span>•</span>
                      <span>Cập nhật: {project.updatedAt}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      id={`btn-analyze-${project.id}`}
                      onClick={() => handleOpenProject(project.id, 'source-analysis')}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Xem phân tích tài liệu"
                    >
                      <FileSearch className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-editor-${project.id}`}
                      onClick={() => handleOpenProject(project.id, 'editor')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Soạn thảo</span>
                    </button>

                    <button
                      id={`btn-pdf-${project.id}`}
                      onClick={() => handleOpenProject(project.id, 'pdf-output')}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>Xem PDF</span>
                    </button>

                    <button
                      id={`btn-delete-${project.id}`}
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa kế hoạch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
