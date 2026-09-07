from pathlib import Path
import subprocess


class AnyDocConversionError(Exception):
    pass


def convert_to_markdown(source_path: Path, markdown_path: Path) -> None:
    try:
        result = subprocess.run(
            ["anydoc", str(source_path), "-o", str(markdown_path)],
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
    except FileNotFoundError as exc:
        raise AnyDocConversionError("Không tìm thấy lệnh anydoc trên máy chủ.") from exc
    except subprocess.TimeoutExpired as exc:
        raise AnyDocConversionError("Chuyển đổi tài liệu quá 120 giây và đã bị dừng.") from exc

    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "AnyDoc không cung cấp chi tiết lỗi.").strip()
        raise AnyDocConversionError(f"AnyDoc không thể chuyển đổi tài liệu: {detail}")
    if not markdown_path.is_file():
        raise AnyDocConversionError("AnyDoc đã chạy nhưng không tạo được tệp Markdown.")
