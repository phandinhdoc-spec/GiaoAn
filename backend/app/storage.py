from datetime import datetime, timezone
from pathlib import Path
import sqlite3
import uuid

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
MARKDOWN_DIR = DATA_DIR / "markdown"
DATABASE_PATH = DATA_DIR / "app.db"


def now() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="minutes")


def initialize() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)
    with connect() as connection:
        connection.executescript("""
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY, title TEXT NOT NULL, subject TEXT NOT NULL,
                grade TEXT NOT NULL, periods INTEGER NOT NULL, learning_outcomes TEXT NOT NULL,
                additional_notes TEXT NOT NULL, template_id TEXT NOT NULL,
                school_name TEXT, teacher_name TEXT, status TEXT NOT NULL,
                created_at TEXT NOT NULL, updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sources (
                id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                original_filename TEXT NOT NULL, file_type TEXT NOT NULL, file_size_bytes INTEGER NOT NULL,
                priority TEXT NOT NULL, uploaded_at TEXT NOT NULL, upload_path TEXT NOT NULL,
                markdown_path TEXT NOT NULL
            );
        """)


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def project_payload(row: sqlite3.Row) -> dict:
    return {"id": row["id"], "title": row["title"], "subject": row["subject"], "grade": row["grade"], "periods": row["periods"], "learningOutcomes": row["learning_outcomes"], "additionalNotes": row["additional_notes"], "templateId": row["template_id"], "schoolName": row["school_name"], "teacherName": row["teacher_name"], "status": row["status"], "createdAt": row["created_at"], "updatedAt": row["updated_at"], "sourceCount": row["source_count"], "progressPercentage": 25 if row["source_count"] else 10, "currentStageName": "Đã tải lên và chuyển đổi tài liệu nguồn" if row["source_count"] else "Đã tạo dự án, sẵn sàng nạp tài liệu"}


def get_project(project_id: str) -> dict | None:
    with connect() as connection:
        row = connection.execute("SELECT p.*, COUNT(s.id) AS source_count FROM projects p LEFT JOIN sources s ON s.project_id=p.id WHERE p.id=? GROUP BY p.id", (project_id,)).fetchone()
    return project_payload(row) if row else None


def list_projects() -> list[dict]:
    with connect() as connection:
        rows = connection.execute("SELECT p.*, COUNT(s.id) AS source_count FROM projects p LEFT JOIN sources s ON s.project_id=p.id GROUP BY p.id ORDER BY p.created_at DESC").fetchall()
    return [project_payload(row) for row in rows]


def create_project(data: dict) -> dict:
    project_id, timestamp = str(uuid.uuid4()), now()
    with connect() as connection:
        connection.execute("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (project_id, data["title"], data["subject"], data["grade"], data["periods"], data["learningOutcomes"], data["additionalNotes"], data["templateId"], data.get("schoolName"), data.get("teacherName"), "uploaded", timestamp, timestamp))
    return get_project(project_id)  # type: ignore[return-value]


def delete_project(project_id: str) -> list[Path] | None:
    with connect() as connection:
        project = connection.execute("SELECT id FROM projects WHERE id=?", (project_id,)).fetchone()
        if not project:
            return None
        source_rows = connection.execute(
            "SELECT upload_path, markdown_path FROM sources WHERE project_id=?", (project_id,)
        ).fetchall()
        connection.execute("DELETE FROM projects WHERE id=?", (project_id,))
    return [Path(value) for row in source_rows for value in (row["upload_path"], row["markdown_path"])]


def create_source(project_id: str, original_filename: str, file_type: str, file_size_bytes: int, priority: str, upload_path: Path, markdown_path: Path) -> dict:
    source_id, timestamp = str(uuid.uuid4()), now()
    with connect() as connection:
        connection.execute("INSERT INTO sources VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", (source_id, project_id, original_filename, file_type, file_size_bytes, priority, timestamp, str(upload_path), str(markdown_path)))
        connection.execute("UPDATE projects SET status='converting', updated_at=? WHERE id=?", (timestamp, project_id))
    return get_source(source_id)  # type: ignore[return-value]


def format_size(size: int) -> str:
    return f"{size / (1024 * 1024):.1f} MB" if size >= 1024 * 1024 else f"{size / 1024:.1f} KB"


def source_payload(row: sqlite3.Row) -> dict:
    markdown = Path(row["markdown_path"]).read_text(encoding="utf-8")
    return {
        "id": row["id"],
        "projectId": row["project_id"],
        "originalFilename": row["original_filename"],
        "fileName": row["original_filename"],
        "fileSize": format_size(row["file_size_bytes"]),
        "fileType": row["file_type"],
        "priority": row["priority"],
        "status": "converted",
        "createdAt": row["uploaded_at"],
        "uploadedAt": row["uploaded_at"],
        "summary": "Tài liệu đã được chuyển đổi cục bộ thành Markdown bằng AnyDoc.",
        "relevanceScore": 100,
        "markdownPreview": markdown[:500].rstrip(),
        "markdownContent": markdown,
        "detectedItems": {"objectives": [], "activities": [], "exercises": [], "experiments": [], "imagesAndTables": []},
    }


def get_source(source_id: str) -> dict | None:
    with connect() as connection:
        row = connection.execute("SELECT * FROM sources WHERE id=?", (source_id,)).fetchone()
    return source_payload(row) if row else None


def list_sources(project_id: str) -> list[dict]:
    with connect() as connection:
        rows = connection.execute("SELECT * FROM sources WHERE project_id=? ORDER BY uploaded_at", (project_id,)).fetchall()
    return [source_payload(row) for row in rows]


def delete_source(project_id: str, source_id: str) -> tuple[Path, Path] | None:
    with connect() as connection:
        row = connection.execute("SELECT * FROM sources WHERE id=? AND project_id=?", (source_id, project_id)).fetchone()
        if not row:
            return None
        connection.execute("DELETE FROM sources WHERE id=?", (source_id,))
    return Path(row["upload_path"]), Path(row["markdown_path"])


def get_markdown_path(source_id: str) -> Path | None:
    with connect() as connection:
        row = connection.execute("SELECT markdown_path FROM sources WHERE id=?", (source_id,)).fetchone()
    return Path(row["markdown_path"]) if row else None
