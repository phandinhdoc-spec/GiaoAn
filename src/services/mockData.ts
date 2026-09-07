import {
  Project,
  SourceDocument,
  Lesson,
  Template,
  ReviewIssue,
  Job,
  AnalysisSummary,
} from '../types';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tpl-cv5512-standard',
    name: 'Kế hoạch bài dạy chuẩn Công văn 5512',
    version: 'v2.4 (2025)',
    description: 'Mẫu chuẩn sư phạm của Bộ GD&ĐT Việt Nam theo khung Công văn 5512/BGDĐT-GDTrH với cấu trúc 4 bước rõ ràng, bảng ma trận mục tiêu và phiếu học tập.',
    badge: 'Chuẩn Bộ GD&ĐT',
    author: 'Tổ Chuyên môn KHTN',
    previewColor: '#2563eb',
    isActive: true,
    features: [
      'Đầy đủ 4 hoạt động: Khởi động, Khám phá, Luyện tập, Vận dụng',
      'Định dạng bảng cột đôi: Hoạt động của GV - Hoạt động của HS',
      'Tích hợp Rubric và thang đo năng lực 3 mức độ',
      'Font Times New Roman / Plus Jakarta Sans chuẩn in ấn A4',
    ],
    suitableFor: 'Khoa học tự nhiên, Vật lí, Hóa học, Sinh học THCS & THPT',
    typstTemplate: `// Typst Template - Chuẩn Công văn 5512 BGDĐT
#set page(
  paper: "a4",
  margin: (x: 2cm, top: 2cm, bottom: 2cm),
  header: align(right)[
    #text(size: 8.5pt, fill: rgb("#64748b"))[KẾ HOẠCH BÀI DẠY KHTN 8 - CHUẨN CV 5512]
  ],
  footer: [
    #line(length: 100%, stroke: 0.5pt + rgb("#cbd5e1"))
    #grid(
      columns: (1fr, 1fr),
      align(left)[#text(size: 8.5pt, fill: rgb("#94a3b8"))[Giáo viên: ThS. Nguyễn Hoàng Lan]],
      align(right)[#text(size: 8.5pt, fill: rgb("#94a3b8"))[Trang #counter(page).display()]]
    )
  ]
)

#set text(font: "Times New Roman", size: 12pt, lang: "vi")
#set par(justify: true, leading: 0.75em)

#align(center)[
  #text(weight: "bold", size: 13pt)[TRƯỜNG THCS NGUYỄN DU - TỔ KHOA HỌC TỰ NHIÊN]\n
  #text(weight: "bold", size: 15pt, fill: rgb("#1e3a8a"))[KẾ HOẠCH BÀI DẠY]\n
  #text(weight: "bold", size: 13pt)[MÔN: KHOA HỌC TỰ NHIÊN 8 (BỘ SÁCH KẾT NỐI TRI THỨC)]\n
  #text(weight: "bold", size: 14pt, fill: rgb("#047857"))[BÀI 5: ĐỊNH LUẬT BẢO TOÀN KHỐI LƯỢNG VÀ PHƯƠNG TRÌNH HÓA HỌC]\n
  #text(style: "italic", size: 11pt)[(Thời lượng: 03 tiết)]
]

#v(10pt)
== I. MỤC TIÊU DẠY HỌC
=== 1. Về kiến thức:
- Phát biểu được định luật bảo toàn khối lượng (Lomonosov - Lavoisier).
- Giải thích được trong phản ứng hóa học chỉ có liên kết giữa các nguyên tử thay đổi.
- Trình bày được các bước lập phương trình hóa học và ý nghĩa của hệ số tỉ lệ.

=== 2. Về năng lực:
* a) Năng lực khoa học tự nhiên:
  - Tiến hành thành công thí nghiệm kiểm chứng định luật bảo toàn khối lượng ($BaCl_2 + Na_2SO_4$).
  - Quan sát hiện tượng kết tủa trắng, đọc chỉ số cân thăng bằng trước và sau phản ứng.
* b) Năng lực chung:
  - Tự chủ và tự học: Nghiên cứu SGK và tài liệu thí nghiệm ảo.
  - Giao tiếp và hợp tác: Làm việc nhóm phân công vai trò rõ ràng.

=== 3. Về phẩm chất:
- Trung thực trong ghi nhận số liệu cân khối lượng.
- Trách nhiệm trong việc giữ gìn dụng cụ, bảo đảm an toàn phòng thực hành.

#v(8pt)
== II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
1. Giáo viên: Cân điện tử độ chính xác 0.01g, cốc thủy tinh 100ml, dung dịch $BaCl_2$ 5%, dung dịch $Na_2SO_4$ 5%, phiếu học tập số 1, 2, 3.
2. Học sinh: Bảng nhóm A3, bút dạ, chuẩn bị trước bài đọc SGK KHTN 8.

#v(8pt)
== III. TIẾN TRÌNH DẠY HỌC
=== Hoạt động 1: Mở đầu / Khởi động (7 phút)
- *Mục tiêu:* Tạo mâu thuẫn nhận thức về sự thay đổi khối lượng khi đốt cháy que diêm và nung đá vôi.
- *Nội dung:* HS xem video đốt mẩu than và cân trước/sau.
- *Sản phẩm:* Dự đoán của HS giải thích vì sao khối lượng tro than lại nhẹ hơn khúc gỗ ban đầu.
- *Tổ chức thực hiện:*
  #table(
    columns: (1fr, 1fr),
    inset: 7pt,
    stroke: 0.5pt + rgb("#94a3b8"),
    [*Hoạt động của Giáo viên*], [*Hoạt động của Học sinh*],
    [1. Chiếu video thí nghiệm đốt thanh củi trên đĩa cân.\n2. Đặt câu hỏi: Khối lượng củi ban đầu và tro sau khi cháy có bằng nhau không? Vì sao?],
    [1. Quan sát hiện tượng và ghi nhận số chỉ cân giảm dần.\n2. Tranh luận: Một số HS cho rằng vật chất biến mất; số khác cho rằng có khói khí bay đi.]
  )
`,
  },
  {
    id: 'tpl-stem-modern',
    name: 'Mẫu Giáo án Tích hợp STEM & Trực quan hóa',
    version: 'v3.1 (2025)',
    description: 'Thiết kế hiện đại nhấn mạnh chu trình thiết kế kỹ thuật EDP (Engineering Design Process), sơ đồ tư duy trực quan và bảng tiêu chí Rubric đánh giá sản phẩm STEM.',
    badge: 'Định hướng STEM',
    author: 'Trung tâm Đổi mới Sư phạm',
    previewColor: '#059669',
    isActive: false,
    features: [
      'Quy trình 5 bước STEM chuẩn quốc tế',
      'Khối lệnh Highlight nổi bật cho thí nghiệm & an toàn phòng lab',
      'Tích hợp bảng Rubric chấm điểm hoạt động nhóm & sản phẩm',
      'Định dạng 2 cột trực quan với đồ họa Typst hiện đại',
    ],
    suitableFor: 'Các bài học thực hành, chuyên đề trải nghiệm STEM KHTN',
    typstTemplate: `// Typst Template - Giáo án STEM hiện đại
#set page(paper: "a4", margin: (x: 1.8cm, y: 2cm))
#set text(font: "Plus Jakarta Sans", size: 11pt, lang: "vi")
#text(weight: "bold", size: 16pt, fill: rgb("#047857"))[KẾ HOẠCH BÀI DẠY ĐỊNH HƯỚNG TRẢI NGHIỆM STEM]
`,
  },
  {
    id: 'tpl-bilingual-cambridge',
    name: 'Mẫu Giáo án Song ngữ (Việt - Anh CLIL)',
    version: 'v1.8',
    description: 'Định dạng tích hợp ngôn ngữ và nội dung CLIL (Content and Language Integrated Learning) với bảng đối chiếu thuật ngữ chuyên ngành KHTN.',
    badge: 'Song ngữ CLIL',
    author: 'Tổ Giáo dục Quốc tế',
    previewColor: '#7c3aed',
    isActive: false,
    features: [
      'Bảng thuật ngữ Glossary chuyên sâu Việt - Anh',
      'Khung chỉ tiêu ngôn ngữ (Language Objectives) song song',
      'Trình bày bố cục song ngữ hài hòa',
    ],
    suitableFor: 'Trường chuyên, hệ song ngữ, lớp chất lượng cao',
    typstTemplate: `// Typst Template - Song ngữ CLIL
#set page(paper: "a4", margin: (x: 2cm, y: 2cm))
#set text(font: "Times New Roman", size: 11.5pt)
#align(center)[#text(size: 15pt, weight: "bold")[BILINGUAL LESSON PLAN - KHTN 8]]
`,
  },
];

