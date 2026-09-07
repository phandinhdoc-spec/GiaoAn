from contextlib import asynccontextmanager
from pathlib import Path
import os
import uuid

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from .models import ProjectCreate, ProjectResponse, SourceDocumentResponse
from . import storage
from .services.anydoc import AnyDocConversionError, convert_to_markdown

MAX_UPLOAD_BYTES = 50 * 1024 * 1024
ALLOWED_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".docm", ".ppt", ".pptx", ".pptm", ".xls",
    ".xlsx", ".xlsm", ".xlsb", ".odt", ".ods", ".odp", ".rtf", ".epub", ".csv",
}
FILE_TYPES = {".pdf": "pdf", ".doc": "docx", ".docx": "docx", ".docm": "docx", ".ppt": "pptx", ".pptx": "pptx", ".pptm": "pptx"}


@asynccontextmanager
async def lifespan(_: FastAPI):
    storage.initialize()
    yield


app = FastAPI(title="KHBD5512 API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.1.117:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_, exc: RequestValidationError) -> JSONResponse:
    if any(error["loc"][-1] == "file" and error["type"] == "missing" for error in exc.errors()):
        return JSONResponse(status_code=422, content={"detail": "Vui lòng chọn một tệp tài liệu để tải lên."})
    return JSONResponse(status_code=422, content={"detail": "Dữ liệu yêu cầu không hợp lệ."})


def require_project(project_id: str) -> dict:
    project = storage.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Không tìm thấy dự án.")
    return project


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/projects", response_model=list[ProjectResponse])
def get_projects() -> list[dict]:
    return storage.list_projects()


@app.post("/api/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def post_project(data: ProjectCreate) -> dict:
    return storage.create_project(data.model_dump())


@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str) -> dict:
    return require_project(project_id)


@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_project(project_id: str) -> None:
    paths = storage.delete_project(project_id)
    if paths is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dự án.")
    for path in paths:
        path.unlink(missing_ok=True)


@app.get("/api/projects/{project_id}/sources", response_model=list[SourceDocumentResponse])
def get_sources(project_id: str) -> list[dict]:
    require_project(project_id)
    return storage.list_sources(project_id)


@app.post("/api/projects/{project_id}/sources", response_model=SourceDocumentResponse, status_code=status.HTTP_201_CREATED)
async def post_source(project_id: str, file: UploadFile = File(...), priority: str = Form("high")) -> dict:
    require_project(project_id)
    original_filename = file.filename or "tai-lieu"
    suffix = Path(original_filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=415, detail="Định dạng tệp không được hỗ trợ. Vui lòng tải PDF, Office, OpenDocument, RTF, EPUB hoặc CSV.")
    if priority not in {"high", "medium", "low"}:
        raise HTTPException(status_code=422, detail="Mức độ ưu tiên không hợp lệ.")

    safe_name = f"{uuid.uuid4()}{suffix}"
    upload_path = storage.UPLOADS_DIR / safe_name
    markdown_path = storage.MARKDOWN_DIR / f"{uuid.uuid4()}.md"
    size = 0
    try:
        with upload_path.open("wb") as destination:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail="Tệp vượt quá giới hạn 50 MB.")
                destination.write(chunk)
        convert_to_markdown(upload_path, markdown_path)
        return storage.create_source(project_id, original_filename, FILE_TYPES.get(suffix, "other"), size, priority, upload_path, markdown_path)
    except HTTPException:
        upload_path.unlink(missing_ok=True)
        markdown_path.unlink(missing_ok=True)
        raise
    except AnyDocConversionError as exc:
        upload_path.unlink(missing_ok=True)
        markdown_path.unlink(missing_ok=True)
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except OSError as exc:
        upload_path.unlink(missing_ok=True)
        markdown_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="Không thể lưu tệp tải lên trên máy chủ.") from exc
    finally:
        await file.close()


@app.delete("/api/projects/{project_id}/sources/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_source(project_id: str, source_id: str) -> None:
    require_project(project_id)
    paths = storage.delete_source(project_id, source_id)
    if not paths:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu nguồn.")
    for path in paths:
        path.unlink(missing_ok=True)


@app.get("/api/sources/{source_id}/markdown")
def get_markdown(source_id: str) -> FileResponse:
    markdown_path = storage.get_markdown_path(source_id)
    if not markdown_path or not markdown_path.is_file():
        raise HTTPException(status_code=404, detail="Không tìm thấy Markdown của tài liệu.")
    return FileResponse(markdown_path, media_type="text/markdown; charset=utf-8", filename=f"{source_id}.md")
