import React, { useState, useEffect } from 'react';
import {
  FileDown,
  RotateCcw,
  Sparkles,
  FileCode2,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Printer,
  Copy,
  LayoutTemplate,
  Sliders,
  Settings2,
  FileCheck2,
  FileSignature,
} from 'lucide-react';
import { Project, Template, Lesson } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../common/Badge';
import { PageId } from '../common/Sidebar';
import { TeacherProfile } from '../auth/TeacherAuthModal';

interface PdfOutputPageProps {
  activeProject: Project | null;
  onNavigate: (page: PageId) => void;
  teacherProfile: TeacherProfile;
}

export const PdfOutputPage: React.FC<PdfOutputPageProps> = ({
  activeProject,
  onNavigate,
  teacherProfile,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-cv5512-standard');
  const [typstSource, setTypstSource] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [activeTab, setActiveTab] = useState<'pdf-preview' | 'typst-advanced'>('pdf-preview');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (activeProject) {
      loadTemplatesAndRender(activeProject.id);
    }
  }, [activeProject]);

  const loadTemplatesAndRender = async (projectId: string) => {
    setLoading(true);
    try {
      const tpls = await apiService.getTemplates();
      setTemplates(tpls);
      const activeTpl = activeProject?.templateId || tpls[0]?.id || 'tpl-cv5512-standard';
      setSelectedTemplateId(activeTpl);

      const renderResult = await apiService.renderTypst(projectId, activeTpl);
      setTypstSource(renderResult.typstSource);
    } catch (err) {
      console.error('Render initial failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!activeProject) return;
    setSelectedTemplateId(templateId);
    setIsRendering(true);
    try {
      const result = await apiService.renderTypst(activeProject.id, templateId);
      setTypstSource(result.typstSource);
      await apiService.setProjectTemplate(activeProject.id, templateId);
    } catch (err) {
      console.error('Template change failed:', err);
    } finally {
      setIsRendering(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeProject) return;
    setIsRendering(true);
    try {
      const result = await apiService.renderTypst(activeProject.id, selectedTemplateId, typstSource);
      setTypstSource(result.typstSource);
    } catch (err) {
      console.error('Regenerate failed:', err);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    const element = document.createElement('a');
    const file = new Blob([typstSource], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = `KeHoachBaiDay_${activeProject?.subject}_${activeProject?.grade}_CV5512.pdf`;
    document.body.appendChild(element);
    element.click();
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopyTypst = () => {
    navigator.clipboard.writeText(typstSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeProject) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-sm">Vui lòng chọn hoặc tạo một dự án kế hoạch bài dạy trước.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer"
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
        <p className="text-xs text-slate-500">Đang biên dịch mã nguồn Typst sang PDF chất lượng cao...</p>
      </div>
    );
  }

  return (
    <div id="pdf-output-page" className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
            <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Xuất Bản Typst Engine sang PDF (High-Fidelity Document)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {activeProject.title}
          </h1>
          <p className="text-xs text-slate-500">
            Biên soạn theo tiêu chuẩn Công văn 5512/BGDĐT-GDTrH • Bộ GD&ĐT Việt Nam
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-regenerate-pdf"
            onClick={handleRegenerate}
            disabled={isRendering}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRendering ? 'animate-spin' : ''}`} />
            <span>Tạo Lại (Regenerate)</span>
          </button>

          <button
            id="btn-download-pdf"
            onClick={handleDownloadPdf}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>{downloadSuccess ? 'Đang Tải Tệp PDF...' : 'Tải Xuống PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Controls & Visual Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Selection & Output Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Template Selector Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-indigo-600" />
              <span>Chọn Mẫu Trình Bày (Typst Template)</span>
            </h3>

            <div className="space-y-2.5">
              {templates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    id={`tpl-option-${tpl.id}`}
                    onClick={() => handleTemplateChange(tpl.id)}
                    className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{tpl.name}</span>
                      <Badge variant={isSelected ? 'info' : 'outline'} size="sm">
                        {tpl.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document Properties & Teacher Signature Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-600" />
              <span>Thông Số Xuất Bản & Giáo Viên</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600 font-sans">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Giáo viên soạn:</span>
                <span className="font-bold text-indigo-900">{teacherProfile.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Đơn vị trường:</span>
                <span className="font-bold text-slate-800">{teacherProfile.schoolName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Khổ giấy in:</span>
                <span className="font-bold text-slate-800">A4 Chuẩn (210 x 297 mm)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Font chữ in ấn:</span>
                <span className="font-bold text-slate-800">Times New Roman / 12pt</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Lề trang (Margins):</span>
                <span className="font-bold text-slate-800">Trái: 2cm, Phải/Trên/Dưới: 2cm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Số trang ước tính:</span>
                <span className="font-bold text-indigo-700">06 trang A4</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Độ phân giải:</span>
                <span className="font-bold text-emerald-700">300 DPI Vector PDF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PDF Viewer or Advanced Typst Code (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          {/* Tabs bar: Preview vs Advanced Typst Source */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                id="tab-btn-pdf-preview"
                onClick={() => setActiveTab('pdf-preview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pdf-preview'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Bản In PDF (Visual Sheet)</span>
                </span>
              </button>

              <button
                id="tab-btn-typst-advanced"
                onClick={() => setActiveTab('typst-advanced')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'typst-advanced'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Mã Nguồn Typst (Tab Nâng Cao)</span>
                </span>
              </button>
            </div>

            {/* Pagination and Zoom toolbar for preview */}
            {activeTab === 'pdf-preview' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-600">
                  <button
                    onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                    disabled={currentPageNum === 1}
                    className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold px-1">{currentPageNum} / 6</span>
                  <button
                    onClick={() => setCurrentPageNum(Math.min(6, currentPageNum + 1))}
                    disabled={currentPageNum === 6}
                    className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-white px-1.5 py-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))}
                    className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-600 px-1">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
                    className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                    title="Phóng to"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tab 1: Realistic A4 Styled Sheet Preview */}
          {activeTab === 'pdf-preview' ? (
            <div className="flex-1 p-8 bg-slate-200/70 overflow-y-auto flex items-center justify-center min-h-[620px]">
              <div
                className="bg-white rounded-md shadow-2xl border border-slate-300 p-12 w-full max-w-2xl text-slate-900 transition-all font-serif leading-relaxed select-text"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                {/* Header of CV 5512 sheet */}
                <div className="text-center space-y-1 border-b border-slate-300 pb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {teacherProfile.schoolName.toUpperCase()} • {teacherProfile.role.toUpperCase()}
                  </p>
                  <h2 className="text-base font-extrabold text-blue-900 uppercase">
                    KẾ HOẠCH BÀI DẠY (THEO CÔNG VĂN 5512/BGDĐT)
                  </h2>
                  <p className="text-xs font-bold text-emerald-800 uppercase">
                    {activeProject.title}
                  </p>
                  <p className="text-xs italic text-slate-600">
                    Môn: {activeProject.subject} {activeProject.grade} • Thời lượng: {activeProject.periods} tiết • GV: {teacherProfile.name}
                  </p>
                </div>

                {/* Body content based on page */}
                {currentPageNum === 1 && (
                  <div className="mt-6 space-y-4 text-xs">
                    <h3 className="font-bold text-sm text-slate-900">I. MỤC TIÊU DẠY HỌC</h3>
                    <div className="space-y-1.5 pl-2">
                      <p className="font-bold text-slate-800">1. Về kiến thức:</p>
                      <p className="text-slate-700 leading-relaxed">
                        - Phát biểu được định luật bảo toàn khối lượng (Lomonosov - Lavoisier).
                        <br />
                        - Giải thích được cơ sở định luật dựa trên sự bảo toàn số lượng nguyên tử.
                        <br />
                        - Nắm vững và thực hiện thành thạo 3 bước lập phương trình hóa học.
                      </p>
                    </div>

                    <div className="space-y-1.5 pl-2">
                      <p className="font-bold text-slate-800">2. Về năng lực:</p>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>a) Năng lực KHTN:</strong> Thực hiện an toàn thí nghiệm kiểm chứng phản ứng giữa dung dịch BaCl₂ và Na₂SO₄; đọc chuẩn xác chỉ số cân điện tử trước và sau phản ứng.
                        <br />
                        <strong>b) Năng lực chung:</strong> Tự chủ, tự học và giao tiếp hợp tác làm việc nhóm 4 học sinh.
                      </p>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 pt-3">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
                    <p className="text-slate-700 pl-2">
                      1. <strong>Giáo viên:</strong> Cân điện tử 0.01g, dung dịch BaCl₂ 5%, Na₂SO₄ 5%, phiếu học tập số 1, 2, 3, máy chiếu.
                      <br />
                      2. <strong>Học sinh:</strong> Sách giáo khoa KHTN 8, bảng nhóm A3, bút dạ.
                    </p>
                  </div>
                )}

                {currentPageNum >= 2 && (
                  <div className="mt-6 space-y-4 text-xs">
                    <h3 className="font-bold text-sm text-slate-900">
                      III. TIẾN TRÌNH DẠY HỌC (Trang {currentPageNum}/6)
                    </h3>
                    <p className="font-bold text-slate-800">
                      Hoạt động 2: Hình thành kiến thức mới (Tiếp theo)
                    </p>

                    <div className="border border-slate-300 rounded-md overflow-hidden text-[11px]">
                      <div className="grid grid-cols-2 bg-slate-100 font-bold border-b border-slate-300 p-2 text-slate-800">
                        <div>HOẠT ĐỘNG CỦA GIÁO VIÊN</div>
                        <div>HOẠT ĐỘNG CỦA HỌC SINH</div>
                      </div>
                      <div className="grid grid-cols-2 p-3 gap-3">
                        <div className="space-y-1.5">
                          <p>1. Chuyển giao nhiệm vụ thí nghiệm kiểm chứng định luật.</p>
                          <p>2. Quan sát các nhóm cân cốc chứa dung dịch BaCl₂ và Na₂SO₄ trước khi trộn.</p>
                          <p>3. Hướng dẫn đổ cốc 1 vào cốc 2 và quan sát hiện tượng kết tủa trắng BaSO₄.</p>
                        </div>
                        <div className="space-y-1.5">
                          <p>1. Nhận bộ hóa chất và phân công nhiệm vụ trong nhóm.</p>
                          <p>2. Đọc chỉ số cân m₁ = 152.40g và ghi vào Phiếu học tập số 1.</p>
                          <p>3. Trộn dung dịch, đọc chỉ số cân m₂ = 152.40g. Rút ra kết luận m₁ = m₂.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer of sheet */}
                <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <FileSignature className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Giáo viên soạn: <strong>{teacherProfile.name}</strong></span>
                  </div>
                  <span>Trang {currentPageNum} / 6</span>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Advanced Typst Source Code Tab */
            <div className="flex-1 flex flex-col p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400">Mã nguồn Typst v0.12.0 hoàn chỉnh:</span>
                <button
                  id="btn-copy-typst"
                  onClick={handleCopyTypst}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép mã Typst'}</span>
                </button>
              </div>

              <textarea
                value={typstSource}
                onChange={(e) => setTypstSource(e.target.value)}
                className="flex-1 mt-3 p-4 bg-slate-950 text-emerald-300 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                placeholder="Mã nguồn Typst..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