export const INITIAL_SOURCES_SAMPLE: SourceDocument[] = [
  {
    id: 'src-khtn8-sgk-bai5',
    projectId: 'proj-khtn8-bai5',
    fileName: 'SGK_KHTN_8_KetNoiTriThuc_Bai5_DinhLuatBaoToanKhoiLuong.pdf',
    fileSize: '4.8 MB',
    fileType: 'pdf',
    priority: 'high',
    uploadedAt: '2025-02-28 08:30',
    relevanceScore: 98,
    summary: 'Tài liệu SGK chính khóa Bộ Kết nối tri thức với cuộc sống. Trình bày định luật bảo toàn khối lượng, thí nghiệm dung dịch Bari clorua tác dụng Natri sunfat, bản chất liên kết hóa học và 3 bước lập PTHH.',
    markdownContent: `## TÀI LIỆU NGUỒN: SGK KHTN 8 - BÀI 5 (KẾT NỐI TRI THỨC)
### I. Định luật bảo toàn khối lượng
- **Nội dung định luật:** Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng.
- **Biểu thức toán học:** $m_A + m_B = m_C + m_D$
- **Giải thích vi mô:** Trong phản ứng hóa học, số nguyên tử của mỗi nguyên tố giữ nguyên không đổi, chỉ có liên kết giữa các nguyên tử thay đổi.

### II. Phương trình hóa học
- **Định nghĩa:** Phương trình hóa học biểu diễn ngắn gọn phản ứng hóa học bằng công thức hóa học.
- **Các bước lập phương trình:**
  1. Viết sơ đồ phản ứng gồm công thức hóa học các chất tham gia và sản phẩm.
  2. Cân bằng số nguyên tử của mỗi nguyên tố ở hai vế (tìm hệ số thích hợp đặt trước công thức).
  3. Viết phương trình hóa học hoàn chỉnh.
- **Ý nghĩa:** Cho biết tỉ lệ về số nguyên tử, phân tử giữa các chất cũng như từng cặp chất trong phản ứng.`,
    detectedItems: {
      objectives: [
        'Phát biểu được định luật bảo toàn khối lượng',
        'Viết được biểu thức định luật cho một phản ứng cụ thể',
        'Giải thích được bản chất bảo toàn nguyên tử',
        'Nêu được 3 bước lập phương trình hóa học',
      ],
      activities: [
        'Thí nghiệm kiểm chứng phản ứng giữa dung dịch BaCl2 và Na2SO4',
        'Luyện tập cân bằng phương trình phản ứng đốt Photpho trong khí Oxi',
        'Vận dụng định luật giải thích hiện tượng đốt than và nung đá vôi',
      ],
      exercises: [
        'Bài tập 1 (SGK trang 26): Tính khối lượng khí Oxi phản ứng khi đốt nhôm tạo 10.2g Al2O3',
        'Bài tập 2: Lập PTHH cho phản ứng Fe + Cl2 -> FeCl3',
      ],
      experiments: [
        'Thí nghiệm 1: Cân dung dịch BaCl2 và Na2SO4 trước khi trộn và sau khi tạo kết tủa BaSO4 trắng',
      ],
      imagesAndTables: [
        'Hình 5.1: Sơ đồ thí nghiệm kiểm chứng định luật bảo toàn khối lượng trên đĩa cân',
        'Hình 5.2: Mô hình nguyên tử trước và sau phản ứng giữa H2 và O2 tạo nước',
        'Bảng 5.1: Bảng đối chiếu số nguyên tử ở 2 vế của phản ứng',
      ],
    },
  },
  {
    id: 'src-khtn8-cv5512-guide',
    projectId: 'proj-khtn8-bai5',
    fileName: 'Huong_dan_thuc_hien_CV_5512_KHTN8_MonHoa.docx',
    fileSize: '1.2 MB',
    fileType: 'docx',
    priority: 'high',
    uploadedAt: '2025-02-28 08:31',
    relevanceScore: 95,
    summary: 'Văn bản hướng dẫn cấu trúc Kế hoạch bài dạy (KHBD) theo Công văn 5512/BGDĐT. Quy định cụ thể 4 bước hoạt động dạy học, phương pháp đánh giá năng lực thực nghiệm hóa học và Rubric.',
    markdownContent: `## QUY ĐỊNH CẤU TRÚC KẾ HOẠCH BÀI DẠY (CÔNG VĂN 5512)
### Yêu cầu bắt buộc:
1. **Mục tiêu:** Kiến thức, Năng lực KHTN (nhận thức KHTN, tìm hiểu tự nhiên, vận dụng kiến thức kĩ năng), Phẩm chất (Chăm chỉ, Trung thực, Trách nhiệm).
2. **Thiết bị dạy học và học liệu:** Chi tiết danh mục cho GV và HS.
3. **Tiến trình dạy học:**
   - Hoạt động 1: Xác định vấn đề / Mở đầu / Khởi động
   - Hoạt động 2: Hình thành kiến thức mới / Giải quyết vấn đề / Thực thi nhiệm vụ
   - Hoạt động 3: Luyện tập
   - Hoạt động 4: Vận dụng
4. Mỗi hoạt động phải thể hiện rõ: Mục tiêu, Nội dung, Sản phẩm, Tổ chức thực hiện (Chuyển giao, Thực hiện, Báo cáo thảo luận, Kết luận nhận định).`,
    detectedItems: {
      objectives: [
        'Chuẩn hóa cấu trúc 4 hoạt động sư phạm',
        'Tích hợp đánh giá thường xuyên thông qua phiếu học tập',
      ],
      activities: [
        'Thiết kế chuỗi hoạt động 5512 với ma trận thời gian 45 phút / tiết',
      ],
      exercises: [],
      experiments: ['Quy chuẩn an toàn khi thao tác với hóa chất BaCl2 độc'],
      imagesAndTables: ['Mẫu bảng 2 cột: Hoạt động của GV - Hoạt động của HS'],
    },
  },
  {
    id: 'src-khtn8-slide-bai-giang',
    projectId: 'proj-khtn8-bai5',
    fileName: 'Slide_BaiGiang_DienTu_KHTN8_Bai5_PhanUngHoaHoc.pptx',
    fileSize: '14.5 MB',
    fileType: 'pptx',
    priority: 'medium',
    uploadedAt: '2025-02-28 08:35',
    relevanceScore: 88,
    summary: 'Bài giảng điện tử 28 trang trình chiếu minh họa sinh động các phản ứng, ảnh động mô hình phân tử va chạm, câu hỏi trắc nghiệm tương tác Khởi động và trò chơi "Thử tài cân bằng PTHH".',
    markdownContent: `## NỘI DUNG SLIDE BÀI GIẢNG ĐIỆN TỬ
- Slide 1-4: Trò chơi Khởi động "Đố vui Hóa học quanh ta".
- Slide 5-12: Video quay chậm thí nghiệm phản ứng tạo kết tủa trắng BaSO4.
- Slide 13-18: Ảnh động mô phỏng liên kết giữa 2 phân tử H2 và 1 phân tử O2 bị bẻ gãy rồi tái tổ hợp thành 2 phân tử H2O.
- Slide 19-25: 4 quy tắc vàng khi cân bằng phương trình hóa học.
- Slide 26-28: Trò chơi củng cố Kahoot / Quizizz.`,
    detectedItems: {
      objectives: ['Tăng cường hứng thú và trực quan hóa mô hình vi mô'],
      activities: [
        'Trò chơi tương tác "Thử tài cân bằng nhanh"',
        'Thảo luận nhóm dựa trên mô hình phân tử 3D',
      ],
      exercises: [
        '5 câu hỏi trắc nghiệm củng cố cuối bài',
      ],
      experiments: ['Video mô phỏng ảo phản ứng hóa học'],
      imagesAndTables: ['12 hình ảnh phân tử 3D và sơ đồ tư duy'],
    },
  },
];

