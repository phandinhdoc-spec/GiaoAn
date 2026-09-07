from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    title: str = "Kế hoạch bài dạy mới"
    subject: str = "Khoa học tự nhiên"
    grade: str = "Lớp 8"
    periods: int = Field(default=2, ge=1)
    learningOutcomes: str = ""
    additionalNotes: str = ""
    templateId: str = "tpl-cv5512-standard"
    schoolName: str | None = None
    teacherName: str | None = None


class ProjectResponse(ProjectCreate):
    model_config = ConfigDict(populate_by_name=True)
    id: str
    status: str
    createdAt: str
    updatedAt: str
    sourceCount: int
    progressPercentage: int
    currentStageName: str | None = None


class SourceDocumentResponse(BaseModel):
    id: str
    projectId: str
    originalFilename: str
    fileName: str
    fileSize: str
    fileType: str
    priority: str
    status: str
    createdAt: str
    uploadedAt: str
    summary: str
    relevanceScore: int
    markdownPreview: str
    markdownContent: str
    detectedItems: dict[str, list[str]]
