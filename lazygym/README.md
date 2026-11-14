# LazyGym

Ứng dụng tập gym chạy trên trình duyệt, tối ưu cho iPhone. Lười cũng được: app lo phần nhớ và tính toán.

**Mở app:** https://phillipxnguyen.github.io/wikiPhidia/lazygym/

## Cài lên iPhone

1. Mở link trên bằng **Safari**.
2. Bấm **Chia sẻ** → **Thêm vào MH chính** → **Thêm**.
3. Mở từ biểu tượng LazyGym trên màn hình chính. App chạy toàn màn hình, dùng được cả khi mất mạng.

## Tính năng

- **Giáo án tự tạo** theo mục tiêu, kinh nghiệm, số buổi mỗi tuần và dụng cụ (phòng gym, tạ đơn, không dụng cụ). Có sẵn giáo án VIFIT 4 buổi.
- **Tự tăng tạ:** làm đủ mọi set ở mức rep cao nhất thì buổi sau tăng tạ. Hụt rep 2 buổi liền thì giảm khoảng 10%.
- **Tự bù khi hụt mục tiêu:** buổi trước thiếu set thì buổi sau cộng thêm (tối đa 4). Hôm qua thiếu bước chân thì hôm nay mục tiêu tăng thêm.
- **Hỏi cảm giác:** trước buổi tập (Mệt / Bình thường / Sung sức) và sau buổi tập (độ khó). App chỉnh số set theo câu trả lời.
- **Chu kỳ 4 tuần:** 3 tuần tăng dần, tuần thứ 4 deload.
- **Lỡ buổi không mất bài:** lịch dời sang ngày tập kế tiếp, giữ đúng thứ tự giáo án.
- **Khi tập:** ghi set một chạm, đồng hồ nghỉ tự chạy, xem kết quả lần trước, tính bánh tạ cần lắp mỗi bên, đổi bài khi máy bận.
- **Ăn uống:** calo và macro (Katch-McArdle hoặc Mifflin-St Jeor), ngày tập ăn nhiều hơn ngày nghỉ, ghi nhanh món Việt. Mỗi thứ Hai calo tự chỉnh theo xu hướng cân nặng.
- **Tiến bộ:** khối lượng nâng theo tuần, biểu đồ cân nặng, kỷ lục 1RM ước tính, check-in tuần.
- **Học:** 9 bài học ngắn và thư viện 52 bài tập có hướng dẫn và lỗi thường gặp. Có điểm kinh nghiệm (XP) và 6 cấp từ Tân binh tới Chuyên nghiệp.

## Dữ liệu

Mọi dữ liệu nằm trong trình duyệt của máy đang dùng, không gửi lên máy chủ nào. Vào **Hồ sơ → Tải bản sao lưu** mỗi tuần. Khi đổi máy, dùng **Khôi phục** để nạp lại file sao lưu.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `index.html` | Toàn bộ app (HTML, CSS, JS) |
| `sw.js` | Service worker để chạy offline |
| `manifest.webmanifest` | Thông tin cài đặt lên màn hình chính |
| `icon.svg`, `icon-*.png`, `apple-touch-icon.png` | Biểu tượng app |

Khi sửa `index.html` hoặc thêm file, tăng số trong `CACHE` ở `sw.js` (ví dụ `lazygym-v2`) để máy người dùng tải bản mới.
