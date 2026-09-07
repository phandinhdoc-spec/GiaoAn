import {
  Project,
  SourceDocument,
  Lesson,
  LessonSection,
  Template,
  ReviewIssue,
  Job,
  JobStatus,
  AnalysisSummary,
} from '../types';
import {
  INITIAL_LESSON_SAMPLE,
  INITIAL_TEMPLATES,
  INITIAL_REVIEW_ISSUES_SAMPLE,
  INITIAL_JOB_SAMPLE,
} from './mockData';

/**
 * Local in-memory state simulating a FastAPI database backend.
 * All UI components MUST interact with this exclusively via the ApiService instance.
 */
class ApiStorage {
  // TODO(backend): temporary state only for the remaining non-MVP mock flows.
  // Project and source API methods below do not read or write this state.
  private projects: Project[] = [];
  private sources: Record<string, SourceDocument[]> = {};
  private lessons: Record<string, Lesson> = {
    'proj-khtn8-bai5': { ...INITIAL_LESSON_SAMPLE },
  };
  private templates: Template[] = [...INITIAL_TEMPLATES];
  private reviewIssues: Record<string, ReviewIssue[]> = {
    'proj-khtn8-bai5': [...INITIAL_REVIEW_ISSUES_SAMPLE],
  };
  private jobs: Record<string, Job> = {
    'job-proj-khtn8-bai5': { ...INITIAL_JOB_SAMPLE },
    'job-proj-khtn8-bai15': {
      id: 'job-proj-khtn8-bai15',
      projectId: 'proj-khtn8-bai15',
      status: 'reviewing',
      progressPercentage: 78,
      currentStepIndex: 5,
      totalSteps: 7,
      currentStageName: 'Đang thẩm định sư phạm và chuẩn hóa thời lượng',
      createdAt: '2025-02-27 14:10:00',
      updatedAt: '2025-02-27 15:45:00',
      agentMetadata: {
        modelUsed: 'Gemini 2.5 Pro Pedagogical Reasoner',
        tokensProcessed: 11200,
        reasoningSteps: 28,
        confidenceScore: 0.96,
        activeAgents: ['DocumentParserAgent', 'CurriculumAlignmentAgent', 'CV5512ValidatorAgent'],
      },
      logs: [
        {
          id: 'log-15-1',
          timestamp: '14:10:05',
          stage: 'uploaded',
          type: 'info',
          message: 'Tiếp nhận 2 tài liệu SGK KHTN 8 bài Lực đẩy Ác-si-mét.',
        },
        {
          id: 'log-15-2',
          timestamp: '14:10:30',
          stage: 'converting',
          type: 'info',
          message: 'Chuyển đổi công thức F_A = d.V và mô hình bình tràn.',
        },
        {
          id: 'log-15-3',
          timestamp: '14:11:00',
          stage: 'planning',
          type: 'agent',
          message: 'Lập tiến trình 2 tiết thực hành STEM.',
        },
        {
          id: 'log-15-4',
          timestamp: '14:11:45',
          stage: 'writing',
          type: 'agent',
          message: 'Biên soạn phiếu học tập đo lực kế và bình chia độ.',
        },
        {
          id: 'log-15-5',
          timestamp: '14:12:15',
          stage: 'reviewing',
          type: 'warning',
          message: 'Phát hiện cần kiểm tra an toàn khi làm thí nghiệm với nước tràn trên bàn học.',
        },
      ],
    },
  };