export const INITIAL_LESSON_SAMPLE: Lesson = {
  id: 'lesson-khtn8-bai5',
  projectId: 'proj-khtn8-bai5',
  title: 'Bài 5: Định luật bảo toàn khối lượng và phương trình hóa học',
  subject: 'Khoa học tự nhiên',
  grade: 'Lớp 8',
  periods: 3,
  templateId: 'tpl-cv5512-standard',
  updatedAt: '2025-02-28 09:15',
  typstSource: `// File Typst xuất bản kế hoạch bài dạy chuẩn CV 5512
#set page(paper: "a4", margin: (x: 2cm, y: 2cm))
#set text(font: "Times New Roman", size: 12pt, lang: "vi")
#align(center)[#text(size: 14pt, weight: "bold")[KẾ HOẠCH BÀI DẠY: BÀI 5 - ĐỊNH LUẬT BẢO TOÀN KHỐI LƯỢNG]]
`,
  rawMarkdown: `# BÀI 5: ĐỊNH LUẬT BẢO TOÀN KHỐI LƯỢNG VÀ PHƯƠNG TRÌNH HÓA HỌC
**Môn học:** Khoa học tự nhiên 8 (Bộ sách Kết nối tri thức với cuộc sống)
**Thời lượng:** 03 tiết (Tiết 1: Định luật bảo toàn khối lượng; Tiết 2 & 3: Lập phương trình hóa học và luyện tập)

---

## I. MỤC TIÊU DẠY HỌC

### 1. Kiến thức
- Phát biểu được định luật bảo toàn khối lượng (Lomonosov và Lavoisier).
- Giải thích được cơ sở của định luật dựa trên sự bảo toàn nguyên tử trong phản ứng hóa học.
- Trình bày được khái niệm phương trình hóa học và ý nghĩa của các hệ số trong phương trình.
- Nắm vững và thực hiện đúng 3 bước lập phương trình hóa học.

### 2. Năng lực
**a) Năng lực khoa học tự nhiên:**
- *Nhận thức KHTN:* Nêu được công thức định luật $m_A + m_B = m_C + m_D$; tính được khối lượng của một chất khi biết khối lượng của các chất còn lại.
- *Tìm hiểu tự nhiên:* Thực hiện an toàn thí nghiệm phản ứng giữa dung dịch Barium chloride ($BaCl_2$) và Sodium sulfate ($Na_2SO_4$); quan sát, đọc chính xác số liệu trên cân điện tử trước và sau phản ứng.
- *Vận dụng kiến thức, kĩ năng:* Lập được phương trình hóa học cho các phản ứng quen thuộc trong đời sống (quang hợp, gỉ sét sắt, đốt nhiên liệu).

**b) Năng lực chung:**
- *Tự chủ và tự học:* Tự nghiên cứu thông tin SGK, chuẩn bị dụng cụ học tập theo yêu cầu.
- *Giao tiếp và hợp tác:* Phân công nhiệm vụ nhóm rõ ràng, cùng nhau thao tác thí nghiệm và thảo luận kết quả.
- *Giải quyết vấn đề và sáng tạo:* Xử lý các tình huống cân bằng phương trình có phân số hoặc nhóm nguyên tử.

### 3. Phẩm chất
- *Chăm chỉ:* Tích cực tham gia các hoạt động học tập, không ngại thử thách khi cân bằng PTHH phức tạp.
- *Trung thực:* Ghi nhận trung thực kết quả cân khối lượng trong thí nghiệm thực hành.
- *Trách nhiệm:* Giữ gìn an toàn phòng thí nghiệm, dọn dẹp hóa chất và rác thải đúng quy định.

---

## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU

### 1. Giáo viên chuẩn bị:
- Cân điện tử có độ nhạy 0.01g (4 bộ cho 4 nhóm).
- Ống nghiệm, cốc thủy tinh 100 mL, kẹp gỗ, ống hút nhỏ giọt.
- Hóa chất: Dung dịch $BaCl_2$ 5%, Dung dịch $Na_2SO_4$ 5%.
- Phiếu học tập số 1 (Khám phá định luật), Phiếu học tập số 2 (Lập PTHH), Phiếu số 3 (Vận dụng).
- Máy chiếu, bài giảng trình chiếu điện tử, video mô phỏng vi mô phản ứng.

### 2. Học sinh chuẩn bị:
- Sách giáo khoa KHTN 8, vở ghi bài, bút chì, bảng nhóm A3 và bút dạ.
- Xem trước bài 5 và chuẩn bị các thắc mắc về sự biến đổi khối lượng khi đốt cháy vật thể.

---

## III. TIẾN TRÌNH DẠY HỌC

### Hoạt động 1: Mở đầu / Khởi động (7 phút)
**a) Mục tiêu:** Kích thích tư duy, tạo mâu thuẫn nhận thức về sự thay đổi khối lượng trong biến đổi hóa học.
**b) Nội dung:** HS quan sát hình ảnh/video thanh củi cháy thành tro than hoặc đinh sắt bị gỉ tăng khối lượng.
**c) Sản phẩm:** Câu trả lời dự đoán của học sinh ghi trên bảng KWL.
**d) Tổ chức thực hiện:**
- *Chuyển giao nhiệm vụ:* GV đưa ra câu hỏi: *"Khi đốt một que diêm hay thanh củi, ta thấy lượng tro còn lại nhẹ hơn thanh củi rất nhiều. Vậy có phải vật chất đã biến mất không?"*
- *Thực hiện nhiệm vụ:* HS suy nghĩ cá nhân trong 1 phút, sau đó thảo luận nhanh với bạn cùng bàn.
- *Báo cáo, thảo luận:* Đại diện 2 HS phát biểu ý kiến:
  - HS 1: Cho rằng vật chất bị tiêu hao do nhiệt độ.
  - HS 2: Cho rằng có khói và khí bay vào không khí.
- *Kết luận, nhận định:* GV không vội kết luận đúng sai, dẫn dắt vào bài học để cùng kiểm chứng bằng thực nghiệm khoa học.

---

### Hoạt động 2: Hình thành kiến thức mới (65 phút)

#### Hoạt động 2.1: Khám phá Định luật bảo toàn khối lượng (25 phút)
- **Mục tiêu:** Thực hiện thí nghiệm, đọc kết quả cân, rút ra kết luận định luật.
- **Nội dung:** HS làm thí nghiệm theo nhóm: Trộn dung dịch $BaCl_2$ và $Na_2SO_4$ trên đĩa cân điện tử.
- **Sản phẩm:** Kết quả ghi vào Phiếu học tập số 1: Hiện tượng xuất hiện kết tủa trắng ($BaSO_4$), chỉ số cân trước phản ứng = chỉ số cân sau phản ứng.
- **Tổ chức thực hiện:**
  - GV hướng dẫn an toàn hóa chất và thao tác cân chuẩn xác.
  - Các nhóm tiến hành thí nghiệm: Đặt 2 cốc dung dịch lên cân -> ghi khối lượng $m_1$ -> đổ cốc 1 vào cốc 2 -> quan sát hiện tượng kết tủa -> ghi khối lượng $m_2$.
  - HS đối chiếu $m_1$ và $m_2$, nhận xét: Khối lượng tổng thể không đổi.
  - GV giới thiệu lịch sử phát minh của Lomonosov (1748) và Lavoisier (1789).
  - HS rút ra định luật và viết công thức toán học: $m_{\\text{chất tham gia}} = m_{\\text{chất sản phẩm}}$.

#### Hoạt động 2.2: Giải thích định luật dưới góc độ vi mô (15 phút)
- **Mục tiêu:** Hiểu bản chất bảo toàn số lượng nguyên tử.
- **Nội dung:** Quan sát mô hình động phản ứng giữa khí Hydro và Oxi tạo nước ($2H_2 + O_2 \\rightarrow 2H_2O$).
- **Sản phẩm:** Câu trả lời: Số nguyên tử H (4) và O (2) trước và sau phản ứng là không đổi, chỉ có liên kết phân tử thay đổi.
- **Tổ chức thực hiện:** GV chiếu mô hình 3D, HS đếm số nguyên tử ở 2 vế và thảo luận nhóm đôi.

#### Hoạt động 2.3: Các bước lập phương trình hóa học (25 phút)
- **Mục tiêu:** Nắm vững 3 bước lập PTHH và cách đặt hệ số cân bằng.
- **Nội dung:** Hướng dẫn lập PTHH cho phản ứng Phosphor cháy trong Oxi ($P + O_2 \\rightarrow P_2O_5$) và Nhôm tác dụng Axit ($Al + HCl \\rightarrow AlCl_3 + H_2$).
- **Sản phẩm:** Bảng các bước lập PTHH hoàn chỉnh trong vở.
- **Tổ chức thực hiện:**
  - Bước 1: Viết sơ đồ phản ứng dạng CTHH.
  - Bước 2: Cân bằng số nguyên tử của từng nguyên tố (bắt đầu từ nguyên tố có số nguyên tử lẻ lớn nhất, hoặc phi kim khác H và O).
  - Bước 3: Viết PTHH chính thức với mũi tên liền nét.
  - *Lưu ý quan trọng:* Không thay đổi chỉ số chân trong công thức hóa học, chỉ được thêm hệ số phía trước.

---

### Hoạt động 3: Luyện tập (35 phút)
**a) Mục tiêu:** Củng cố kĩ năng áp dụng định luật tính toán khối lượng và cân bằng thành thạo các PTHH cơ bản.
**b) Nội dung:** Làm bài tập trên Phiếu học tập số 2 theo hình thức trò chơi tiếp sức nhóm:
  - Bài 1: Nung 100g đá vôi ($CaCO_3$) thu được 56g vôi sống ($CaO$) và khí Carbon dioxide ($CO_2$). Tính khối lượng khí $CO_2$ thoát ra.
  - Bài 2: Cân bằng 5 phương trình hóa học:
    1. $Fe + O_2 \\rightarrow Fe_3O_4$
    2. $Na + H_2O \\rightarrow NaOH + H_2$
    3. $Mg + HCl \\rightarrow MgCl_2 + H_2$
    4. $Al + CuCl_2 \\rightarrow AlCl_3 + Cu$
    5. $CH_4 + O_2 \\rightarrow CO_2 + H_2O$
**c) Sản phẩm:** Bảng đáp án bài tập của các nhóm được đính trên bảng lớp.
**d) Tổ chức thực hiện:**
- GV chia lớp thành 4 đội chơi "Tiếp sức cân bằng".
- Đại diện từng bạn luân phiên lên bảng ghi hệ số.
- Cả lớp nhận xét, GV chốt điểm và sửa các lỗi sai phổ biến (viết sai chỉ số, quên nhân hệ số).

---

### Hoạt động 4: Vận dụng và Mở rộng (15 phút)
**a) Mục tiêu:** Vận dụng định luật giải thích các hiện tượng thực tế trong đời sống và sản xuất.
**b) Nội dung:** Giải quyết 2 bài toán thực tiễn:
  - Tình huống 1: Giải thích tại sao khi nung một thanh sắt trong không khí thì thanh sắt tăng khối lượng, nhưng khi nung cục than thì khối lượng lại giảm?
  - Tình huống 2: Ứng dụng phương trình hóa học để tính lượng vôi tôi cần dùng trong xử lý chua đất trồng lúa ở địa phương.
**c) Sản phẩm:** Bản báo cáo ngắn gọn của học sinh nộp vào buổi học sau.
**d) Tổ chức thực hiện:** GV giao nhiệm vụ về nhà, hướng dẫn học sinh tìm hiểu tài liệu địa phương và làm việc theo nhóm 2 bạn.

---

## IV. HỒ SƠ DẠY HỌC & ĐÁNH GIÁ

### 1. Phiếu học tập số 1 (Thí nghiệm kiểm chứng)
- Tên nhóm: ....................................... Lớp: 8A...
- Khối lượng hệ trước phản ứng ($m_1$): ............ gam.
- Hiện tượng quan sát được: ................................................................
- Khối lượng hệ sau phản ứng ($m_2$): .............. gam.
- Nhận xét so sánh $m_1$ và $m_2$: ..........................................................

### 2. Rubric đánh giá năng lực thực hành thí nghiệm KHTN:
- **Mức 1 (Đạt yêu cầu - 5-6đ):** Thao tác đúng quy trình nhưng còn lúng túng, cân đọc sai lệch nhẹ.
- **Mức 2 (Khá - 7-8đ):** Thao tác chuẩn xác, an toàn, ghi chép số liệu đầy đủ và đúng định dạng.
- **Mức 3 (Tốt - 9-10đ):** Thao tác khéo léo, hỗ trợ đồng đội tốt, phân tích kết quả sâu sắc và vệ sinh phòng lab sạch sẽ.`,
  sections: [
    {
      id: 'sec-objectives',
      title: 'I. Mục tiêu dạy học (Chuẩn CV 5512)',
      type: 'objectives',
      content: `### 1. Kiến thức
- Phát biểu được định luật bảo toàn khối lượng (Lomonosov và Lavoisier).
- Giải thích được cơ sở của định luật dựa trên sự bảo toàn nguyên tử trong phản ứng hóa học.
- Trình bày được khái niệm phương trình hóa học và ý nghĩa của các hệ số trong phương trình.
- Nắm vững và thực hiện đúng 3 bước lập phương trình hóa học.

### 2. Năng lực
**a) Năng lực khoa học tự nhiên:**
- *Nhận thức KHTN:* Nêu được công thức định luật $m_A + m_B = m_C + m_D$; tính được khối lượng của một chất khi biết khối lượng của các chất còn lại.
- *Tìm hiểu tự nhiên:* Thực hiện an toàn thí nghiệm phản ứng giữa dung dịch Barium chloride ($BaCl_2$) và Sodium sulfate ($Na_2SO_4$); quan sát, đọc chính xác số liệu trên cân điện tử trước và sau phản ứng.
- *Vận dụng kiến thức, kĩ năng:* Lập được phương trình hóa học cho các phản ứng quen thuộc trong đời sống.

**b) Năng lực chung:**
- *Tự chủ và tự học:* Tự nghiên cứu thông tin SGK, chuẩn bị dụng cụ học tập theo yêu cầu.
- *Giao tiếp và hợp tác:* Phân công nhiệm vụ nhóm rõ ràng, cùng nhau thao tác thí nghiệm và thảo luận kết quả.
- *Giải quyết vấn đề và sáng tạo:* Xử lý các tình huống cân bằng phương trình có phân số hoặc nhóm nguyên tử.

### 3. Phẩm chất
- *Chăm chỉ:* Tích cực tham gia các hoạt động học tập.
- *Trung thực:* Ghi nhận trung thực kết quả cân khối lượng trong thí nghiệm thực hành.
- *Trách nhiệm:* Giữ gìn an toàn phòng thí nghiệm, dọn dẹp hóa chất và rác thải đúng quy định.`,
      isLocked: true,
      order: 1,
    },
    {
      id: 'sec-equipment',
      title: 'II. Thiết bị dạy học và học liệu',
      type: 'equipment',
      content: `### 1. Giáo viên chuẩn bị:
- Cân điện tử có độ nhạy 0.01g (4 bộ cho 4 nhóm).
- Ống nghiệm, cốc thủy tinh 100 mL, kẹp gỗ, ống hút nhỏ giọt.
- Hóa chất: Dung dịch $BaCl_2$ 5%, Dung dịch $Na_2SO_4$ 5%.
- Phiếu học tập số 1 (Khám phá định luật), Phiếu học tập số 2 (Lập PTHH), Phiếu số 3 (Vận dụng).
- Máy chiếu, bài giảng trình chiếu điện tử, video mô phỏng vi mô phản ứng.

### 2. Học sinh chuẩn bị:
- Sách giáo khoa KHTN 8, vở ghi bài, bút chì, bảng nhóm A3 và bút dạ.
- Xem trước bài 5 và chuẩn bị các thắc mắc về sự biến đổi khối lượng khi đốt cháy vật thể.`,
      isLocked: false,
      order: 2,
    },
    {
      id: 'sec-warmup',
      title: 'III. Tiến trình dạy học - Hoạt động 1: Mở đầu / Khởi động',
      type: 'activity_warmup',
      durationMinutes: 7,
      content: `**a) Mục tiêu:** Kích thích tư duy, tạo mâu thuẫn nhận thức về sự thay đổi khối lượng trong biến đổi hóa học.
**b) Nội dung:** HS quan sát hình ảnh/video thanh củi cháy thành tro than hoặc đinh sắt bị gỉ tăng khối lượng.
**c) Sản phẩm:** Câu trả lời dự đoán của học sinh ghi trên bảng KWL.
**d) Tổ chức thực hiện:**
- *Chuyển giao nhiệm vụ:* GV đưa ra câu hỏi: *"Khi đốt một que diêm hay thanh củi, ta thấy lượng tro còn lại nhẹ hơn thanh củi rất nhiều. Vậy có phải vật chất đã biến mất không?"*
- *Thực hiện nhiệm vụ:* HS suy nghĩ cá nhân trong 1 phút, sau đó thảo luận nhanh với bạn cùng bàn.
- *Báo cáo, thảo luận:* Đại diện 2 HS phát biểu ý kiến.
- *Kết luận, nhận định:* GV không vội kết luận đúng sai, dẫn dắt vào bài học để cùng kiểm chứng bằng thực nghiệm khoa học.`,
      isLocked: false,
      order: 3,
    },
    {
      id: 'sec-knowledge',
      title: 'III. Tiến trình dạy học - Hoạt động 2: Hình thành kiến thức mới',
      type: 'activity_knowledge',
      durationMinutes: 65,
      content: `#### Hoạt động 2.1: Khám phá Định luật bảo toàn khối lượng (25 phút)
- **Mục tiêu:** Thực hiện thí nghiệm, đọc kết quả cân, rút ra kết luận định luật.
- **Nội dung:** HS làm thí nghiệm theo nhóm: Trộn dung dịch $BaCl_2$ và $Na_2SO_4$ trên đĩa cân điện tử.
- **Sản phẩm:** Kết quả ghi vào Phiếu học tập số 1: Hiện tượng xuất hiện kết tủa trắng ($BaSO_4$), chỉ số cân trước phản ứng = chỉ số cân sau phản ứng.
- **Tổ chức thực hiện:**
  - GV hướng dẫn an toàn hóa chất và thao tác cân chuẩn xác.
  - Các nhóm tiến hành thí nghiệm: Đặt 2 cốc dung dịch lên cân -> ghi khối lượng $m_1$ -> đổ cốc 1 vào cốc 2 -> quan sát hiện tượng kết tủa -> ghi khối lượng $m_2$.
  - HS đối chiếu $m_1$ và $m_2$, nhận xét: Khối lượng tổng thể không đổi.
  - GV giới thiệu lịch sử phát minh của Lomonosov (1748) và Lavoisier (1789).
  - HS rút ra định luật và viết công thức toán học: $m_{\\text{chất tham gia}} = m_{\\text{chất sản phẩm}}$.

#### Hoạt động 2.2: Giải thích định luật dưới góc độ vi mô (15 phút)
- **Mục tiêu:** Hiểu bản chất bảo toàn số lượng nguyên tử.
- **Nội dung:** Quan sát mô hình động phản ứng giữa khí Hydro và Oxi tạo nước ($2H_2 + O_2 \\rightarrow 2H_2O$).
- **Sản phẩm:** Câu trả lời: Số nguyên tử H (4) và O (2) trước và sau phản ứng là không đổi, chỉ có liên kết phân tử thay đổi.

#### Hoạt động 2.3: Các bước lập phương trình hóa học (25 phút)
- **Mục tiêu:** Nắm vững 3 bước lập PTHH và cách đặt hệ số cân bằng.
- **Nội dung:** Hướng dẫn lập PTHH cho phản ứng Phosphor cháy trong Oxi ($P + O_2 \\rightarrow P_2O_5$).
- **Sản phẩm:** Bảng các bước lập PTHH hoàn chỉnh trong vở.
- **Tổ chức thực hiện:**
  - Bước 1: Viết sơ đồ phản ứng dạng CTHH.
  - Bước 2: Cân bằng số nguyên tử của từng nguyên tố.
  - Bước 3: Viết PTHH chính thức với mũi tên liền nét.`,
      isLocked: false,
      order: 4,
    },
    {
      id: 'sec-practice',
      title: 'III. Tiến trình dạy học - Hoạt động 3: Luyện tập',
      type: 'activity_practice',
      durationMinutes: 35,
      content: `**a) Mục tiêu:** Củng cố kĩ năng áp dụng định luật tính toán khối lượng và cân bằng thành thạo các PTHH cơ bản.
**b) Nội dung:** Làm bài tập trên Phiếu học tập số 2 theo hình thức trò chơi tiếp sức nhóm:
  - Bài 1: Nung 100g đá vôi ($CaCO_3$) thu được 56g vôi sống ($CaO$) và khí Carbon dioxide ($CO_2$). Tính khối lượng khí $CO_2$ thoát ra.
  - Bài 2: Cân bằng 5 phương trình hóa học:
    1. $Fe + O_2 \\rightarrow Fe_3O_4$
    2. $Na + H_2O \\rightarrow NaOH + H_2$
    3. $Mg + HCl \\rightarrow MgCl_2 + H_2$
    4. $Al + CuCl_2 \\rightarrow AlCl_3 + Cu$
    5. $CH_4 + O_2 \\rightarrow CO_2 + H_2O$
**c) Sản phẩm:** Bảng đáp án bài tập của các nhóm được đính trên bảng lớp.
**d) Tổ chức thực hiện:**
- GV chia lớp thành 4 đội chơi "Tiếp sức cân bằng".
- Đại diện từng bạn luân phiên lên bảng ghi hệ số.
- Cả lớp nhận xét, GV chốt điểm và sửa các lỗi sai phổ biến.`,
      isLocked: false,
      order: 5,
    },
    {
      id: 'sec-application',
      title: 'III. Tiến trình dạy học - Hoạt động 4: Vận dụng và Mở rộng',
      type: 'activity_application',
      durationMinutes: 15,
      content: `**a) Mục tiêu:** Vận dụng định luật giải thích các hiện tượng thực tế trong đời sống và sản xuất.
**b) Nội dung:** Giải quyết 2 bài toán thực tiễn:
  - Tình huống 1: Giải thích tại sao khi nung một thanh sắt trong không khí thì thanh sắt tăng khối lượng, nhưng khi nung cục than thì khối lượng lại giảm?
  - Tình huống 2: Ứng dụng phương trình hóa học để tính lượng vôi tôi cần dùng trong xử lý chua đất trồng lúa ở địa phương.
**c) Sản phẩm:** Bản báo cáo ngắn gọn của học sinh nộp vào buổi học sau.
**d) Tổ chức thực hiện:** GV giao nhiệm vụ về nhà, hướng dẫn học sinh tìm hiểu tài liệu địa phương và làm việc theo nhóm 2 bạn.`,
      isLocked: false,
      order: 6,
    },
    {
      id: 'sec-rubric',
      title: 'IV. Hồ sơ dạy học & Thang đo Rubric đánh giá',
      type: 'rubric',
      content: `### 1. Phiếu học tập số 1 (Thí nghiệm kiểm chứng)
- Tên nhóm: ....................................... Lớp: 8A...
- Khối lượng hệ trước phản ứng ($m_1$): ............ gam.
- Hiện tượng quan sát được: ................................................................
- Khối lượng hệ sau phản ứng ($m_2$): .............. gam.
- Nhận xét so sánh $m_1$ và $m_2$: ..........................................................

### 2. Rubric đánh giá năng lực thực hành thí nghiệm KHTN:
- **Mức 1 (Đạt yêu cầu - 5-6đ):** Thao tác đúng quy trình nhưng còn lúng túng, cân đọc sai lệch nhẹ.
- **Mức 2 (Khá - 7-8đ):** Thao tác chuẩn xác, an toàn, ghi chép số liệu đầy đủ và đúng định dạng.
- **Mức 3 (Tốt - 9-10đ):** Thao tác khéo léo, hỗ trợ đồng đội tốt, phân tích kết quả sâu sắc và vệ sinh phòng lab sạch sẽ.`,
      isLocked: true,
      order: 7,
    },
  ],
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-khtn8-bai5',
    title: 'Kế hoạch bài dạy Bài 5: Định luật bảo toàn khối lượng và phương trình hóa học',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    periods: 3,
    learningOutcomes: 'Phát biểu định luật bảo toàn khối lượng, giải thích bản chất nguyên tử, tiến hành thí nghiệm kiểm chứng, lập thành thạo 3 bước phương trình hóa học.',
    additionalNotes: 'Bộ sách Kết nối tri thức với cuộc sống. Chú trọng thí nghiệm an toàn phòng thực hành và thang đo rubric đánh giá năng lực thực nghiệm.',
    status: 'completed',
    createdAt: '2025-02-28 08:30',
    updatedAt: '2025-02-28 09:30',
    sourceCount: 3,
    templateId: 'tpl-cv5512-standard',
    progressPercentage: 100,
    currentStageName: 'Đã hoàn thành xuất bản Typst/PDF',
    schoolName: 'THCS Nguyễn Du',
    teacherName: 'ThS. Nguyễn Hoàng Lan',
  },
  {
    id: 'proj-khtn8-bai15',
    title: 'Kế hoạch bài dạy Bài 15: Lực đẩy Ác-si-mét (Archimedes)',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    periods: 2,
    learningOutcomes: 'Nhận biết tác dụng của chất lỏng lên vật nhúng trong nó, phát biểu công thức lực đẩy Ác-si-mét F_A = d.V, làm thí nghiệm đo độ lớn lực đẩy.',
    additionalNotes: 'Tích hợp dự án STEM chế tạo thuyền mini chở hàng cân bằng tải trọng.',
    status: 'reviewing',
    createdAt: '2025-02-27 14:10',
    updatedAt: '2025-02-27 15:45',
    sourceCount: 2,
    templateId: 'tpl-stem-modern',
    progressPercentage: 78,
    currentStageName: 'Đang thẩm định sư phạm',
    schoolName: 'THCS Chu Văn An',
    teacherName: 'Thầy Lê Minh Trí',
  },
  {
    id: 'proj-khtn8-bai8',
    title: 'Kế hoạch bài dạy Bài 8: Acid và Thang đo pH',
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 8',
    periods: 2,
    learningOutcomes: 'Nêu khái niệm Acid, tính chất hóa học chung, sử dụng giấy chỉ thị màu đo pH của các dung dịch thường gặp trong đời sống như giấm, nước chanh, xà phòng.',
    additionalNotes: 'Cần phân bổ thời gian hợp lý cho thí nghiệm đổi màu chất chỉ thị thiên nhiên từ bắp cải tím.',
    status: 'analyzing',
    createdAt: '2025-02-26 10:00',
    updatedAt: '2025-02-26 10:15',
    sourceCount: 4,
    templateId: 'tpl-cv5512-standard',
    progressPercentage: 35,
    currentStageName: 'Đang phân tích tài liệu nguồn',
    schoolName: 'THCS Lê Quý Đôn',
    teacherName: 'Cô Trần Thu Hà',
  },
];

