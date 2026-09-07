import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileCode,
  FileSearch,
  Compass,
  PenTool,
  ShieldCheck,
  FileText,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  Terminal,
} from 'lucide-react';
import { Project, Job, JobStatus } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../common/Badge';
import { PageId } from '../common/Sidebar';

interface GenerationProgressPageProps {
  activeProject: Project | null;
  onNavigate: (page: PageId) => void;
}

export const GenerationProgressPage: React.FC<GenerationProgressPageProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const pipelineStages: Array<{
    id: JobStatus;
    label: string;
    description: string;
    icon: React.ElementType;
  }> = [
    {
      id: 'uploaded',
      label: '1. Nạp tài liệu',
      description: 'Tiếp nhận SGK & giáo án mẫu',
      icon: Upload,
    },
    {
      id: 'converting',
      label: '2. Chuyển đổi',
      description: 'OCR & Parser sang Markdown',
      icon: FileCode,
    },
    {
      id: 'analyzing',
      label: '3. Phân tích',
      description: 'Đối chiếu chuẩn GDPT 2018',
      icon: FileSearch,
    },
    {
      id: 'planning',
      label: '4. Lập dàn ý',
      description: 'Ma trận sư phạm CV 5512',
      icon: Compass,
    },
    {
      id: 'writing',
      label: '5. Biên soạn',
      description: 'Soạn chuỗi 4 hoạt động dạy học',
      icon: PenTool,
    },
    {
      id: 'reviewing',
      label: '6. Thẩm định',
      description: 'Kiểm duyệt an toàn & thời lượng',
      icon: ShieldCheck,
    },
    {
      id: 'rendering',
      label: '7. Render Typst',
      description: 'Biên dịch sang tài liệu in ấn',
      icon: FileText,
    },
    {
      id: 'completed',
      label: '8. Bản in PDF',
      description: 'Hoàn tất xuất bản bài dạy',
      icon: FileCheck2,
    },
  ];

  useEffect(() => {
    if (activeProject) {
      loadJob(activeProject.id);
    }
  }, [activeProject]);

  const loadJob = async (projectId: string) => {
    setLoading(true);
    try {
      const jobData = await apiService.getJob(`job-${projectId}`);
      setJob(jobData);
    } catch (err) {
      console.error('Failed to load job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStep = async () => {
    if (!job) return;
    setIsSimulating(true);
    try {
      const updated = await apiService.advanceJobStep(job.id);
      setJob(updated);
    } catch (err) {
      console.error('Failed to advance step:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const getStageIndex = (status: JobStatus) => {
    const order: JobStatus[] = [
      'uploaded',
      'converting',
      'analyzing',
      'planning',
      'writing',
      'reviewing',
      'rendering',
      'completed',
    ];
    return order.indexOf(status);
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

  const currentIdx = job ? getStageIndex(job.status) : 0;
  const isCompleted = job?.status === 'completed';

  return (
    <div id="generation-progress-page" className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quy Trình Xử Lý Tự Động Hóa (AI Agent Pipeline)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeProject.title}
          </h1>
          <p className="text-xs text-slate-500">
            Trạng thái hiện tại:{' '}
            <strong className="text-slate-800">{job?.currentStageName || 'Đang xử lý...'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted && (
            <button
              id="btn-advance-pipeline-step"
              onClick={handleAdvanceStep}
              disabled={isSimulating}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{isSimulating ? 'Đang kích hoạt bước tiếp...' : 'Mô phỏng Bước tiếp'}</span>
            </button>
          )}

          <button
            id="btn-go-to-editor"
            onClick={() => onNavigate('editor')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Mở Trình Soạn Thảo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pipeline Progress Bar & Step Cards */}
      <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Tiến trình 8 giai đoạn Sư phạm
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Từ bóc tách văn bản tài liệu nguồn đến tạo ra bản in Typst/PDF chất lượng cao
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-indigo-600">
              {job?.progressPercentage || 10}%
            </span>
            <p className="text-[11px] text-slate-400 font-medium">Hoàn thành</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${job?.progressPercentage || 10}%` }}
          />
        </div>

        {/* Step Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isDone = idx < currentIdx || (idx === currentIdx && isCompleted);
            const isCurrent = idx === currentIdx && !isCompleted;
            const isPending = idx > currentIdx;

            return (
              <div
                key={stage.id}
                id={`pipeline-step-${stage.id}`}
                className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : isCurrent
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900 animate-pulse'
                    : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 font-bold text-xs ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-xs font-bold truncate max-w-full">{stage.label}</span>
                <span className="text-[10px] mt-1 line-clamp-1 leading-tight text-slate-500">
                  {stage.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-looking Activity Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Nhật ký Hoạt động Xử lý Sư phạm</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {job?.logs.length || 0} bản ghi sự kiện
          </span>
        </div>

        <div className="p-5 space-y-3 max-h-80 overflow-y-auto font-sans">
          {job?.logs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs"
            >
              <span className="font-mono text-[11px] text-slate-400 px-2 py-0.5 bg-white rounded border border-slate-200 shrink-0">
                {log.timestamp}
              </span>
              <div className="space-y-0.5 flex-1">
                <p className="font-semibold text-slate-800">{log.message}</p>
                {log.details && (
                  <p className="text-[11px] text-slate-500 font-mono leading-relaxed">{log.details}</p>
                )}
              </div>
              <Badge
                variant={
                  log.type === 'success'
                    ? 'success'
                    : log.type === 'agent'
                    ? 'purple'
                    : log.type === 'warning'
                    ? 'warning'
                    : 'default'
                }
                size="sm"
              >
                {log.stage}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Advanced Technical Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          id="btn-toggle-advanced-details"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Chi tiết Kỹ thuật & Thống kê Agent (Advanced Agent Details)
            </span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-6 border-t border-slate-200 space-y-5 bg-slate-900 text-slate-200 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[11px]">Mô hình AI</div>
                <div className="text-white font-bold mt-1">
                  {job?.agentMetadata.modelUsed || 'Gemini 2.5 Pro Reasoner'}
                </div>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[11px]">Tokens Đã Xử Lý</div>
                <div className="text-white font-bold mt-1">
                  {job?.agentMetadata.tokensProcessed.toLocaleString() || 14850} tokens
                </div>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[11px]">Bước Suy Luận Sư Phạm</div>
                <div className="text-white font-bold mt-1">
                  {job?.agentMetadata.reasoningSteps || 42} steps
                </div>
              </div>
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-[11px]">Độ Tin Cậy Khớp 5512</div>
                <div className="text-emerald-400 font-bold mt-1">
                  {((job?.agentMetadata.confidenceScore || 0.98) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-wider">
                Các Agent Sư Phạm Đang Hoạt Động (Multi-Agent Swarm):
              </div>
              <div className="flex flex-wrap gap-2">
                {job?.agentMetadata.activeAgents.map((agent, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-indigo-300 text-[11px]"
                  >
                    • {agent}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