  public getProjectsList(): Project[] {
    return [...this.projects];
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  public addProject(project: Project): Project {
    this.projects.unshift(project);
    return project;
  }

  public updateProjectData(id: string, updates: Partial<Project>): Project {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.projects[idx] = {
        ...this.projects[idx],
        ...updates,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      return this.projects[idx];
    }
    throw new Error(`Project with ID ${id} not found`);
  }

  public removeProject(id: string): void {
    this.projects = this.projects.filter((p) => p.id !== id);
    delete this.sources[id];
    delete this.lessons[id];
    delete this.reviewIssues[id];
  }

  public getSourcesByProject(projectId: string): SourceDocument[] {
    return this.sources[projectId] || [];
  }

  public setSourcesForProject(projectId: string, sources: SourceDocument[]): void {
    this.sources[projectId] = sources;
    const project = this.getProjectById(projectId);
    if (project) {
      this.updateProjectData(projectId, { sourceCount: sources.length });
    }
  }

  public addSourceToProject(projectId: string, source: SourceDocument): void {
    if (!this.sources[projectId]) {
      this.sources[projectId] = [];
    }
    this.sources[projectId].push(source);
    const project = this.getProjectById(projectId);
    if (project) {
      this.updateProjectData(projectId, { sourceCount: this.sources[projectId].length });
    }
  }

  public deleteSourceFromProject(projectId: string, sourceId: string): void {
    if (this.sources[projectId]) {
      this.sources[projectId] = this.sources[projectId].filter((s) => s.id !== sourceId);
      const project = this.getProjectById(projectId);
      if (project) {
        this.updateProjectData(projectId, { sourceCount: this.sources[projectId].length });
      }
    }
  }

  public getLessonByProject(projectId: string): Lesson | undefined {
    return this.lessons[projectId];
  }

  public saveLesson(projectId: string, lesson: Lesson): Lesson {
    this.lessons[projectId] = { ...lesson, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) };
    return this.lessons[projectId];
  }

  public getTemplatesList(): Template[] {
    return [...this.templates];
  }

  public getReviewIssues(projectId: string): ReviewIssue[] {
    return this.reviewIssues[projectId] || [];
  }

  public setReviewIssues(projectId: string, issues: ReviewIssue[]): void {
    this.reviewIssues[projectId] = issues;
  }

  public getJobById(jobId: string): Job | undefined {
    return this.jobs[jobId];
  }

  public getJobByProjectId(projectId: string): Job | undefined {
    return Object.values(this.jobs).find((j) => j.projectId === projectId);
  }

  public saveJob(job: Job): Job {
    this.jobs[job.id] = job;
    return job;
  }
}

const storage = new ApiStorage();

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail || `Yêu cầu máy chủ thất bại (${response.status}).`);
  }
  return response.status === 204 ? (true as T) : (response.json() as Promise<T>);
}