export const INITIAL_REVIEW_ISSUES_SAMPLE: ReviewIssue[] = [
  {
    id: 'iss-1',
    projectId: 'proj-khtn8-bai5',
    severity: 'success',
    category: 'objectives',
    title: 'Mục tiêu dạy học chuẩn theo khung năng lực CV 5512',
    description: 'Kế hoạch đã bao phủ đầy đủ 3 thành tố: Kiến thức cốt lõi, Năng lực KHTN đặc thù (Nhận thức, Tìm hiểu, Vận dụng) và 3 Phẩm chất đạo đức trung thực, trách nhiệm.',
    suggestedFix: 'Không cần điều chỉnh thêm. Đã đạt độ chuẩn hóa sư phạm cao.',
    sectionId: 'sec-objectives',
    sectionTitle: 'I. Mục tiêu dạy học',
    isResolved: true,
  },
  {
    id: 'iss-2',
    projectId: 'proj-khtn8-bai5',
    severity: 'warning',
    category: 'duration',
    title: 'Thời lượng phân bổ cho Hoạt động 2 (Khám phá) khá dày đặc',
    description: 'Hoạt động 2 kéo dài 65 phút với 3 tiểu mục (Thí nghiệm $BaCl_2$, Mô hình vi mô, Lập PTHH). Có nguy cơ cháy giáo án nếu học sinh thao tác cân chậm.',
    suggestedFix: 'Khuyến nghị: Chuyển một phần bài tập cân bằng phương trình ở tiểu mục 2.3 sang phần Luyện tập hoặc chuẩn bị sẵn mẫu bảng cân cho từng nhóm.',
    sectionId: 'sec-knowledge',
    sectionTitle: 'III. Tiến trình dạy học - Hoạt động 2',
    isResolved: false,
  },
  {
    id: 'iss-3',
    projectId: 'proj-khtn8-bai5',
    severity: 'error',
    category: 'alignment',
    title: 'Cảnh báo an toàn hóa chất với Barium Chloride (BaCl2)',
    description: 'Dung dịch muối Bari ($BaCl_2$) có độc tính trung bình, nhưng trong phần Thiết bị dạy học chưa có ghi chú về việc thu gom dung dịch thải sau thí nghiệm.',
    suggestedFix: 'Bổ sung ngay vào mục Thiết bị: "Bình chứa thu gom chất thải vô cơ có dán nhãn để xử lý an toàn, găng tay y tế cho học sinh".',
    sectionId: 'sec-equipment',
    sectionTitle: 'II. Thiết bị dạy học và học liệu',
    isResolved: false,
  },
  {
    id: 'iss-4',
    projectId: 'proj-khtn8-bai5',
    severity: 'warning',
    category: 'pedagogy',
    title: 'Cần bổ sung tiêu chí phân hóa cho học sinh khá giỏi ở phần Luyện tập',
    description: 'Các bài tập cân bằng phương trình hiện tại chủ yếu là đơn chất và hợp chất đơn giản. Chưa có phương trình chứa nhóm nguyên tử như $Al(OH)_3 + H_2SO_4$.',
    suggestedFix: 'Thêm 01 câu hỏi phân hóa nâng cao vào Phiếu học tập số 2 dành cho nhóm hoàn thành sớm.',
    sectionId: 'sec-practice',
    sectionTitle: 'III. Tiến trình dạy học - Hoạt động 3',
    isResolved: false,
  },
  {
    id: 'iss-5',
    projectId: 'proj-khtn8-bai5',
    severity: 'success',
    category: 'activities',
    title: 'Hoạt động Vận dụng gắn liền với thực tiễn sản xuất nông nghiệp',
    description: 'Câu hỏi giải thích thanh sắt gỉ và tính toán lượng vôi tôi xử lý đất chua rất sát với đời sống thực tế của học sinh nông thôn và thành thị.',
    suggestedFix: 'Đã hoàn thiện xuất sắc theo định hướng phát triển phẩm chất năng lực.',
    sectionId: 'sec-application',
    sectionTitle: 'III. Tiến trình dạy học - Hoạt động 4',
    isResolved: true,
  },
];

