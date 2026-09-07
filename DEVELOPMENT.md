# Phát triển KHBD5512

Terminal 1 (frontend):

```bash
npm run dev:lan
```

Terminal 2 (backend):

```bash
./scripts/run-backend.sh
```

Kiểm tra backend:

```bash
curl http://127.0.0.1:8000/api/health
```

Tạo dự án trong giao diện, chọn một tệp PDF hoặc DOCX (tối đa 50 MB), rồi bấm phân tích. Backend chạy AnyDoc hoàn toàn cục bộ và nút “Xem Markdown” tải nội dung Markdown thật.

Chưa triển khai trong MVP này: AI/Hermes/Codex/agy, thẩm định AI và xuất Typst PDF.