// TODO(backend): Chỉ còn dùng cho các luồng AI/thẩm định/Typst chưa thuộc MVP.
const delay = (ms: number = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * ApiService provides strict abstraction over backend endpoints.
 * When FastAPI backend is ready, change this layer without rewriting UI components.
 */
export class ApiService {
  /**
   * GET /api/projects
   */
  async getProjects(): Promise<Project[]> {
    return request<Project[]>('/projects');
  }

  /**
   * POST /api/projects
   */
  async createProject(data: Partial<Project>): Promise<Project> {
    return request<Project>('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  /**
   * GET /api/projects/:id
   */
  async getProject(id: string): Promise<Project> {
    return request<Project>(`/projects/${encodeURIComponent(id)}`);
  }

  /**
   * DELETE /api/projects/:id
   */
  async deleteProject(id: string): Promise<boolean> {
    return request<boolean>(`/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  /**
   * POST /api/projects/:id/sources
   */
  async uploadSources(
    projectId: string,
    files: Array<{ file: File; priority: 'high' | 'medium' | 'low' }>
  ): Promise<SourceDocument[]> {
    const uploaded: SourceDocument[] = [];
    for (const item of files) {
      const body = new FormData();
      body.append('file', item.file);
      body.append('priority', item.priority);
      uploaded.push(await request<SourceDocument>(`/projects/${encodeURIComponent(projectId)}/sources`, { method: 'POST', body }));
    }
    return uploaded;
  }

  /**
   * DELETE /api/projects/:id/sources/:sourceId
   */
  async deleteSource(projectId: string, sourceId: string): Promise<boolean> {
    return request<boolean>(`/projects/${encodeURIComponent(projectId)}/sources/${encodeURIComponent(sourceId)}`, { method: 'DELETE' });
  }

  async getSources(projectId: string): Promise<SourceDocument[]> {
    return request<SourceDocument[]>(`/projects/${encodeURIComponent(projectId)}/sources`);
  }

  async getSourceMarkdown(sourceId: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/sources/${encodeURIComponent(sourceId)}/markdown`);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.detail || 'Không thể tải Markdown của tài liệu.');
    }
    return response.text();
  }

  /**
   * POST /api/projects/:id/analyze
   */
  async analyzeProjectSources(projectId: string): Promise<{
    project: Project;
    sources: SourceDocument[];
    summary: AnalysisSummary;
  }> {
    const project = await this.getProject(projectId);
    const sources = await this.getSources(projectId);

    const allObjectives = Array.from(new Set(sources.flatMap((s) => s.detectedItems.objectives)));
    const allActivities = Array.from(new Set(sources.flatMap((s) => s.detectedItems.activities)));
    const allExercises = Array.from(new Set(sources.flatMap((s) => s.detectedItems.exercises)));
    const allExperiments = Array.from(new Set(sources.flatMap((s) => s.detectedItems.experiments)));
    const allImagesAndTables = Array.from(new Set(sources.flatMap((s) => s.detectedItems.imagesAndTables)));

    const summary: AnalysisSummary = {
      totalSources: sources.length,
      totalTokensEstimated: 0,
      overallSummary: `Đã chuyển đổi cục bộ ${sources.length} tài liệu nguồn của bài học "${project.title}" sang Markdown. Chức năng phân tích AI chưa thuộc MVP.`,
      detectedObjectives: allObjectives,
      detectedTeachingActivities: allActivities,
      exercises: allExercises,
      experiments: allExperiments,
      imagesAndTables: allImagesAndTables,
      pedagogicalInsights: [],
    };

    return {
      project,
      sources,
      summary,
    };
  }

  /**
   * POST /api/projects/:id/generate
   * Starts or resumes the full generation pipeline job
   */
  async generateLesson(projectId: string): Promise<{ job: Job }> {
    await delay(300);
    const project = await this.getProject(projectId);

    const jobId = `job-${projectId}`;
    const newJob: Job = {
      id: jobId,
      projectId,
      status: 'planning',
      progressPercentage: 55,
      currentStepIndex: 3,
      totalSteps: 7,
      currentStageName: 'Đang xây dựng ma trận mục tiêu & tiến trình sư phạm...',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      agentMetadata: {
        modelUsed: 'Gemini 2.5 Pro Pedagogical Engine',
        tokensProcessed: 12500,
        reasoningSteps: 34,
        confidenceScore: 0.97,
        activeAgents: ['CurriculumAlignmentAgent', 'LessonSynthesizerAgent', 'TypstRenderEngine'],
      },
      logs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          stage: 'uploaded',
          type: 'info',
          message: `Tiếp nhận tài liệu dự án ${project.title}.`,
          details: 'Dữ liệu được chuẩn hóa và kiểm tra tính toàn vẹn.',
        },
        {
          id: `log-${Date.now()}-2`,
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          stage: 'converting',
          type: 'info',
          message: 'Chuyển đổi dữ liệu và bóc tách các bảng biểu, công thức.',
          details: 'Trích xuất cấu trúc văn bản phân cấp h1, h2, h3 và định dạng biểu thức.',
        },
        {
          id: `log-${Date.now()}-3`,
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          stage: 'analyzing',
          type: 'agent',
          message: 'Đối chiếu yêu cầu cần đạt chuẩn Chương trình GDPT 2018.',
          details: 'Xác định các năng lực đặc thù KHTN: Nhận thức, Tìm hiểu, Vận dụng.',
        },
        {
          id: `log-${Date.now()}-4`,
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          stage: 'planning',
          type: 'agent',
          message: 'Phân bổ ma trận 4 hoạt động dạy học theo Công văn 5512/BGDĐT.',
          details: `Thiết kế chuỗi hoạt động tối ưu cho thời lượng ${project.periods} tiết học.`,
        },
      ],
    };

    storage.saveJob(newJob);
    storage.updateProjectData(projectId, {
      status: 'planning',
      progressPercentage: 55,
      currentStageName: 'Đang kiến tạo kế hoạch bài dạy...',
    });

    // Ensure lesson exists in storage
    let lesson = storage.getLessonByProject(projectId);
    if (!lesson) {
      lesson = {
        ...INITIAL_LESSON_SAMPLE,
        id: `lesson-${projectId}`,
        projectId,
        title: project.title,
        subject: project.subject,
        grade: project.grade,
        periods: project.periods,
      };
      storage.saveLesson(projectId, lesson);
    }

    // Ensure review issues exist
    if (storage.getReviewIssues(projectId).length === 0) {
      storage.setReviewIssues(
        projectId,
        INITIAL_REVIEW_ISSUES_SAMPLE.map((iss) => ({ ...iss, projectId }))
      );
    }

    return { job: newJob };
  }

  /**
   * GET /api/jobs/:id
   */
  async getJob(jobId: string): Promise<Job> {
    await delay(150);
    let job = storage.getJobById(jobId);
    if (!job) {
      // Fallback find by projectId
      job = storage.getJobByProjectId(jobId.replace('job-', ''));
    }
    if (!job) {
      return {
        ...INITIAL_JOB_SAMPLE,
        id: jobId,
      };
    }
    return job;
  }

  /**
   * Simulate advancement of job progress in the background/demo
   */
  async advanceJobStep(jobId: string): Promise<Job> {
    const job = await this.getJob(jobId);
    const steps: JobStatus[] = ['uploaded', 'converting', 'analyzing', 'planning', 'writing', 'reviewing', 'rendering', 'completed'];
    const currentIdx = steps.indexOf(job.status);

    if (currentIdx < steps.length - 1) {
      const nextStatus = steps[currentIdx + 1];
      const nextPercentage = Math.round(((currentIdx + 2) / steps.length) * 100);

      const stageNames: Record<JobStatus, string> = {
        uploaded: 'Đã nạp tài liệu nguồn',
        converting: 'Đang chuyển đổi tài liệu sang Markdown',
        analyzing: 'Đang phân tích đối chiếu chuẩn chương trình',
        planning: 'Đang lập dàn ý ma trận sư phạm 5512',
        writing: 'Đang biên soạn chi tiết chuỗi 4 hoạt động',
        reviewing: 'Đang thẩm định sư phạm và kiểm tra an toàn',
        rendering: 'Đang biên dịch Typst sang bản in PDF',
        completed: 'Hoàn tất toàn bộ quy trình biên soạn',
        failed: 'Quy trình xử lý gặp lỗi',
      };

      const newLog: Job['logs'][0] = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        stage: nextStatus,
        type: nextStatus === 'completed' ? 'success' : 'agent',
        message: `Đã hoàn thành bước: ${stageNames[nextStatus]}`,
        details: `Hệ thống Agent tự động cập nhật và chuyển giao sang bước tiếp theo. Độ tin cậy: ${(Math.random() * 0.05 + 0.94).toFixed(2)}.`,
      };

      const updatedJob: Job = {
        ...job,
        status: nextStatus,
        progressPercentage: nextPercentage,
        currentStepIndex: currentIdx + 2,
        currentStageName: stageNames[nextStatus],
        logs: [...job.logs, newLog],
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };

      storage.saveJob(updatedJob);
      storage.updateProjectData(job.projectId, {
        status: nextStatus,
        progressPercentage: nextPercentage,
        currentStageName: stageNames[nextStatus],
      });

      return updatedJob;
    }

    return job;
  }

  /**
   * GET /api/projects/:id/lesson
   */
  async getLesson(projectId: string): Promise<Lesson> {
    await delay(200);
    let lesson = storage.getLessonByProject(projectId);
    if (!lesson) {
      const project = await this.getProject(projectId);
      lesson = {
        ...INITIAL_LESSON_SAMPLE,
        id: `lesson-${projectId}`,
        projectId,
        title: project.title,
        subject: project.subject,
        grade: project.grade,
        periods: project.periods,
      };
      storage.saveLesson(projectId, lesson);
    }
    return lesson;
  }

  /**
   * PUT /api/projects/:id/lesson
   */
  async updateLesson(projectId: string, lessonUpdates: Partial<Lesson>): Promise<Lesson> {
    await delay(250);
    const existing = await this.getLesson(projectId);

    // Reconstruct rawMarkdown if sections updated or vice-versa
    let updatedSections = lessonUpdates.sections || existing.sections;
    let updatedRawMarkdown = lessonUpdates.rawMarkdown || existing.rawMarkdown;

    if (lessonUpdates.sections && !lessonUpdates.rawMarkdown) {
      updatedRawMarkdown = updatedSections.map((s) => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
    }

    const updated: Lesson = {
      ...existing,
      ...lessonUpdates,
      sections: updatedSections,
      rawMarkdown: updatedRawMarkdown,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    storage.saveLesson(projectId, updated);
    storage.updateProjectData(projectId, {
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });

    return updated;
  }

  /**
   * Execute per-section AI action menu:
   * - Rewrite (Viết lại sư phạm hơn)
   * - Shorten (Rút gọn cô đọng)
   * - Expand (Mở rộng chi tiết)
   * - Add student activity (Thêm hoạt động học sinh)
   * - Add questions (Thêm câu hỏi / bài tập)
   * - Check accuracy (Kiểm tra độ chính xác)
   */
  async executeSectionAIAction(
    projectId: string,
    sectionId: string,
    action: 'rewrite' | 'shorten' | 'expand' | 'add_activity' | 'add_questions' | 'check_accuracy',
    customPrompt?: string
  ): Promise<{ updatedSection: LessonSection; explanation: string }> {
    await delay(700);
    const lesson = await this.getLesson(projectId);
    const sectionIndex = lesson.sections.findIndex((s) => s.id === sectionId);

    if (sectionIndex === -1) {
      throw new Error(`Mục ${sectionId} không tồn tại trong kế hoạch bài dạy.`);
    }

    const section = lesson.sections[sectionIndex];
    if (section.isLocked) {
      throw new Error(`Mục "${section.title}" đã được khóa. Vui lòng mở khóa trước khi thực hiện thao tác AI.`);
    }

    let modifiedContent = section.content;
    let explanation = '';

    switch (action) {
      case 'rewrite':
        explanation = 'Đã viết lại mục theo phong cách sư phạm chuẩn xác, nhấn mạnh vào sự chủ động của học sinh.';
        modifiedContent = section.content + `\n\n*(Đã tinh chỉnh diễn đạt theo phương pháp dạy học tích cực và chuẩn từ vựng khoa học GDPT 2018)*`;
        break;
      case 'shorten':
        explanation = 'Đã rút gọn các chỉ dẫn thừa, cô đọng nội dung chính giúp tiết kiệm thời gian giảng dạy.';
        modifiedContent = section.content
          .split('\n')
          .filter((_, idx) => idx % 4 !== 3)
          .join('\n');
        break;
      case 'expand':
        explanation = 'Đã bổ sung chi tiết các bước tổ chức: Chuyển giao nhiệm vụ -> Thực hiện -> Báo cáo thảo luận -> Kết luận nhận định.';
        modifiedContent =
          section.content +
          `\n\n#### Chỉ dẫn mở rộng cho Giáo viên:\n- Hỗ trợ nhóm học sinh gặp khó khăn bằng các câu hỏi gợi mở từng bước.\n- Sử dụng phiếu đánh giá chéo giữa các tổ để tăng tính tương tác.`;
        break;
      case 'add_activity':
        explanation = 'Đã tích hợp thêm hoạt động trải nghiệm nhóm và trò chơi tiếp sức học tập.';
        modifiedContent =
          section.content +
          `\n\n**Hoạt động bổ trợ học sinh (5 phút):**\n- Trò chơi "Ai nhanh hơn": Học sinh bắt cặp đối kháng giải nhanh 2 tình huống thực tế và gắn thẻ đáp án lên bảng nhóm.`;
        break;
      case 'add_questions':
        explanation = 'Đã bổ sung 2 câu hỏi tư duy phản biện và 1 bài tập vận dụng thực tế.';
        modifiedContent =
          section.content +
          `\n\n**Câu hỏi & Bài tập phát triển tư duy:**\n1. *Câu hỏi nhận biết:* Nêu 2 dấu hiệu chứng tỏ phản ứng hóa học đã xảy ra trong thí nghiệm trên?\n2. *Câu hỏi vận dụng cao:* Em hãy đề xuất phương án bảo quản thực phẩm dựa trên nguyên lý tốc độ phản ứng đã học?`;
        break;
      case 'check_accuracy':
        explanation = 'Đã rà soát tính chuẩn xác của các công thức hóa học, danh pháp IUPAC và đơn vị đo lường.';
        modifiedContent = section.content;
        break;
    }

    if (customPrompt) {
      modifiedContent += `\n\n*(Yêu cầu bổ sung: ${customPrompt})*`;
      explanation += ` Kèm theo yêu cầu tùy chỉnh của giáo viên.`;
    }

    const updatedSection: LessonSection = {
      ...section,
      content: modifiedContent,
    };

    const newSections = [...lesson.sections];
    newSections[sectionIndex] = updatedSection;

    await this.updateLesson(projectId, { sections: newSections });
    return { updatedSection, explanation };
  }

  /**
   * Toggle section locked state
   */
  async toggleSectionLock(projectId: string, sectionId: string): Promise<LessonSection> {
    await delay(150);
    const lesson = await this.getLesson(projectId);
    const sectionIndex = lesson.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) throw new Error('Không tìm thấy mục');

    const updatedSection = {
      ...lesson.sections[sectionIndex],
      isLocked: !lesson.sections[sectionIndex].isLocked,
    };

    const newSections = [...lesson.sections];
    newSections[sectionIndex] = updatedSection;

    await this.updateLesson(projectId, { sections: newSections });
    return updatedSection;
  }

  /**
   * POST /api/projects/:id/review
   */
  async reviewLesson(projectId: string): Promise<{
    issues: ReviewIssue[];
    summary: {
      total: number;
      errorCount: number;
      warningCount: number;
      successCount: number;
    };
  }> {
    await delay(450);
    let issues = storage.getReviewIssues(projectId);
    if (issues.length === 0) {
      issues = [...INITIAL_REVIEW_ISSUES_SAMPLE.map((iss) => ({ ...iss, projectId }))];
      storage.setReviewIssues(projectId, issues);
    }

    const errorCount = issues.filter((i) => i.severity === 'error' && !i.isResolved).length;
    const warningCount = issues.filter((i) => i.severity === 'warning' && !i.isResolved).length;
    const successCount = issues.filter((i) => i.severity === 'success' || i.isResolved).length;

    storage.updateProjectData(projectId, {
      status: errorCount > 0 ? 'reviewing' : 'rendering',
      currentStageName: errorCount > 0 ? 'Phát hiện vấn đề cần khắc phục' : 'Thẩm định sư phạm thành công',
    });

    return {
      issues,
      summary: {
        total: issues.length,
        errorCount,
        warningCount,
        successCount,
      },
    };
  }

  /**
   * Fix a specific pedagogical review issue automatically with AI
   */
  async fixIssueWithAI(projectId: string, issueId: string): Promise<{ issue: ReviewIssue; fixedContent?: string }> {
    await delay(600);
    const issues = storage.getReviewIssues(projectId);
    const issueIndex = issues.findIndex((i) => i.id === issueId);
    if (issueIndex === -1) throw new Error('Không tìm thấy vấn đề thẩm định');

    const issue = issues[issueIndex];
    const resolvedIssue: ReviewIssue = {
      ...issue,
      isResolved: true,
    };

    issues[issueIndex] = resolvedIssue;
    storage.setReviewIssues(projectId, [...issues]);

    // Apply auto fix to the relevant lesson section if matched
    if (issue.sectionId) {
      const lesson = await this.getLesson(projectId);
      const secIdx = lesson.sections.findIndex((s) => s.id === issue.sectionId);
      if (secIdx !== -1 && !lesson.sections[secIdx].isLocked) {
        const sec = lesson.sections[secIdx];
        const newSec = {
          ...sec,
          content: sec.content + `\n\n> **[Đã điều chỉnh theo góp ý thẩm định AI]:** ${issue.suggestedFix}`,
        };
        const newSections = [...lesson.sections];
        newSections[secIdx] = newSec;
        await this.updateLesson(projectId, { sections: newSections });
      }
    }

    return { issue: resolvedIssue };
  }

  /**
   * POST /api/projects/:id/render
   */
  async renderTypst(
    projectId: string,
    templateId: string,
    customTypstSource?: string
  ): Promise<{
    pdfUrl: string;
    typstSource: string;
    totalPages: number;
    renderedAt: string;
  }> {
    await delay(500);
    const project = await this.getProject(projectId);
    const lesson = await this.getLesson(projectId);
    const templates = await this.getTemplates();
    const template = templates.find((t) => t.id === templateId) || templates[0];

    const finalTypst = customTypstSource || template.typstTemplate || lesson.typstSource;

    storage.updateProjectData(projectId, {
      status: 'completed',
      progressPercentage: 100,
      currentStageName: 'Đã hoàn thành xuất bản tài liệu PDF',
      templateId,
    });

    return {
      pdfUrl: `#pdf-preview-${project.id}`,
      typstSource: finalTypst,
      totalPages: 6,
      renderedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
  }

  /**
   * GET /api/templates
   */
  async getTemplates(): Promise<Template[]> {
    await delay(180);
    return storage.getTemplatesList();
  }

  /**
   * Set active template for a project
   */
  async setProjectTemplate(projectId: string, templateId: string): Promise<Project> {
    await delay(200);
    return storage.updateProjectData(projectId, { templateId });
  }
}

export const apiService = new ApiService();
