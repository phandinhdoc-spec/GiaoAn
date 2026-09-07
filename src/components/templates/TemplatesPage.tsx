import React, { useState, useEffect } from 'react';
import {
  Library,
  CheckCircle2,
  Sparkles,
  LayoutTemplate,
  FileCode2,
  Check,
  Eye,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Template, Project } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { PageId } from '../common/Sidebar';

interface TemplatesPageProps {
  activeProject: Project | null;
  onNavigate: (page: PageId) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('tpl-cv5512-standard');
  const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTemplates();
      setTemplates(data);
      if (activeProject) {
        setActiveTemplateId(activeProject.templateId || 'tpl-cv5512-standard');
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = async (templateId: string) => {
    setActiveTemplateId(templateId);
    if (activeProject) {
      await apiService.setProjectTemplate(activeProject.id, templateId);
      setAppliedMessage(`Đã áp dụng mẫu "${templates.find((t) => t.id === templateId)?.name}" cho bài dạy!`);
      setTimeout(() => setAppliedMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Đang tải kho mẫu bài dạy chuẩn sư phạm...</p>
      </div>
    );
  }

  return (
    <div id="templates-page" className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast */}
      {appliedMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{appliedMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
            <Library className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kho Mẫu Kế Hoạch Bài Dạy Chuẩn Sư Phạm (Typst Templates)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Thư Viện Mẫu Bài Dạy & Khung Định Dạng In Ấn
          </h1>
          <p className="text-xs text-slate-500">
            Tất cả mẫu đều tương thích với trình biên dịch Typst hiện đại, tạo bản in A4 sắc nét không lỗi font.
          </p>
        </div>

        {activeProject && (
          <button
            onClick={() => onNavigate('pdf-output')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Xem Xuất Bản PDF</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Templates Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const isActive = activeTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              id={`template-card-${tpl.id}`}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md ${
                isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Template Visual Thumbnail / Sheet Mockup */}
                <div
                  className="h-44 p-6 flex flex-col justify-between relative overflow-hidden"
                  style={{ backgroundColor: `${tpl.previewColor}10` }}
                >
                  <div className="flex items-center justify-between z-10">
                    <Badge variant={isActive ? 'info' : 'outline'} size="sm">
                      {tpl.badge}
                    </Badge>
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded backdrop-blur-xs">
                      {tpl.version}
                    </span>
                  </div>

                  {/* Minimal visual paper preview inside banner */}
                  <div className="bg-white rounded-lg shadow-md p-3 border border-slate-200/80 space-y-1.5 z-10">
                    <div className="h-2 w-3/4 bg-slate-300 rounded" />
                    <div className="h-1.5 w-full bg-slate-200 rounded" />
                    <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      <div className="h-4 bg-indigo-50 rounded border border-indigo-100" />
                      <div className="h-4 bg-emerald-50 rounded border border-emerald-100" />
                    </div>
                  </div>

                  <div
                    className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full opacity-20 pointer-events-none"
                    style={{ backgroundColor: tpl.previewColor }}
                  />
                </div>

                {/* Template Details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">{tpl.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                      Đặc điểm nổi bật:
                    </span>
                    <ul className="space-y-1">
                      {tpl.features.map((feat, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    Phù hợp cho: <strong className="text-slate-700">{tpl.suitableFor}</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
                <button
                  id={`btn-preview-tpl-${tpl.id}`}
                  onClick={() => setPreviewingTemplate(tpl)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem mã Typst</span>
                </button>

                <button
                  id={`btn-apply-tpl-${tpl.id}`}
                  onClick={() => handleApplyTemplate(tpl.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đang Sử Dụng</span>
                    </>
                  ) : (
                    <span>Chọn Mẫu Này</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Typst Template Source */}
      <Modal
        isOpen={!!previewingTemplate}
        onClose={() => setPreviewingTemplate(null)}
        title={`Mã Nguồn Mẫu Typst: ${previewingTemplate?.name}`}
        subtitle={`Phiên bản: ${previewingTemplate?.version} • Tác giả: ${previewingTemplate?.author}`}
        maxWidth="4xl"
      >
        <div className="space-y-4">
          <div className="bg-slate-950 text-emerald-300 p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed max-h-[60vh]">
            <pre>{previewingTemplate?.typstTemplate}</pre>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setPreviewingTemplate(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                if (previewingTemplate) {
                  handleApplyTemplate(previewingTemplate.id);
                  setPreviewingTemplate(null);
                }
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Áp Dụng Mẫu Này
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
