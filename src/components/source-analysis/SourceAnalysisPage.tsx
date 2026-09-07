import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  CheckCircle2,
  ListChecks,
  Activity,
  FlaskConical,
  BookOpen,
  Image as ImageIcon,
  ArrowRight,
  Eye,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  FileCode2,
} from 'lucide-react';
import { Project, SourceDocument, AnalysisSummary } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { PageId } from '../common/Sidebar';

interface SourceAnalysisPageProps {
  activeProject: Project | null;
  onNavigate: (page: PageId) => void;
}

export const SourceAnalysisPage: React.FC<SourceAnalysisPageProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'activities' | 'experiments' | 'exercises' | 'media'>('overview');
  const [selectedSourceForView, setSelectedSourceForView] = useState<SourceDocument | null>(null);

  useEffect(() => {
    if (activeProject) {
      loadAnalysisData(activeProject.id);
    }
  }, [activeProject]);

  const loadAnalysisData = async (projectId: string) => {
    setLoading(true);
    try {
      const result = await apiService.analyzeProjectSources(projectId);
      setSources(result.sources);
      setSummary(result.summary);
    } catch (err) {
      console.error('Failed to load source analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGeneration = async () => {
    if (!activeProject) return;
    try {
      await apiService.generateLesson(activeProject.id);
      onNavigate('generation');
    } catch (err) {
      console.error('Failed to start generation:', err);
    }
  };

  if (!activeProject) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-sm">Vui lòng chọn hoặc tạo một dự án kế hoạch bài dạy trước.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
        >
          Về Bảng Điều Khiển
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-16 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Đang Phân Tích & Bóc Tách Tài Liệu Nguồn</h3>
        <p className="text-xs text-slate-500">
          Hệ thống AI đang đọc quét nội dung SGK, trích xuất cấu trúc văn bản, công thức hóa học và đối chiếu chuẩn đầu ra GDPT 2018...
        </p>
      </div>
    );
  }

  return (
    <div id="source-analysis-page" className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
            <FileSearch className="w-3.5 h-3.5 text-purple-600" />
            <span>Kết Quả Phân Tích Tài Liệu Nguồn (Multimodal Parsing)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeProject.title}
          </h1>
          <p className="text-xs text-slate-500">
            Môn {activeProject.subject} • {activeProject.grade} • Tổng cộng {sources.length} tài liệu nguồn được trích xuất
          </p>
        </div>

        <button
          id="btn-proceed-to-generation"
          onClick={handleStartGeneration}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tiến Hành Tạo Giáo Án (AI Pipeline)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Synthesis Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Tài liệu</span>
          <div className="text-xl font-bold text-slate-800 mt-1">{sources.length} tệp</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Mục tiêu (YCCĐ)</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            {summary?.detectedObjectives.length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">Hoạt động dạy</span>
          <div className="text-xl font-bold text-blue-700 mt-1">
            {summary?.detectedTeachingActivities.length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-semibold text-purple-600 uppercase">Thí nghiệm</span>
          <div className="text-xl font-bold text-purple-700 mt-1">
            {summary?.experiments.length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">Bài tập & Câu hỏi</span>
          <div className="text-xl font-bold text-amber-700 mt-1">
            {summary?.exercises.length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-semibold text-rose-600 uppercase">Hình ảnh / Bảng</span>
          <div className="text-xl font-bold text-rose-700 mt-1">
            {summary?.imagesAndTables.length || 0}
          </div>
        </div>
      </div>

      {/* Main Analysis Content: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Individual Source Document Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Danh mục Tài liệu Nguồn & Độ Tương Thích</span>
          </h2>

          <div className="space-y-3">
            {sources.map((doc) => (
              <div
                key={doc.id}
                id={`source-card-${doc.id}`}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800 truncate">{doc.fileName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{doc.fileType.toUpperCase()}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>

                  <Badge variant="success" size="sm">
                    {doc.relevanceScore}% Phù hợp
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{doc.summary}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Ưu tiên:{' '}
                    <strong className="text-slate-600">
                      {doc.priority === 'high' ? 'Cao' : doc.priority === 'medium' ? 'Vừa' : 'Thấp'}
                    </strong>
                  </span>

                  <button
                    id={`btn-view-markdown-${doc.id}`}
                    onClick={() => setSelectedSourceForView(doc)}
                    className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Markdown</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pedagogical Insights and Detected Items Tabs (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          {/* Analysis Summary Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Tổng Quan Đánh Giá Sư Phạm</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{summary?.overallSummary}</p>
          </div>

          {/* Navigation Tabs for detected items */}
          <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
            <button
              id="tab-btn-objectives"
              onClick={() => setActiveTab('objectives')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'objectives'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mục tiêu YCCĐ ({summary?.detectedObjectives.length || 0})
            </button>
            <button
              id="tab-btn-activities"
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'activities'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Hoạt động dạy học ({summary?.detectedTeachingActivities.length || 0})
            </button>
            <button
              id="tab-btn-experiments"
              onClick={() => setActiveTab('experiments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'experiments'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Thí nghiệm ({summary?.experiments.length || 0})
            </button>
            <button
              id="tab-btn-exercises"
              onClick={() => setActiveTab('exercises')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'exercises'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bài tập ({summary?.exercises.length || 0})
            </button>
            <button
              id="tab-btn-media"
              onClick={() => setActiveTab('media')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Hình ảnh & Bảng ({summary?.imagesAndTables.length || 0})
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="space-y-3 min-h-[280px]">
            {activeTab === 'objectives' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700">Yêu cầu cần đạt trích xuất từ SGK & CT GDPT 2018:</h4>
                <ul className="space-y-2">
                  {summary?.detectedObjectives.map((obj, i) => (
                    <li
                      key={i}
                      className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg text-xs text-emerald-900 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700">Các hoạt động dạy học được nhận diện:</h4>
                <ul className="space-y-2">
                  {summary?.detectedTeachingActivities.map((act, i) => (
                    <li
                      key={i}
                      className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-start gap-2.5"
                    >
                      <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'experiments' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700">Thí nghiệm thực hành & an toàn phòng lab:</h4>
                <ul className="space-y-2">
                  {summary?.experiments.map((exp, i) => (
                    <li
                      key={i}
                      className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg text-xs text-purple-900 flex items-start gap-2.5"
                    >
                      <FlaskConical className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'exercises' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700">Ngân hàng câu hỏi và bài tập phát triển tư duy:</h4>
                <ul className="space-y-2">
                  {summary?.exercises.map((ex, i) => (
                    <li
                      key={i}
                      className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-xs text-amber-900 flex items-start gap-2.5"
                    >
                      <ListChecks className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700">Sơ đồ, bảng biểu và hình ảnh 3D nhận diện được:</h4>
                <ul className="space-y-2">
                  {summary?.imagesAndTables.map((img, i) => (
                    <li
                      key={i}
                      className="p-3 bg-rose-50/60 border border-rose-100 rounded-lg text-xs text-rose-900 flex items-start gap-2.5"
                    >
                      <ImageIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{img}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pedagogical Guidance Box */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Gợi ý phân bổ tiến trình sư phạm (AI Insights):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {summary?.pedagogicalInsights.map((insight, i) => (
                <div key={i} className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                  💡 {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Extracted Markdown Content */}
      <Modal
        isOpen={!!selectedSourceForView}
        onClose={() => setSelectedSourceForView(null)}
        title={`Nội Dung Markdown Trích Xuất: ${selectedSourceForView?.fileName}`}
        subtitle={`Dung lượng: ${selectedSourceForView?.fileSize} • Định dạng: ${selectedSourceForView?.fileType.toUpperCase()}`}
        maxWidth="4xl"
      >
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed max-h-[60vh]">
            <pre>{selectedSourceForView?.markdownContent}</pre>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedSourceForView(null)}
              className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
