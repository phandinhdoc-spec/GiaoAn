#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
VENV_DIR="$BACKEND_DIR/.venv"

if ! command -v python >/dev/null 2>&1; then
  echo "Không tìm thấy lệnh python." >&2
  exit 1
fi

if [[ ! -x "$VENV_DIR/bin/python" ]]; then
  python -m venv "$VENV_DIR"
fi

"$VENV_DIR/bin/python" -m pip install --upgrade pip
"$VENV_DIR/bin/python" -m pip install --upgrade -r "$BACKEND_DIR/requirements.txt"

if systemctl is-active --quiet firewalld; then
  if ! firewall-cmd --query-port=8000/tcp >/dev/null 2>&1; then
    echo "Đang mở bền vững cổng 8000/tcp trong firewalld..."
    if sudo -n firewall-cmd --permanent --add-port=8000/tcp && sudo -n firewall-cmd --reload; then
      echo "Đã mở cổng 8000/tcp trong firewalld."
    else
      echo "Không thể tự mở firewalld không cần mật khẩu; backend vẫn chạy trên máy này." >&2
    fi
  fi
fi

echo "Backend KHBD5512: http://0.0.0.0:8000/api"
cd "$REPO_ROOT"
exec "$VENV_DIR/bin/python" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