export const INITIAL_JOB_SAMPLE: Job = {
  id: 'job-proj-khtn8-bai5',
  projectId: 'proj-khtn8-bai5',
  status: 'completed',
  progressPercentage: 100,
  currentStepIndex: 7,
  totalSteps: 7,
  currentStageName: 'Đã hoàn tất quy trình biên soạn và render PDF',
  createdAt: '2025-02-28 08:31:00',
  updatedAt: '2025-02-28 08:33:15',
  agentMetadata: {
    modelUsed: 'Gemini 2.5 Pro Pedagogical Reasoner',
    tokensProcessed: 14850,
    reasoningSteps: 42,
    confidenceScore: 0.98,
    activeAgents: [
      'DocumentParserAgent',
      'CurriculumAlignmentAgent',
      'LessonSynthesizerAgent',
      'CV5512ValidatorAgent',
      'TypstRenderEngine',
    ],
  },
  logs: [
    {
      id: 'log-1',
      timestamp: '08:31:02',
      stage: 'uploaded',
      type: 'info',
      message: 'Tiếp nhận 3 tài liệu nguồn thành công (PDF, DOCX, PPTX). Tổng dung lượng: 20.5 MB.',
      details: 'MD5 checksums verified. Extracted OCR layers from SGK PDF.',
    },
    {
      id: 'log-2',
      timestamp: '08:31:15',
      stage: 'converting',
      type: 'info',
      message: 'Chuyển đổi đa định dạng sang Markdown có cấu trúc chuẩn.',
      details: 'Đã xử lý 4 bảng biểu hóa học, 6 công thức toán $BaCl_2 + Na_2SO_4$, trích xuất 12 hình ảnh minh họa.',
    },
    {
      id: 'log-3',
      timestamp: '08:31:38',
      stage: 'analyzing',
      type: 'agent',
      message: 'AI Agent phân tích đối chiếu chuẩn chương trình GDPT 2018 môn KHTN 8.',
      details: 'Khớp 4 yêu cầu cần đạt (YCCĐ). Trích xuất 3 thí nghiệm trọng tâm và phân bổ ma trận thời gian 120 phút.',
    },
    {
      id: 'log-4',
      timestamp: '08:32:00',
      stage: 'planning',
      type: 'agent',
      message: 'Xây dựng dàn ý chi tiết 4 hoạt động theo khung Công văn 5512/BGDĐT.',
      details: 'Hoạt động Khởi động (7p) -> Hoạt động Khám phá (65p) -> Luyện tập (35p) -> Vận dụng (15p).',
    },
    {
      id: 'log-5',
      timestamp: '08:32:35',
      stage: 'writing',
      type: 'agent',
      message: 'Biên soạn nội dung chi tiết từng hoạt động dạy học, phiếu học tập và bảng rubric.',
      details: 'Tạo bảng phân vai Giáo viên - Học sinh, thiết lập câu hỏi định hướng tư duy phân tích vi mô.',
    },
    {
      id: 'log-6',
      timestamp: '08:32:55',
      stage: 'reviewing',
      type: 'agent',
      message: 'Chuyên gia thẩm định sư phạm tự động kiểm duyệt độ tương thích và an toàn thí nghiệm.',
      details: 'Kiểm tra 5 tiêu chí: Mục tiêu, Thời lượng, An toàn hóa chất BaCl2, Ma trận câu hỏi, Rubric đánh giá.',
    },
    {
      id: 'log-7',
      timestamp: '08:33:15',
      stage: 'rendering',
      type: 'success',
      message: 'Biên dịch mã nguồn Typst sang tài liệu in ấn PDF chất lượng cao (300 DPI).',
      details: 'Typst 0.12.0 engine completed in 312ms. Generated 6 trang A4 chuẩn format Bộ GD&ĐT.',
    },
  ],
};
