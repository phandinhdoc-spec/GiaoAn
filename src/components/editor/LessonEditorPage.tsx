import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Lock,
  Unlock,
  Sparkles,
  Edit3,
  FileCode,
  Eye,
  Save,
  Check,
  RotateCcw,
  ChevronRight,
  Clock,
  BookOpen,
  Plus,
  HelpCircle,
  Zap,
  SplitSquareVertical,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  FileDown,
  Columns,
  Layout,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  CheckCircle2,
  Sliders,
  AlignLeft,
  ListOrdered,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';
import { Project, Lesson, LessonSection } from '../../types';
import { apiService } from '../../services/api';
import { Badge } from '../common/Badge';
import { PageId } from '../common/Sidebar';

type LayoutMode = 'three-column' | 'split-preview' | 'focus-editor' | 'full-preview' | 'raw-markdown';

interface LessonEditorPageProps {
  activeProject: Project | null;
  onNavigate: (page: PageId) => void;
}

export const LessonEditorPage: React.FC<LessonEditorPageProps> = ({
  activeProject,
  onNavigate,
}) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-objectives');
  
  // Layout and view controls
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('three-column');
  const [showOutlinePanel, setShowOutlinePanel] = useState<boolean>(true);
  const [showPreviewPanel, setShowPreviewPanel] = useState<boolean>(true);
  const [sectionEditFormat, setSectionEditFormat] = useState<'visual-structured' | 'markdown'>('visual-structured');
  const [rightPanelTab, setRightPanelTab] = useState<'preview' | 'assistant' | 'structure'>('preview');

  // AI actions
  const [customAIPrompt, setCustomAIPrompt] = useState<string>('');
  const [executingAIAction, setExecutingAIAction] = useState<string | null>(null);
  const [aiFeedbackMessage, setAiFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeProject) {
      loadLesson(activeProject.id);
    }
  }, [activeProject]);

  const loadLesson = async (projectId: string) => {
    setLoading(true);
    try {
      const data = await apiService.getLesson(projectId);
      setLesson(data);
      if (data.sections.length > 0) {
        setActiveSectionId(data.sections[0].id);
      }
    } catch (err) {
      console.error('Failed to load lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeProject || !lesson) return;
    setSaving(true);
    try {
      await apiService.updateLesson(activeProject.id, lesson);
      setAiFeedbackMessage('Đã lưu toàn bộ thay đổi thành công!');
      setTimeout(() => setAiFeedbackMessage(null), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLock = async (sectionId: string) => {
    if (!activeProject || !lesson) return;
    try {
      const updatedSection = await apiService.toggleSectionLock(activeProject.id, sectionId);
      setLesson((prev) => {
        if (!prev) return prev;
        const newSecs = prev.sections.map((s) => (s.id === sectionId ? updatedSection : s));
        return { ...prev, sections: newSecs };
      });
    } catch (err) {
      console.error('Toggle lock failed:', err);
    }
  };

  const handleSectionContentChange = (sectionId: string, newContent: string) => {
    if (!lesson) return;
    const newSections = lesson.sections.map((s) =>
      s.id === sectionId ? { ...s, content: newContent } : s
    );
    const newRawMarkdown = newSections.map((s) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
    setLesson({
      ...lesson,
      sections: newSections,
      rawMarkdown: newRawMarkdown,
    });
  };

  const handleRawMarkdownChange = (newMarkdown: string) => {
    if (!lesson) return;
    setLesson({
      ...lesson,
      rawMarkdown: newMarkdown,
    });
  };

  const handleExecuteAIAction = async (
    action: 'rewrite' | 'shorten' | 'expand' | 'add_activity' | 'add_questions' | 'check_accuracy'
  ) => {
    if (!activeProject || !lesson) return;
    const currentSection = lesson.sections.find((s) => s.id === activeSectionId);
    if (!currentSection) return;

    if (currentSection.isLocked) {
      alert(`Mục "${currentSection.title}" đang bị KHÓA. Vui lòng mở khóa trước khi dùng AI.`);
      return;
    }

    setExecutingAIAction(action);
    setAiFeedbackMessage(null);
    try {
      const result = await apiService.executeSectionAIAction(
        activeProject.id,
        activeSectionId,
        action,
        customAIPrompt
      );
      setLesson((prev) => {
        if (!prev) return prev;
        const updated = prev.sections.map((s) =>
          s.id === activeSectionId ? result.updatedSection : s
        );
        const newMarkdown = updated.map((s) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
        return { ...prev, sections: updated, rawMarkdown: newMarkdown };
      });
      setAiFeedbackMessage(`AI Sư phạm: ${result.explanation}`);
      setCustomAIPrompt('');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thực hiện thao tác AI');
    } finally {
      setExecutingAIAction(null);
    }
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
        <p className="text-xs text-slate-500 font-medium">Đang tải kế hoạch bài dạy và ma trận mục tiêu...</p>
      </div>
    );
  }

  const activeSection = lesson?.sections.find((s) => s.id === activeSectionId);
  const totalDuration = lesson?.sections.reduce((acc, s) => acc + (s.durationMinutes || 0), 0) || 0;

  // Helper to switch layout presets
  const handleSelectLayoutMode = (mode: LayoutMode) => {
    setLayoutMode(mode);
    if (mode === 'three-column') {
      setShowOutlinePanel(true);
      setShowPreviewPanel(true);
    } else if (mode === 'split-preview') {
      setShowOutlinePanel(false);
      setShowPreviewPanel(true);
    } else if (mode === 'focus-editor') {
      setShowOutlinePanel(false);
      setShowPreviewPanel(false);
    } else if (mode === 'full-preview') {
      setShowOutlinePanel(false);
      setShowPreviewPanel(true);
    } else if (mode === 'raw-markdown') {
      setShowOutlinePanel(false);
      setShowPreviewPanel(true);
    }
  };

  return (
    <div id="lesson-editor-page" className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 overflow-hidden">
      {/* Dynamic Top Toolbar with View Switcher */}
      <div className="h-14 bg-white border-b border-slate-200 px-5 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none z-10 shadow-2xs">
        {/* Left: Layout Modes Quick Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider hidden sm:inline whitespace-nowrap">
            Chế độ xem:
          </span>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              id="layout-mode-three-column"
              onClick={() => handleSelectLayoutMode('three-column')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                layoutMode === 'three-column'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="3 Cột: Cấu trúc + Soạn thảo + Xem trước"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>3 Cột Chuẩn</span>
            </button>

            <button
              id="layout-mode-split-preview"
              onClick={() => handleSelectLayoutMode('split-preview')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                layoutMode === 'split-preview'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Soạn thảo & Xem trước song song"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Song Song (50/50)</span>
            </button>

            <button
              id="layout-mode-focus-editor"
              onClick={() => handleSelectLayoutMode('focus-editor')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                layoutMode === 'focus-editor'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tập trung soạn thảo mục bài dạy"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Tập Trung Soạn</span>
            </button>

            <button
              id="layout-mode-full-preview"
              onClick={() => handleSelectLayoutMode('full-preview')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                layoutMode === 'full-preview'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Xem trước toàn trang giáo án"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Toàn Văn</span>
            </button>

            <button
              id="layout-mode-raw-markdown"
              onClick={() => handleSelectLayoutMode('raw-markdown')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                layoutMode === 'raw-markdown'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mã nguồn Markdown thuần"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Mã Markdown</span>
            </button>
          </div>

          {/* Quick Toggle Column Buttons */}
          <div className="hidden md:flex items-center gap-1 ml-1 pl-2 border-l border-slate-200">
            <button
              id="btn-toggle-outline-panel"
              onClick={() => setShowOutlinePanel(!showOutlinePanel)}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                showOutlinePanel
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              title={showOutlinePanel ? 'Ẩn Cột Mục Lục' : 'Hiện Cột Mục Lục'}
            >
              {showOutlinePanel ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              <span className="text-[11px]">Dàn ý</span>
            </button>

            <button
              id="btn-toggle-preview-panel"
              onClick={() => setShowPreviewPanel(!showPreviewPanel)}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                showPreviewPanel
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              title={showPreviewPanel ? 'Ẩn Cột Xem Trước' : 'Hiện Cột Xem Trước'}
            >
              {showPreviewPanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
              <span className="text-[11px]">Xem trước</span>
            </button>
          </div>
        </div>

        {/* Right Tools in Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {aiFeedbackMessage && (
            <span className="hidden sm:inline-flex text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              {aiFeedbackMessage}
            </span>
          )}

          <button
            id="editor-btn-save"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>

          <button
            id="editor-btn-review"
            onClick={() => onNavigate('review')}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Thẩm định 5512</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Responsive Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL 1: Outline / Navigation Panel (Collapsible) */}
        {showOutlinePanel && (
          <div
            id="editor-left-panel"
            className="w-72 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden select-none shrink-0 transition-all"
          >
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Cấu trúc CV 5512
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Tiến trình 4 hoạt động</p>
              </div>
              <Badge variant="info" size="sm">
                {lesson?.sections.length || 0} mục
              </Badge>
            </div>

            <div className="flex-1 p-2.5 space-y-1.5 overflow-y-auto">
              {lesson?.sections.map((section, idx) => {
                const isCurrent = activeSectionId === section.id;
                return (
                  <div
                    key={section.id}
                    id={`outline-section-${section.id}`}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isCurrent
                        ? 'bg-indigo-50/90 border-indigo-300 ring-1 ring-indigo-500/20 text-indigo-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-400 font-bold">{idx + 1}.</span>
                        <span className="truncate block font-semibold">{section.title}</span>
                      </div>
                      {section.durationMinutes && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{section.durationMinutes} phút</span>
                        </div>
                      )}
                    </div>

                    <button
                      id={`btn-lock-toggle-${section.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLock(section.id);
                      }}
                      className={`p-1 rounded-md transition-colors shrink-0 ${
                        section.isLocked
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={section.isLocked ? 'Mục đã khóa (AI không thể sửa)' : 'Khóa mục này'}
                    >
                      {section.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Duration Summary */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-600 flex items-center justify-between">
              <span className="font-semibold">Thời lượng kế hoạch:</span>
              <span className="font-bold text-indigo-700">{totalDuration} phút / {activeProject.periods} tiết</span>
            </div>
          </div>
        )}

        {/* PANEL 2: Editor Center Area */}
        {layoutMode !== 'full-preview' && (
          <div
            id="editor-center-panel"
            className="flex-1 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden"
          >
            {layoutMode === 'raw-markdown' ? (
              /* Raw Markdown Complete View */
              <div className="flex-1 flex flex-col p-5 overflow-hidden bg-slate-900 text-slate-100">
                <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Toàn văn Giáo án Markdown (Canonical Document)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {lesson?.rawMarkdown.length || 0} ký tự
                  </span>
                </div>
                <textarea
                  id="raw-markdown-editor"
                  value={lesson?.rawMarkdown || ''}
                  onChange={(e) => handleRawMarkdownChange(e.target.value)}
                  className="w-full flex-1 p-4 font-mono text-xs text-slate-100 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                  placeholder="Nội dung mã nguồn Markdown toàn bộ giáo án..."
                />
              </div>
            ) : activeSection ? (
              /* Section Interactive Editor */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Section Header & Sub-toolbar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">{activeSection.title}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        {activeSection.isLocked ? (
                          <Badge variant="warning" size="sm">
                            <Lock className="w-3 h-3" /> Đã khóa mục
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">
                            Sẵn sàng chỉnh sửa
                          </Badge>
                        )}
                        {activeSection.durationMinutes && (
                          <span className="text-xs text-slate-500 font-medium">
                            • {activeSection.durationMinutes} phút
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Format toggle: Visual Structured vs Free Markdown */}
                      <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                        <button
                          type="button"
                          onClick={() => setSectionEditFormat('visual-structured')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                            sectionEditFormat === 'visual-structured'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Soạn Khung Sư Phạm
                        </button>
                        <button
                          type="button"
                          onClick={() => setSectionEditFormat('markdown')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                            sectionEditFormat === 'markdown'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Mã Markdown
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleLock(activeSection.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                          activeSection.isLocked
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {activeSection.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{activeSection.isLocked ? 'Mở khóa' : 'Khóa mục'}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Quick Actions Toolbar */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Trợ lý AI Tinh chỉnh Sư phạm:</span>
                      </span>
                      {activeSection.isLocked && (
                        <span className="text-xs text-amber-600 italic">
                          (Cần mở khóa để kích hoạt)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        id="ai-btn-rewrite"
                        disabled={activeSection.isLocked || !!executingAIAction}
                        onClick={() => handleExecuteAIAction('rewrite')}
                        className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Viết lại
                      </button>
                      <button
                        id="ai-btn-shorten"
                        disabled={activeSection.isLocked || !!executingAIAction}
                        onClick={() => handleExecuteAIAction('shorten')}
                        className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Rút gọn
                      </button>
                      <button
                        id="ai-btn-expand"
                        disabled={activeSection.isLocked || !!executingAIAction}
                        onClick={() => handleExecuteAIAction('expand')}
                        className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Mở rộng
                      </button>
                      <button
                        id="ai-btn-add-activity"
                        disabled={activeSection.isLocked || !!executingAIAction}
                        onClick={() => handleExecuteAIAction('add_activity')}
                        className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        + Hoạt động HS
                      </button>
                      <button
                        id="ai-btn-add-questions"
                        disabled={activeSection.isLocked || !!executingAIAction}
                        onClick={() => handleExecuteAIAction('add_questions')}
                        className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        + Câu hỏi & Bài tập
                      </button>
                      <button
                        id="ai-btn-check-accuracy"
                        disabled={activeSection.isLocked || !!executingAIAction}
                        onClick={() => handleExecuteAIAction('check_accuracy')}
                        className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Kiểm tra độ chính xác
                      </button>
                    </div>

                    {/* Custom Prompt Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={customAIPrompt}
                        onChange={(e) => setCustomAIPrompt(e.target.value)}
                        placeholder="Yêu cầu AI tùy chỉnh (Ví dụ: Thêm gợi ý phương án an toàn BaCl2...)"
                        disabled={activeSection.isLocked}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white disabled:opacity-50"
                      />
                      <button
                        id="btn-execute-custom-ai"
                        disabled={activeSection.isLocked || !customAIPrompt.trim() || !!executingAIAction}
                        onClick={() => handleExecuteAIAction('rewrite')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer whitespace-nowrap"
                      >
                        Gửi Yêu Cầu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section Editor Body */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <textarea
                    id={`section-editor-textarea-${activeSection.id}`}
                    value={activeSection.content}
                    onChange={(e) => handleSectionContentChange(activeSection.id, e.target.value)}
                    disabled={activeSection.isLocked}
                    className="w-full h-full p-4 font-mono text-xs text-slate-900 bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none leading-relaxed disabled:bg-slate-100 disabled:text-slate-500"
                    placeholder="Nhập nội dung kế hoạch bài dạy chuẩn theo Công văn 5512..."
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* PANEL 3: Right Panel (Preview / AI Assistant / Duration Matrix) */}
        {showPreviewPanel && (
          <div
            id="editor-right-panel"
            className={`${
              layoutMode === 'full-preview' ? 'w-full' : 'w-96 xl:w-[460px]'
            } bg-slate-50 flex flex-col h-full overflow-hidden shrink-0 transition-all`}
          >
            {/* Tabs Header */}
            <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  id="tab-right-preview"
                  onClick={() => setRightPanelTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Trước Bản In</span>
                  </span>
                </button>

                <button
                  id="tab-right-assistant"
                  onClick={() => setRightPanelTab('assistant')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === 'assistant'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Trợ Lý Sư Phạm</span>
                  </span>
                </button>

                <button
                  id="tab-right-structure"
                  onClick={() => setRightPanelTab('structure')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === 'structure'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ma Trận Thời Lượng</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Panel Tab Content */}
            <div className="flex-1 p-5 overflow-y-auto">
              {rightPanelTab === 'preview' && (
                <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-5 max-w-3xl mx-auto">
                  <div className="border-b border-slate-200 pb-4 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      TRƯỜNG THCS NGUYỄN DU • KẾ HOẠCH BÀI DẠY CV 5512
                    </p>
                    <h2 className="text-base font-extrabold text-indigo-950 uppercase tracking-wide">
                      {activeProject.title}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Môn: <strong>{activeProject.subject} {activeProject.grade}</strong> • Thời lượng: <strong>{activeProject.periods} tiết</strong>
                    </p>
                  </div>

                  {/* Render canonical markdown content */}
                  <div className="prose prose-slate prose-sm max-w-none text-xs leading-relaxed">
                    <ReactMarkdown>{lesson?.rawMarkdown || ''}</ReactMarkdown>
                  </div>
                </div>
              )}

              {rightPanelTab === 'assistant' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Đánh Giá Chuẩn Sư Phạm Bộ GD&ĐT (CV 5512)</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      AI đã kiểm tra chuỗi 4 hoạt động và phân bổ thời lượng:
                    </p>

                    <div className="space-y-2.5">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                        <strong>✓ Mục tiêu 3 thành tố:</strong> Đã chuẩn hóa Kiến thức, Năng lực KHTN và Phẩm chất.
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                        <strong>⚠ Lưu ý an toàn thực hành:</strong> Cần chuẩn bị chậu chứa thu gom nước thải sau phản ứng BaCl₂.
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                        <strong>💡 Hoạt động tương tác:</strong> Đã có 2 phiếu học tập và 1 thang đo Rubric nhóm.
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase">Hành Động Khuyên Dùng</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => onNavigate('review')}
                        className="w-full px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>Mở trang Thẩm định Sư phạm 5512 chi tiết</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate('pdf-output')}
                        className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>Xuất bản mã nguồn Typst & PDF</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {rightPanelTab === 'structure' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      Phân Bổ Thời Lượng Tiến Trình Dạy Học
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Hoạt động 1: Khởi động</span>
                          <span className="text-slate-600">7 phút (6%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full w-[6%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Hoạt động 2: Khám phá kiến thức</span>
                          <span className="text-slate-600">65 phút (54%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-[54%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Hoạt động 3: Luyện tập</span>
                          <span className="text-slate-600">35 phút (29%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[29%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Hoạt động 4: Vận dụng</span>
                          <span className="text-slate-600">13 phút (11%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[11%]" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200 leading-relaxed">
                      💡 Tổng thời lượng: <strong>{totalDuration || 120} phút</strong> ({activeProject.periods} tiết học theo phân phối chương trình).
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
