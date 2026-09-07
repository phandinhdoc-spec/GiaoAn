import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Presentation,
  Trash2,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  File,
  SlidersHorizontal,
  FolderOpen,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Priority, FileType } from '../../types';
import { Badge } from '../common/Badge';
import { PageId } from '../common/Sidebar';

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: FileType;
  priority: Priority;
  fileObj?: File;
}

interface NewLessonPageProps {
  onNavigate: (page: PageId) => void;
  onSelectProject: (projectId: string) => void;
}

export const NewLessonPage: React.FC<NewLessonPageProps> = ({
  onNavigate,
  onSelectProject,
}) => {
  const [subject, setSubject] = useState('Khoa học tự nhiên');
  const [grade, setGrade] = useState('Lớp 8');
  const [title, setTitle] = useState('');
  const [periods, setPeriods] = useState<number>(3);
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<UploadedFileItem[]>([]);

  const handleFillSampleKHTN8 = () => {
    setSubject('Khoa học tự nhiên');
    setGrade('Lớp 8');
    setTitle('Bài 5: Định luật bảo toàn khối lượng và phương trình hóa học');
    setPeriods(3);
    setLearningOutcomes(
      '1. Phát biểu được định luật bảo toàn khối lượng (Lomonosov - Lavoisier).\n2. Giải thích được bản chất nguyên tử trong biến đổi hóa học.\n3. Làm thành công thí nghiệm BaCl2 + Na2SO4, ghi nhận khối lượng trên cân.\n4. Thực hiện thành thạo 3 bước lập phương trình hóa học.'
    );
    setAdditionalNotes(
      'Bộ sách Kết nối tri thức với cuộc sống. Lớp học có 4 nhóm, mỗi nhóm 8 học sinh. Chú trọng bảo đảm an toàn khi tiếp xúc với hóa chất BaCl2 độc hại.'
    );
    setFiles([]);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const mapped: UploadedFileItem[] = newFiles.map((file, idx) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const type: FileType =
        ext === 'pdf'
          ? 'pdf'
          : ext === 'docx' || ext === 'doc'
          ? 'docx'
          : ext === 'pptx' || ext === 'ppt'
          ? 'pptx'
          : 'other';

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

      return {
        id: `f-${Date.now()}-${idx}`,
        name: file.name,
        size: `${sizeInMB} MB`,
        type,
        priority: 'high',
        fileObj: file,
      };
    });

    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updatePriority = (id: string, priority: Priority) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, priority } : f))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên bài học.');
      return;
    }
    if (files.length === 0) {
      alert('Vui lòng tải lên ít nhất một tài liệu nguồn (SGK, tài liệu giảng dạy).');
      return;
    }
    const filesToUpload = files.filter((file): file is UploadedFileItem & { fileObj: File } => !!file.fileObj);
    if (filesToUpload.length !== files.length) {
      alert('Vui lòng chọn lại các tệp tài liệu từ máy tính trước khi tải lên.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create project via API service abstraction
      const newProj = await apiService.createProject({
        title,
        subject,
        grade,
        periods,
        learningOutcomes,
        additionalNotes,
        status: 'uploaded',
      });

      // Step 2: Upload source documents
      await apiService.uploadSources(
        newProj.id,
        filesToUpload.map((f) => ({
          file: f.fileObj,
          priority: f.priority,
        }))
      );
      await apiService.getSources(newProj.id);

      // Select newly created project and navigate to source analysis
      onSelectProject(newProj.id);
      onNavigate('source-analysis');
    } catch (err: any) {
      console.error('Error creating project:', err);
      alert('Có lỗi khi tạo dự án bài dạy: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'docx':
        return <FileSpreadsheet className="w-5 h-5 text-blue-500" />;
      case 'pptx':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div id="new-lesson-page" className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1 border border-indigo-100">
            <span>Bước 1 / 5</span>
            <span>•</span>
            <span>Khởi tạo Dự án Kế hoạch Bài dạy</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Thiết lập Thông tin Bài dạy & Nạp Tài liệu Nguồn
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống AI sẽ phân tích tài liệu và cấu trúc hóa kế hoạch bài dạy theo khung Công văn 5512/BGDĐT.
          </p>
        </div>

        <button
          type="button"
          id="btn-fill-sample-khtn8"
          onClick={handleFillSampleKHTN8}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Nạp mẫu KHTN 8 (Bài 5)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Pedagogical metadata fields */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>1. Thông tin Sư phạm & Khung Chương trình</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Môn học <span className="text-rose-500">*</span>
              </label>
              <select
                id="input-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                <option value="Vật lí">Vật lí</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Toán học">Toán học</option>
                <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Tin học">Tin học</option>
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Khối lớp <span className="text-rose-500">*</span>
              </label>
              <select
                id="input-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="Lớp 6">Lớp 6</option>
                <option value="Lớp 7">Lớp 7</option>
                <option value="Lớp 8">Lớp 8 (Mặc định)</option>
                <option value="Lớp 9">Lớp 9</option>
                <option value="Lớp 10">Lớp 10</option>
                <option value="Lớp 11">Lớp 11</option>
                <option value="Lớp 12">Lớp 12</option>
              </select>
            </div>

            {/* Periods */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Số tiết phân bổ <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-periods"
                type="number"
                min={1}
                max={12}
                value={periods}
                onChange={(e) => setPeriods(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Lesson Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên bài học <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-lesson-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Bài 5: Định luật bảo toàn khối lượng và phương trình hóa học"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Learning Outcomes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Yêu cầu cần đạt / Mục tiêu trọng tâm (GDPT 2018)
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                (Tùy chọn - AI có thể tự động bóc tách từ tài liệu SGK)
              </span>
            </div>
            <textarea
              id="input-learning-outcomes"
              rows={3}
              value={learningOutcomes}
              onChange={(e) => setLearningOutcomes(e.target.value)}
              placeholder="Nhập các yêu cầu cần đạt (YCCĐ) về kiến thức, năng lực KHTN đặc thù và phẩm chất học sinh..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ghi chú bổ sung (Bộ sách, điều kiện phòng thực hành, đối tượng học sinh)
            </label>
            <input
              id="input-additional-notes"
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Ví dụ: Bộ sách Kết nối tri thức. Chú ý thí nghiệm BaCl2 độc tính, cần trang bị găng tay bảo hộ."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Section 2: Drag and drop document upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-indigo-600" />
              <span>2. Tải lên Tài liệu Nguồn (Source Documents)</span>
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{files.length}</span> tệp đã chọn
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            id="dropzone-area"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept=".pdf,.doc,.docx,.docm,.ppt,.pptx,.pptm,.xls,.xlsx,.xlsm,.xlsb,.odt,.ods,.odp,.rtf,.epub,.csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Kéo thả tài liệu vào đây hoặc <span className="text-indigo-600 underline">chọn tệp từ máy tính</span>
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Hỗ trợ đầy đủ các định dạng: <span className="font-semibold text-slate-700">PDF, DOCX, PPTX</span> và các tài liệu chuyên khảo.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                PDF (Sách giáo khoa, đề cương)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                DOCX (Văn bản CV 5512, KHBD cũ)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                PPTX (Bài giảng điện tử, hình ảnh)
              </span>
            </div>
          </div>

          {/* Uploaded Files Table List */}
          {files.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <span>Tên tài liệu ({files.length})</span>
                <div className="flex items-center gap-12 pr-6">
                  <span>Mức độ ưu tiên</span>
                  <span>Dung lượng</span>
                  <span>Thao tác</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 bg-white">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getFileIcon(file.type)}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{file.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      {/* Priority selector */}
                      <select
                        value={file.priority}
                        onChange={(e) => updatePriority(file.id, e.target.value as Priority)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        title="Độ ưu tiên trích xuất nội dung"
                      >
                        <option value="high">Ưu tiên Cao</option>
                        <option value="medium">Ưu tiên Vừa</option>
                        <option value="low">Tham khảo</option>
                      </select>

                      <span className="text-xs font-mono text-slate-500 w-16 text-right">
                        {file.size}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa tài liệu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Sau khi bấm phân tích, AI sẽ chuyển đổi tài liệu sang Markdown và bóc tách các mục tiêu sư phạm.
            </span>
          </div>

          <button
            type="submit"
            id="btn-submit-analyze-documents"
            disabled={isSubmitting}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý tài liệu...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Phân Tích Tài Liệu Nguồn</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
