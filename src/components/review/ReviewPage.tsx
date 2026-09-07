import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Wrench,
  Check,
  Filter,
  FileCheck2,
  RotateCcw,
} from 'lucide-react';
import { Project, ReviewIssue, ReviewSeverity } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { PageId } from '../common/Sidebar';

interface ReviewPageProps {
  activeProject: Project | null;
  onNavigate: (page: PageId) => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [issues, setIssues] = useState<ReviewIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixingIssueId, setFixingIssueId] = useState<string | null>(null);
  const [selectedIssueDetail, setSelectedIssueDetail] = useState<ReviewIssue | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeProject) {
      loadReviewData(activeProject.id);
    }
  }, [activeProject]);

  const loadReviewData = async (projectId: string) => {
    setLoading(true);
    try {
      const data = await apiService.reviewLesson(projectId);
      setIssues(data.issues);
    } catch (err) {
      console.error('Failed to load review issues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFixWithAI = async (issueId: string) => {
    if (!activeProject) return;
    setFixingIssueId(issueId);
    try {
      const result = await apiService.fixIssueWithAI(activeProject.id, issueId);
      setIssues((prev) =>
        prev.map((iss) => (iss.id === issueId ? result.issue : iss))
      );
      setToastMessage('AI đã tự động điều chỉnh nội dung giáo án để khắc phục vấn đề!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sửa với AI');
    } finally {
      setFixingIssueId(null);
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
      <div className="p-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Đang rà soát và thẩm định các tiêu chí sư phạm CV 5512...</p>
      </div>
    );
  }

  const errorCount = issues.filter((i) => i.severity === 'error' && !i.isResolved).length;
  const warningCount = issues.filter((i) => i.severity === 'warning' && !i.isResolved).length;
  const successCount = issues.filter((i) => i.severity === 'success' || i.isResolved).length;

  const filteredIssues = issues.filter((i) => {
    if (filterSeverity === 'all') return true;
    if (filterSeverity === 'error') return i.severity === 'error';
    if (filterSeverity === 'warning') return i.severity === 'warning';
    if (filterSeverity === 'success') return i.severity === 'success' || i.isResolved;
    return true;
  });

  return (
    <div id="review-page" className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thẩm Định Sư Phạm & Tiêu Chuẩn Công Văn 5512/BGDĐT</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeProject.title}
          </h1>
          <p className="text-xs text-slate-500">
            Kết quả kiểm duyệt tự động về mục tiêu, tiến trình 4 bước, an toàn thực hành và rubric đánh giá
          </p>
        </div>

        <button
          id="btn-proceed-to-pdf"
          onClick={() => onNavigate('pdf-output')}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Xuất Bản Typst & PDF</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng số tiêu chí</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{issues.length} tiêu chí</div>
          <p className="text-[11px] text-slate-400 mt-1">Đã quét toàn diện giáo án</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase">Cần chỉnh sửa</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{errorCount} lỗi</div>
          <p className="text-[11px] text-rose-600/80 mt-1">Cần khắc phục trước khi in ấn</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Khuyến nghị</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{warningCount} cảnh báo</div>
          <p className="text-[11px] text-amber-600/80 mt-1">Tối ưu hóa thời lượng & phân hóa</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Đạt chuẩn 5512</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{successCount} tiêu chí</div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Đạt chuẩn sư phạm xuất sắc</p>
        </div>
      </div>

      {/* Issues Table & List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Chi tiết Tiêu chí Thẩm định & Hành động Khắc phục
            </h2>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              id="filter-review-all"
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tất cả ({issues.length})
            </button>
            <button
              id="filter-review-error"
              onClick={() => setFilterSeverity('error')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                filterSeverity === 'error'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              Lỗi ({issues.filter((i) => i.severity === 'error').length})
            </button>
            <button
              id="filter-review-warning"
              onClick={() => setFilterSeverity('warning')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                filterSeverity === 'warning'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-500 hover:text-amber-700'
              }`}
            >
              Cảnh báo ({issues.filter((i) => i.severity === 'warning').length})
            </button>
            <button
              id="filter-review-success"
              onClick={() => setFilterSeverity('success')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                filterSeverity === 'success'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              Đạt chuẩn ({issues.filter((i) => i.severity === 'success' || i.isResolved).length})
            </button>
          </div>
        </div>

        {/* Issues List */}
        <div className="divide-y divide-slate-100">
          {filteredIssues.map((issue) => {
            const isResolved = issue.isResolved;
            return (
              <div
                key={issue.id}
                id={`issue-row-${issue.id}`}
                className={`p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors ${
                  isResolved ? 'bg-emerald-50/20' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {isResolved ? (
                      <Badge variant="success">
                        <Check className="w-3.5 h-3.5" /> Đã khắc phục thành công
                      </Badge>
                    ) : issue.severity === 'error' ? (
                      <Badge variant="error">Lỗi cần sửa</Badge>
                    ) : issue.severity === 'warning' ? (
                      <Badge variant="warning">Cảnh báo sư phạm</Badge>
                    ) : (
                      <Badge variant="success">Đạt chuẩn</Badge>
                    )}

                    <span className="font-bold text-xs text-slate-800">{issue.title}</span>

                    {issue.sectionTitle && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        Vị trí: {issue.sectionTitle}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-indigo-900 block">💡 Hướng dẫn khắc phục đề xuất:</span>
                    <p className="text-slate-600 leading-relaxed">{issue.suggestedFix}</p>
                  </div>
                </div>

                {/* Issue Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    id={`btn-view-issue-${issue.id}`}
                    onClick={() => setSelectedIssueDetail(issue)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem vị trí</span>
                  </button>

                  {!isResolved && issue.severity !== 'success' && (
                    <button
                      id={`btn-fix-issue-${issue.id}`}
                      disabled={fixingIssueId === issue.id}
                      onClick={() => handleFixWithAI(issue.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {fixingIssueId === issue.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang sửa...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Sửa Tự Động Bằng AI</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: View Issue Details & Target Section */}
      <Modal
        isOpen={!!selectedIssueDetail}
        onClose={() => setSelectedIssueDetail(null)}
        title={`Chi Tiết Vấn Đề Thẩm Định: ${selectedIssueDetail?.title}`}
        subtitle={`Mục bài dạy: ${selectedIssueDetail?.sectionTitle || 'Toàn bộ bài học'}`}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase">Mô tả hiện trạng:</h4>
            <p className="text-xs text-slate-700 leading-relaxed">{selectedIssueDetail?.description}</p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 space-y-2">
            <h4 className="text-xs font-bold text-indigo-950 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Đề xuất chỉnh sửa của chuyên gia AI:</span>
            </h4>
            <p className="text-xs text-indigo-900 leading-relaxed">{selectedIssueDetail?.suggestedFix}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setSelectedIssueDetail(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Đóng
            </button>
            {!selectedIssueDetail?.isResolved && selectedIssueDetail?.severity !== 'success' && (
              <button
                onClick={() => {
                  if (selectedIssueDetail) {
                    handleFixWithAI(selectedIssueDetail.id);
                    setSelectedIssueDetail(null);
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Áp dụng Sửa ngay với AI</span>
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
