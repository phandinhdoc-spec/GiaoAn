from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import app


def test_health_reports_service_ready() -> None:
    with TestClient(app) as client:
        response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_creating_project_returns_frontend_project_shape() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/projects",
            json={
                "title": "Bài kiểm thử",
                "subject": "Khoa học tự nhiên",
                "grade": "Lớp 8",
                "periods": 2,
                "learningOutcomes": "Kiểm thử",
                "additionalNotes": "",
            },
        )

    assert response.status_code == 201
    project = response.json()
    assert project["title"] == "Bài kiểm thử"
    assert project["sourceCount"] == 0
    assert project["status"] == "uploaded"


def test_upload_without_file_returns_vietnamese_error() -> None:
    with TestClient(app) as client:
        project = client.post("/api/projects", json={"title": "Kiểm thử thiếu tệp"}).json()
        response = client.post(f"/api/projects/{project['id']}/sources")

    assert response.status_code == 422
    assert response.json()["detail"] == "Vui lòng chọn một tệp tài liệu để tải lên."


def test_source_response_contains_persistent_conversion_metadata(monkeypatch) -> None:
    from backend.app import main

    def fake_convert(_: object, markdown_path: Path) -> None:
        markdown_path.write_text("# Nội dung thật\n", encoding="utf-8")

    monkeypatch.setattr(main, "convert_to_markdown", fake_convert)
    with TestClient(app) as client:
        project = client.post("/api/projects", json={"title": "Kiểm thử tài liệu"}).json()
        response = client.post(
            f"/api/projects/{project['id']}/sources",
            data={"priority": "high"},
            files={"file": ("tai-lieu.csv", b"cot1,cot2\n1,2\n", "text/csv")},
        )

    assert response.status_code == 201
    source = response.json()
    assert source["originalFilename"] == "tai-lieu.csv"
    assert source["status"] == "converted"
    assert source["createdAt"] == source["uploadedAt"]
    assert source["markdownPreview"] == "# Nội dung thật"


def test_deleting_project_removes_it_from_persistent_project_list() -> None:
    with TestClient(app) as client:
        project = client.post("/api/projects", json={"title": "Dự án cần xóa"}).json()
        response = client.delete(f"/api/projects/{project['id']}")
        fetched = client.get(f"/api/projects/{project['id']}")

    assert response.status_code == 204
    assert fetched.status_code == 404
