# Mục lục phiên bản

Mỗi phần của app có một **mã**. Mỗi phiên bản của phần đó có mã riêng, gắn với một commit trong lịch sử git; code của phiên bản ấy nằm nguyên trong commit đó. Muốn lấy lại phiên bản nào thì gọi mã của nó, ví dụ: "lấy lại FLASH-1", "dùng POD-5 nhưng giữ phím của POD-9", "so sánh THEATER-4 với THEATER-12".

- **V1** = `961cf80` (5/11): bản cuối cùng **trước 2.0**. Mọi mã có đuôi `-1` là phần đó ở V1, trừ những phần chỉ có từ 2.0 trở đi (Podcast, theater, focus, đồng hồ, hiệu ứng toàn màn hình): với các phần này, `-1` là bản đầu tiên của chúng.
- **Hiện tại** = commit mới nhất trên `main`.

Cột "Hàm chính" là tên hàm hoặc hằng trong `index.html`. Tên không đổi giữa các phiên bản, trừ khi có ghi chú.

---

## Học câu (Lessons)

### LISTEN: Listening (thẻ nghe câu video)
| Mã | Commit | Là gì |
|---|---|---|
| LISTEN-1 | `961cf80` | Bản V1: thẻ nghe, phát clip, Show, Again/Good, list transcript và popup chi tiết |
| LISTEN-2 | `901658b` | Bỏ nút vào mode; câu video không còn tính New/Due |
| LISTEN-3 | `fc25c6d` | Câu video tính lại New/Due/Done (học ở theater); thẻ cũ chỉ còn trong task |
| LISTEN-4 | `326581f` | Task cũng học câu video ở theater (chấm hết câu thì sang từ, ✕ là rời task); bỏ code thẻ nghe trong task |
| LISTEN-5 | `8c5952b` | Xoá hẳn code thẻ nghe Listening cũ (khung video + câu, lớp che sóng âm, batch, thanh cuộn riêng); Speaking không đổi |

Hàm chính: `isListenMode`, `listenBatch`, `startSequenceLoop`, `stopSequenceLoop`, `startLoop`, `toggleLoopForRow`, `segmentReached`, `seamTo`, `render`, `gradeCard`, `applyGrade`, `cardInMode`, `modeScopeRows`, `lessonStudyMode`.

### SPEAK: Speaking (tờ đề)
| Mã | Commit | Là gì |
|---|---|---|
| SPEAK-1 | `961cf80` | Tờ đề có gáy và dòng kẻ, Hint rồi Show |
| SPEAK-2 | `407f09e` | Trong focus: tờ mờ kính, không gáy, không dòng kẻ |
| SPEAK-3 | `3f33aa9` | Chỉ câu + notes; bỏ Hint; mặt trước tự đổi: câu khoét một từ hoặc chỉ từ khoá để nhớ cả câu |
| SPEAK-4 | `4fe949e` | Hiển thị như SPEAK-2 (câu hỏi, Hint, Show câu trả lời); dạng khoét từ / từ khoá chỉ cho câu đơn không có `/câu hỏi` |
| SPEAK-5 | `f9e5447` | Chỗ trống rộng đúng bằng từ, Show chỉ hiện từ vào chỗ trống, không gì xê dịch |
| SPEAK-6 | `1acf767` | Chỗ trống là gạch chân mảnh bình thường (2 px, nhạt), không còn thanh dày bo tròn |
| SPEAK-7 | `cc9a4dd` | Trong focus vẫn là tờ giấy có gáy và dòng kẻ như cũ (bỏ tờ mờ kính) |
| SPEAK-8 | `71d9610` | Sổ còng luôn ít nhất 2 còng (tờ Speaking, sổ ☰ Full, tờ Today) |
| SPEAK-9 | `b62d155` | Chưa Show thì ← →, Return, nút Again/Good đều Show (Hint) trước, lần sau mới chấm |

Hàm chính: `ieltsPaperHtml`, `ieltsFrontHtml`, `sentenceEx`, `sentenceKeyWord`, `entryHidden`, `revealAction`, `render` (nhánh `groupViewStyle === "ielts"`). Cùng `ieltsHints`, `ieltsHintNext`, `ieltsHintId` (Hint).

### FULL: ☰ Full / ☰ List (danh sách thẻ)
| Mã | Commit | Là gì |
|---|---|---|
| FULL-1 | `961cf80` | Danh sách thẻ, sửa trong popup, vuốt xoá có bóng thiên thần |
| FULL-2 | `c18533e` | 🌐 hiện bản dịch dưới mỗi câu chưa có câu trả lời (của notes hoặc máy dịch) |
| FULL-3 | `cd20830` | Bản dịch là dòng đầu của notes, cùng kiểu chữ, màu xanh câu trả lời |
| FULL-4 | `128c757` | Bản dịch thẳng lề câu, cách đều 8px trên dưới |
| FULL-5 | `0ab30de` | Thanh của list bỏ nút phát YouTube và tốc độ, chỉ còn đếm và 🌐 |
| FULL-6 | `de95b47` | Khoảng trên/dưới mỗi dòng bằng nhau (12px, điện thoại 10px) |
| FULL-7 | `263aa9b` | Khoảng cách đều: trên/dưới mỗi dòng như nhau, câu → dịch → notes → list từ cách đều, thẳng lề trái với câu |

Hàm chính: `render`, `openEdit`, `openEditPopup`, `deleteRow`, `deleteRows`, `selectRow`, `clearRowSelection`, `updateSelBar`.

### THEATER: Màn hình YouTube
| Mã | Commit | Là gì |
|---|---|---|
| THEATER-1 | `519f494` | Bản thử kiểu Language Reactor: dòng dưới video, thanh công tắc |
| THEATER-2 | `c029ea3` | Bố cục như trang YouTube: list bên trái, video bên phải |
| THEATER-3 | `8ca564e` | Sân khấu pixel-art |
| THEATER-4 | `919c4b2` | Sân khấu kiểu thường: phong cảnh dịu, khung mờ kính |
| THEATER-5 | `798a262` | Thanh chỉ có icon; A S D; dải tốc độ đầy đủ; vòng trên mốc thời gian |
| THEATER-6 | `391466a` | Sửa trong popup, pinyin từng chữ, hover từ, ✎ mỗi dòng, blur, lặp 1/2/3 |
| THEATER-7 | `8aeddd0` | Nút dịch chỉ khi có bản dịch; Loop bật/tắt; thẻ hover nhỏ |
| THEATER-8 | `ec87315` | Đủ rule mode học: lookup, E/Delete/W/⌘C, chọn câu trên điện thoại |
| THEATER-9 | `931a9a1` | Chỉ để xem: không toolbar, thanh phụ đề kéo được, AP |
| THEATER-10 | `d7529d5` | Phụ đề kiểu LR: không nền; ‹ ↻ › bên trái; AP và ↕ bên phải |
| THEATER-11 | `fc25c6d` | Có lại thanh học: New/Due/Done, Again/Good |
| THEATER-12 | `6c036a1` | List là bài học: chỉ câu cần học, chấm xong bay ra |
| THEATER-13 | `a577e49` | Che giao diện YouTube, nền phụ đề, Loop/Blur, Enter chấm, undo về chỗ cũ |
| THEATER-14 | `231e50f` | Mỗi câu là thẻ (lookup, E/Delete/⌘C, Shift); điện thoại chấm bằng thanh đáy |
| THEATER-15 | `ef5c3e9` | AP xuống thanh dưới; pinyin một dòng riêng trên câu; công tắc bật tô đặc, hover chỉ viền |
| THEATER-16 | `d0a1d9b` | Trang bài YouTube lại là list dưới video to; theater thành mode học trong focus (nút tròn), thanh trên chung, khung sáng |
| THEATER-17 | `5c96a13` | Dịch máy khi câu chưa có bản dịch (Aa, mặc định tắt); chế độ dịch cabin: hiện bản dịch, che câu gốc, V để mở |
| THEATER-18 | `914c1a6` | Dịch cabin bằng tai: máy đọc bản dịch (không hiện chữ), V mở và phát câu gốc |
| THEATER-19 | `adac075` | Video co theo chiều cao cửa sổ, thanh dưới luôn thấy |
| THEATER-20 | `e360770` | Máy tính như YouTube: công tắc lên thanh trên, video to hết cỡ, list cao bằng video, căn giữa |
| THEATER-21 | `0f925e0` | Công tắc thành biểu tượng; cabin học như thường: mặt trước máy đọc bản dịch, Show phát câu YouTube, chấm để sang câu |
| THEATER-22 | `128179a` | Tốc độ dùng chung danh sách của app: 1x, 1.25x, 1.5x, 1.75x, 2x |
| THEATER-23 | `e66c962` | Đủ rule mode học: Delete/⌘C cho câu đang học, thanh chép/xoá luôn có trên điện thoại, xoá xong sang câu kế |
| THEATER-24 | `c18533e` | Bản dịch tải sẵn khi mở bài, bật là hiện ngay |
| THEATER-25 | `da9358e` | Che nút ▶ mặc định của YouTube khi dừng bằng nút ▶ của app |
| THEATER-26 | `e91ef83` | Bỏ nút che; sang câu kế chỉ phát tiếp, không tua lại khi video đã đứng đúng chỗ (không tải lại) |
| THEATER-27 | `5be7a60` | Dùng lại trình phát đã tải của trang bài (chuyển vào không tải lại), nhảy câu phát ngay như list |
| THEATER-28 | `8849ce4` | Giao diện tối kiểu trang học video: hàng nút dưới video (công tắc, ◀ ▶ ▶|, lặp), câu dưới hàng nút, list tối bên phải |
| THEATER-29 | `abc1ae4` | Vừa một màn hình, nút gọn không chồng, list không nền, bấm công tắc tức thì (không vẽ lại list) |
| THEATER-30 | `128c757` | Mốc thời gian nằm đầu dòng chữ, chữ chảy xuống dưới (như list) |
| THEATER-31 | `da72c88` | Câu dưới hàng nút hiện đủ, không thanh cuộn; cabin làm mờ video tới khi Show (như Listening cũ) |
| THEATER-32 | `de95b47` | Câu lại nằm trên video; công tắc logic với nhau; list chữ đều, câu đang phát rõ, mốc ở dòng pinyin, bỏ nền vàng |
| THEATER-33 | `12512ba` | Câu đang phát luôn có trong list (câu chưa tới hạn hiện mờ); điện thoại không có list |
| THEATER-34 | `4c0bd1b` | Điện thoại: chỉ một hàng công tắc, phát/Show/chấm ở thanh đáy chung |
| THEATER-35 | `ac7eddc` | Chữ trên video to hơn, ô cỡ chữ 100/125/150% |
| THEATER-36 | `3f267a2` | Space = S = nút ▶: Show / dừng / phát lại câu, không tự sang câu; bỏ nút ↻; giãn dòng đồng nhất |
| THEATER-37 | `e3f8f8c` | Undo/redo về đúng câu cũ; câu đã chấm/xoá không hiện lại trong list; câu trên video thao tác như câu học (không play/pause) |
| THEATER-38 | `e3f8f8c` | Điện thoại: video hiện trọn, công tắc ẩn, chạm video mới hiện (4 giây) |
| THEATER-39 | `412375f` | Interpreting/AP dừng cuối câu không nhảy sang câu sau; bỏ nút ‹ ▶ ›; điện thoại: video sát trên, câu giữa khoảng còn lại |
| THEATER-40 | `adcb8b7` | Điện thoại: chạm 2 lần vào câu trên video mở khung sửa |
| THEATER-41 | `bf607d0` | Mở là tự phát câu đầu cần học (interpreting: đọc bản dịch); lệnh dừng trễ của trang bài không dừng theater nữa |
| THEATER-42 | `a5ddea2` | Phím tắt: E mở sửa với con trỏ trong câu (Return lưu ngay); công tắc/tốc độ không giữ bàn phím nữa |
| THEATER-43 | `b578a92` | Hàng công tắc căn giữa dưới video; ô cỡ chữ trên điện thoại không cắt chữ |
| THEATER-44 | `90a4621` | Công tắc Interpreter / Watch ở thanh trên; mở luôn là Interpreter: video to, ẩn list, chỉ còn 拼, cỡ chữ, tốc độ; bỏ nút 🎧 |
| THEATER-45 | `47a4813` | Công tắc Interpreter / Watch dùng icon (🎧 và màn hình + list), tên hiện khi trỏ chuột |
| THEATER-46 | `863ac6c` | Hàng nút dưới video cách đều video và mép dưới; tay nắm ↕ kéo câu lên xuống (nhớ vị trí); bấm câu mở ô sửa; Interpreter: A = Again, D = Good |
| THEATER-47 | `e9be2a3` | Interpreter: chưa Show thì mọi phím/nút chấm (A, D, ← →, Return, nút điện thoại) đều Show trước, lần sau mới chấm |
| THEATER-48 | `bba0a99` | Từ kiểu Reactor: pinyin trên từng từ, rê sáng cả từ + pinyin kèm nghĩa, bấm từ để thêm; R nghe lại; nút sound + speed trên thanh trên có vòng; xoá có nhát chém, câu sau ẩn |
| THEATER-49 | `fd11ef1` | Xoá chém đôi cả màn hình như mọi mode; nút sound giật tia sét khi chờ tiếng; bỏ tay nắm, kéo câu từ mép trái/phải video |
| THEATER-50 | `44a73bc` | Luật học như mọi mode: đếm theo giới hạn ngày, câu ẩn không lookup, đã Show thì lặp, đổi mode về mặt trước; 🌐 ở Interpreter; câu cách mép 8%; ô sửa giữa màn hình nền tối; nút sound đồng bộ ⏸ |
| THEATER-51 | `80128d9` | Điện thoại: câu căn giữa video và ô copy/✕ khi ô đó hiện; câu dịch lặp hai lần (phụ đề tách đôi) chỉ viết một lần |
| THEATER-52 | `31ff949` | Interpreter trên máy tính: video full màn, thanh trên và hàng nút nổi trên video |
| THEATER-53 | `86a7bf3` | Interpreter: YouTube phủ kín màn, không dải đen hai bên; bấm từ mở popup từ điển; Esc trong popup không đóng theater |
| THEATER-54 | `cebda15` | Interpreter: hàng nút gom trong một khung tối, cách câu và mép dưới bằng nhau; câu không kéo xuống dưới hàng nút (hay lên dưới thanh trên); kéo câu bằng hai mép của chính thanh câu |
| THEATER-55 | `a46cc82` | Mép kéo thanh câu: dải sáng mờ dần vào trong ở hai mép (như mép mờ khi cuộn), thay viền cứng |
| THEATER-56 | `0a92bb6` | Đếm: dòng Again tính vào ⏳ tới khi quay lại; ô của dòng đang học luôn sáng sau mỗi lần chấm (trước bị tắt xen kẽ) |
| THEATER-57 | `d0dfb12` | Interpreter: chưa Show mà bật 🌐 thì thanh chỉ hiện câu dịch (bỏ khối mờ), Show thì câu gốc hiện trên |
| THEATER-58 | `7b097cc` | Câu dịch trong hộp tối riêng ôm sát chữ như phụ đề YouTube, chữ nhỏ hơn câu gốc 2 px ở mọi cỡ (cả phone) |
| THEATER-59 | `4b95902` | Mặt trước: câu gốc vẫn hiện mờ tại chỗ cũ, câu dịch hộp riêng ngay dưới (bỏ kiểu chỉ còn câu dịch của THEATER-57) |
| THEATER-60 | `adf7c9a` | Dòng Again luôn quay lại cuối hàng, không bị chèn lên đầu khi bộ đếm đổi |
| THEATER-61 | `a09ce83` | Chấm/xoá dùng đúng hiệu ứng chung (đóng dấu ✓/✕ trượt, chém đôi) chỉ trên thanh câu, video thật vẫn chạy; viền mờ khớp góc từng hộp; thanh câu mỗi lần mở về dưới |
| THEATER-62 | `9fab495` | Cửa sổ hẹp trên máy tính giữ bố cục máy tính (video phủ, câu đè, chữ nhỏ lại); Watch giữ danh sách dưới video; nút ✕ không mất; kiểu điện thoại chỉ cho máy cảm ứng |
| THEATER-63 | `8ac06e3` | Vuốt trên điện thoại: thanh câu chạy theo ngón tay, phải = Good, trái = Again, câu ẩn thì Show trước; popup streak không còn nuốt thao tác chạm (mọi mode) |
| THEATER-64 | `59a5528` | Ô sửa dòng video có Q/A như mọi ô (Q đổi màu, A là câu dịch hiện ở theater); vuốt chỉ chấm khi đã Show ở mọi mode |
| THEATER-65 | `4346d3a` | Chấm xong dòng mới hiện mờ ngay trong lúc dòng cũ trượt đi, không chờ hiệu ứng |
| THEATER-66 | `5a7e278` | Câu dịch nhỏ hơn câu gốc 5 px ở mọi cỡ (máy tính, cửa sổ hẹp, phone) |

Hàm chính: `openWatch`, `closeWatch`, `syncTheater`, `paintWatch`, `watchPrefChanged`, `syncWatchPills`, `paintWatchList`, `paintWatchLine`, `paintWatchCounts`, `watchQueueSync`, `watchTick`, `watchSeek`, `watchDelete`, `watchArm`, `watchGrade`, `watchToggle`, `pinyinLine`, `watchLineHtml`, `watchLineTr`, `mtFill`, `preloadTranslations`, `rowTr`, `cabinSay`, `cabinReveal`, `watchTranslation`, `watchPrefs`, `leaveTheater`, `theaterWanted`, `theaterScene`, `THEATER_SCENES`.

---

## Học từ (Vocabulary)

### FLASH: Flashcard
| Mã | Commit | Là gì |
|---|---|---|
| FLASH-1 | `961cf80` | Thẻ lật 3D hai mặt (V1) |
| FLASH-2 | `16a2b79` | Không khung, không lật; 15 kiểu trình bày có chữ trang trí (báo, note, chat…) |
| FLASH-3 | `149e839` | Chữ to hơn; nút ở đáy màn hình cả trên máy tính |
| FLASH-4 | `e229a04` | Không chữ trang trí; mặt trước là đồ vật vẽ (biển, cốc, bóng bay…); font ngẫu nhiên khoảng 55 kiểu |
| FLASH-5 | `71aff22` | Chỉ font dễ đọc; font riêng cho chữ Latin và chữ châu Á |
| FLASH-6 | `a73c2d6` | Khoảng một nửa số lần, mặt trước là câu của từ với từ đó bị khoét thành chỗ trống |
| FLASH-7 | `a467d7c` | 4 kiểu mặt trước ngẫu nhiên: chỉ từ (tự đặt câu), câu khoét từ, cụm từ kết hợp khoét từ, câu bài khác khoét từ |
| FLASH-8 | `345b333` | Thẻ có chỗ trống không đổi mặt: Show điền từ vào chỗ trống và thêm nghĩa, notes ngay dưới |
| FLASH-9 | `4fbb485` | Không nhảy khi Show: chỗ trống rộng đúng bằng từ, chỗ của nghĩa giữ sẵn (ẩn) |
| FLASH-10 | `2334974` | Bỏ kiểu cụm từ (cắt câu, …): câu luôn hiện đủ |
| FLASH-11 | `298b2dd` | Câu từ thế giới (Tatoeba, Wikipedia) cho mặt trước khoét từ, lấy trực tuyến từng từ, giữ ít trong trình duyệt |
| FLASH-12 | `682fb3a` | Câu thế giới không giới hạn: mỗi lần một câu chưa gặp, hết thì lấy trang tiếp; mặt trước câu thế giới ra nhiều hơn |
| FLASH-13 | `f9e5447` | Câu thế giới tương tác như câu thường (tra từ, bôi đen, Shift tạo từ kèm câu đó); cỡ chữ bằng câu khoét từ |
| FLASH-14 | `e63c4d7` | Câu thế giới đúng kiểu chữ của bài (giản thể hoặc phồn thể, không lẫn) |
| FLASH-15 | `0be97d4` | Câu thế giới ngắn, dễ trước (trừ điểm số, ngoặc, ngày tháng); thiếu câu ngắn thì lục thêm trang |
| FLASH-16 | `aa2c3d6` | Một kiểu mặt trước: câu khoét từ từ kho chung (câu gốc, bài khác, Tatoeba, Wikipedia, ví dụ Google); bỏ kiểu chỉ từ; notes khối riêng khi Show |
| FLASH-17 | `032d080` | Show: từ làm chữ chính (pinyin trên đỉnh, nghĩa dưới) trên câu, như Podcast; chỗ giữ sẵn, không nhảy |
| FLASH-18 | `69bd6b4` | Bỏ thanh cuộn xanh bên thẻ và kiểu trình bày có dấu ngoặc kép |
| FLASH-19 | `d2ecc93` | Bỏ mọi khung/đồ vật (biển, cốc, giấy note, bảng…), không nghiêng: chữ trên nền màu như Podcast |
| FLASH-20 | `7a65374` | Mặt trước "nghe": cảnh động của Podcast + đọc riêng từ (khoảng 1/3 thẻ); Show như thường, cùng chỗ |
| FLASH-21 | `3d664c3` | Notes không lặp câu ví dụ đã lưu; chữ tự thu nhỏ cho vừa màn, thẻ không cuộn |
| FLASH-22 | `eec36a0` | Pinyin câu khi Show (như Podcast); rê chuột ra pinyin, tra từ trên câu; thẻ vừa khít màn, trang không cuộn |
| FLASH-23 | `28ea965` | Câu + notes một khối căn giữa, thẳng lề trái (từ chính vẫn căn giữa); bỏ gạch ngang; khoảng cách đều |
| FLASH-24 | `0d97ce3` | Mặt trước chỉ có câu, căn giữa; không giữ chỗ cho mặt sau nữa |
| FLASH-25 | `097877f` | Show: câu thế giới đi kèm câu gốc của từ; nút loa đọc đúng các câu đang hiện |
| FLASH-26 | `2694b69` | Câu gốc YouTube phát clip thật sau câu thế giới (lỗi thì đọc), có mốc giờ bấm nghe lại; ô sửa có đủ câu gốc |
| FLASH-27 | `2f9ce91` | Khoảng cách đều giữa từ, câu, câu gốc, notes (theo cỡ chữ thẻ) |
| FLASH-28 | `a3e9ca1` | Hàng nút kiểu Podcast cả trên máy tính; thẻ nghe Show không còn khoảng trống; click ra ngoài khung sửa từ là lưu |
| FLASH-29 | `f43aa2a` | Cảnh nào của thẻ nghe cũng có chuyển động (thêm sóng tin nhắn, đèn bộ đàm, sọc TV, micro) |
| FLASH-30 | `0798d15` | Bỏ đèn sáng/tắt và sọc TV trôi; tin nhắn, bộ đàm, TV chỉ nhấp nhô nhẹ |
| FLASH-31 | `86a52b8` | Cỡ chữ câu trung bình (32–40 px, phone 22–26); chỉ thu nhỏ khi thật sự không vừa màn, tối thiểu 24/20 px |
| FLASH-32 | `6e8c088` | Mọi câu tiếng Trung ở mặt sau đều có pinyin viết sẵn (cả notes); bỏ pinyin khi rê chuột ở thẻ |
| FLASH-33 | `2248a51` | Thêm nguồn câu: Leipzig, Wiktionary, Wikiquote, Wikisource, Wikinews, Free Dictionary, Hacker News, Reddit |
| FLASH-34 | `2248a51` | Mặt sau chỉ 4 cỡ chữ: pinyin, từ chính, nghĩa, mọi câu |
| FLASH-35 | `1acf767` | Chỗ trống flashcard cũng gạch chân mảnh như Speaking |
| FLASH-36 | `cc9a4dd` | Thẻ nghe đọc một câu ngẫu nhiên của thẻ (giọng đọc hoặc clip YouTube), có thanh chạy như Podcast |
| FLASH-37 | `bc52269` | Câu YouTube hiện trọn dòng như clip phát; lặp âm thanh: câu đọc rồi clip rồi lại từ đầu; nghĩa không dính sát từ (khoảng theo cỡ chữ) |
| FLASH-38 | `26a1cb8` | Pinyin của từ chính kiểu ruby: từng âm nằm sát trên từng chữ |
| FLASH-39 | `197a1c6` | Câu gốc chỉ tô vàng từ đang học (từ khác chỉ đổi màu chữ); hiragana kiểu ruby cho từ tiếng Nhật |
| FLASH-40 | `8064cf8` | Nghĩa to hơn câu 4 px; các khối câu chung line-height 1.4 cho khoảng cách nhìn đều; ⌘C copy đủ các câu đang hiện |
| FLASH-41 | `32271f0` | Gọn lại như trước: line-height 1.25, khoảng giữa các khối 0,6 cỡ chữ |
| FLASH-42 | `7826755` | Thẻ là cả câu dịch (A → B) luôn ra mặt Podcast: cảnh động, đọc cả câu; Show hiện câu và nghĩa |
| FLASH-43 | `5b0a629` | Mỗi câu trên flashcard có pill phát: giờ (YouTube) hoặc ▶/⏸; vòng chạy trên pill của câu đang phát |
| FLASH-44 | `b62d155` | Chưa lật thì ← →, Return, nút Again/Good đều lật trước, lần sau mới chấm |
| FLASH-45 | `5f66b6a` | Pill của mọi câu nằm đầu dòng pinyin (không có pinyin thì đầu dòng chữ), không đứng riêng một dòng |
| FLASH-46 | `8873df2` | Pinyin trên notes chỉ cho phần chữ Hán, không tách chữ Việt/Anh |
| FLASH-47 | `d8b20e4` | Mặt sau: câu gốc của từ lên trên câu thế giới/bài khác |
| FLASH-48 | `563502d` | Mặt trước không tô màu lookup các từ đã có, chỉ hiện sau khi lật |
| FLASH-49 | `f6831ed` | Bỏ FLASH-47: câu ở mặt trước luôn ở trên cùng khi lật, các câu khác ở dưới |
| FLASH-50 | `1260029` | Câu, nghĩa, notes, pinyin luôn 4 màu khác họ nhau (không xanh lá/xanh dương) |
| FLASH-51 | `e17599b` | Mặt trước chỉ có Podcast hoặc đục lỗ: từ không đục được luôn ra Podcast, không hiện chữ |
| FLASH-52 | `76fd44b` | Podcast đầu tiên khi trình duyệt chặn tiếng: nút sound giật chờ, chạm đầu tiên là phát |
| FLASH-53 | `5f98cc4` | Bỏ câu thế giới (Tatoeba, Wikipedia, Reddit…): flashcard chỉ dùng câu gốc và câu trong các bài khác của bạn |
| FLASH-54 | `91183ba` | Vocabulary gom theo ngôn ngữ: trang chủ ô ngôn ngữ + banner (lấy giao diện Tests), bấm một ngôn ngữ học mọi từ của nó từ mọi bài |
| FLASH-55 | `4182897` | Trang Vocabulary lấy lại toàn bộ giao diện Tests cho học từ: lộ trình 7 bước, banner, tự tạo buổi học, Waiting for you, Results theo ngày, By lesson, Words to work on |
| FLASH-56 | `2b9ee73` | Buổi học chọn sẵn xong không chạy lại từ đầu; buổi có từ đã bị xoá tự rời Waiting for you |
| FLASH-57 | `263aa9b` | Ô sửa từ có câu gốc (sửa là sửa thẻ ở mọi nơi); ✕ khi học một ngôn ngữ ra list từ của ngôn ngữ đó; list từ đều lề |
| FLASH-58 | `7d308b7` | Ô sửa từ về lại 2 box: box chính là câu gốc có từ tô màu + nghĩa dòng dưới, rồi Notes |
| FLASH-59 | `266b0f1` | Nút ☰ Word list trên banner Vocabulary mở list từ của ngôn ngữ |
| FLASH-60 | `53fb529` | List từ có banner màu ngôn ngữ: ‹ Vocabulary để quay về, số đếm dạng chip, Study, Weak words |
| FLASH-61 | `0ce61a7` | Giới hạn mỗi ngày tính theo ngôn ngữ khi học Vocabulary (không còn x số bài); nút Study đếm theo giới hạn |
| FLASH-62 | `6c7e86d` | Box chính ô sửa từ 3 tầng: từ đậm, nghĩa xanh, câu dưới vạch kẻ (nhãn Sentence, từ nền vàng); câu trong popup cũng tô vàng |
| FLASH-63 | `bba5fa8` | Bỏ vạch kẻ và nhãn Sentence trên câu trong ô sửa từ |
| FLASH-64 | `c51a339` | Box chính ô sửa từ cân đối: chữ cách 4 mép 14px, từ/nghĩa/câu cách đều 8px |
| FLASH-65 | `7b82c37` | Ô sửa từ: từ và nghĩa sát nhau thành một cặp, câu cách ra 14px bên dưới |
| FLASH-66 | `d18b8de` | Ô sửa từ: nghĩa cách từ như một dòng thường (6px), không dính sát; câu cách 14px |
| FLASH-67 | `396ae7f` | Box chính ô sửa từ dùng đúng thông số box Notes: chữ 22/30, lề 9/14/9/16, các dòng nối tiếp không khoảng thêm |
| FLASH-68 | `d89f669` | Ô sửa từ: xuống dòng ở nghĩa = thêm nghĩa (lưu bằng dấu phẩy, hiện mỗi nghĩa một dòng) |
| FLASH-69 | `330101e` | Ô sửa từ = thẻ popup: từ to + loa, nghĩa xanh, Notes nền xám, chip từ điển (bấm thêm nghĩa), câu gốc tô vàng |
| FLASH-70 | `8d03895` | Sửa từ trong buổi chọn sẵn không nhảy thẻ; flashcard hiện mỗi nghĩa một dòng; ô sửa từ hiện câu lưu kèm từ; bỏ dấu cách đầu dòng nghĩa mới |

Hàm chính: `buildVocabCard`, `fillVocabCard`, `otherLessonSentence`, `fetchWorld`, `worldSentences`, `worldFits`, `vocabBackInner`, `flipVocab`, `flyVocab`, `gradeVocab`, `settleVocabCard`, `showVocabDeck`, `fitVocabCards`, `CARD_LOOKS`, `cardType`, `TYPE_LATIN`, `TYPE_CJK`.

### POD: Podcast (nghe từ)
| Mã | Commit | Là gì |
|---|---|---|
| POD-1 | `bb624f3` | "Listen blind": nghe mù các câu của từ, mỗi lần một cảnh |
| POD-2 | `226deff` | Tên Podcast, 16 cảnh |
| POD-3 | `c4a564e` | Vuốt và phím mũi tên để chấm, undo/redo, E sửa, thanh thời gian |
| POD-4 | `2d9fe9f` | Dùng nút học chung: undo, redo, ▶/■, Show, Again/Good |
| POD-5 | `7b9b5c1` | Trang 3 phần: ✕ trên, nút cố định dưới, cảnh và đáp án ở giữa |
| POD-6 | `5960a85` | Mặt trước và mặt sau như nhau (chỗ đáp án giữ sẵn), không chuyển động khi Show |
| POD-7 | `ec87315` | Đủ rule: lookup, Delete/W/⌘C, Shift thêm từ, thanh chọn trên điện thoại |
| POD-8 | `21fa119` | Mặt trước chỉ có cảnh (to); mặt sau chỉ có chữ (to); tiến độ thành vòng trên nút âm thanh |
| POD-9 | `ea6c79f` | New/Due/Done trên đỉnh; nguyên câu YouTube; giãn khoảng cách |
| POD-10 | `d9ce2a9` | Mặt sau giống flashcard: 28px, highlight vàng, mốc thời gian mỗi câu |
| POD-11 | `0cb743b` | Từ và nghĩa cùng một dòng; mỗi câu một khối có nền |
| POD-12 | `b59ff4f` | Từ to và nghĩa to; câu không nền; highlight màu cảnh, căn khít chữ |
| POD-13 | `ef5c3e9` | Chọn trước, học sau: từ tự tìm chưa chọn hiện ngay, ✕ xoá / ✓ học, 🧺 đếm; 字 mở Podcast ở mọi bài; pinyin một dòng riêng |
| POD-14 | `af6d193` | Bỏ bước chọn: một cách học cho mọi từ (Show, Good/Again, 🗑 xoá); hình động lại, chấm tròn và thanh thời lượng; task học mọi từ bằng Podcast |
| POD-15 | `bb0fca5` | Thanh trên như mọi mode (cờ, New/Due/Done, ✕ chung) |
| POD-16 | `d0a1d9b` | Podcast có cả bên Lessons; bỏ nút 🗑 (Delete và ✕ của thanh chọn vẫn xoá) |
| POD-17 | `2334974` | Hình động nhẹ, chậm, không nháy (bỏ nháy sao, đèn, TV nhiễu, ▶) |
| POD-18 | `298b2dd` | Thêm một câu từ thế giới vào các câu được đọc |
| POD-19 | `128c757` | Mốc thời gian nằm đầu dòng chữ ở mặt sau |
| POD-20 | `682fb3a` | Hai câu thế giới khác nhau mỗi lần |
| POD-21 | `6521eb2` | Chỉ còn ở Vocabulary; mặt trước đọc từ (giọng tự nhiên nhất có), Show mới phát các câu; bỏ chấm tròn |
| POD-22 | `98ac5ec` | Luân phiên các giọng tốt (Natural của Edge…) cho mỗi từ, mỗi câu |
| POD-23 | `7a65374` | Bỏ chế độ Podcast (nút 🎧, trong task); mặt trước của nó thành một kiểu flashcard |
| POD-24 | `a171f78` | Dọn hết code chế độ Podcast cũ; chỉ giữ các cảnh động cho mặt trước nghe của flashcard |
| POD-25 | `16e64b0` | Mọi vật trong cảnh Podcast đều chuyển động nhẹ, chậm (dù+cột, cây+thân, mây, chim, TV, đèn, sao, sóng âm, cốc) |
| POD-26 | `2161393` | Cảnh cuộc gọi cân đối: hai nút đỏ/xanh tỏa vòng thay phiên, cùng cỡ; avatar vòng nhẹ ở giữa |

Hàm chính: `openBlind`, `closeBlind`, `blindItems`, `blindAutoItems`, `blindLines`, `blindNext`, `paintBlind`, `paintBlindLive`, `blindPlay`, `blindPlayOne`, `blindPlayLine`, `blindPlayer`, `blindSpeak`, `blindGrade`, `blindUndo`, `blindEdit`, `blindAct`, `blindFly`, `blindArt`, `blindSceneFor`, `blindCountsHtml`, `withLeadTime`, `blindTime`, `BLIND_SCENES`.

### WORDS: Words list (từ theo tần suất)
| Mã | Commit | Là gì |
|---|---|---|
| WORDS-1 | `961cf80` | Cửa sổ Words: dải tần suất, câu của từ, xoá/ẩn từ, bóng thiên thần |

Hàm chính: `openWords`, `closeWords`, `wordPopHtml`, `wordAct`, `hideWord`, `wordFly`.

---

## Chung


### DICT: Từ điển riêng trong ô sửa thẻ
| Mã | Commit | Là gì |
|---|---|---|
| DICT-1 | `961cf80` | Trang từ điển ngoài nhúng vào (chinesedictionary.mobi, Bing) |
| DICT-2 | `b554aef` | Từ điển riêng: từ của câu, pinyin, nghĩa Google, bỏ từ thông dụng và sọt rác, ＋ thêm vào notes |
| DICT-3 | `7ead1be` | Thiết kế lại: câu ở đầu (gạch chân từ mới, bấm nhảy tới), thẻ từ: pinyin màu thanh điệu, 🔊, nghĩa theo loại từ, nút Add, khung chờ nhấp nháy |
| DICT-4 | `682fb3a` | Hai câu ví dụ “In the world” dưới mỗi từ mới |
| DICT-5 | `31c7331` | Lọc mảnh chỉ gồm từ thường (你有), Delete xoá từ gợi ý, Shift lưu từ đang trỏ |
| DICT-6 | `be77efc` | Từ đã có ở bất kỳ bài nào không đề xuất lại; trong câu tô xanh lá (đã có), thẻ nền xanh nhạt |
| DICT-7 | `3d5d9b9` | Xoá một lần là mất hẳn ở mọi bài, không đề xuất lại (bỏ luật 3 lần); không ô nào tự đặt con trỏ khi mở |
| DICT-8 | `b9932c5` | Delete/Shift liên tục không cần nhúc nhích chuột (mọi list); từ vừa Add chuyển xuống Already yours |
| DICT-9 | `f9e5447` | Khung sửa từ bỏ câu phía trên, dùng câu thế giới khi đang hiện; Save bên phải ở mọi khung sửa |
| DICT-10 | `d7cebf9` | Bỏ mục gập Already in your words: hiện đủ mọi từ (trừ từ đã xoá), chưa tạo trước rồi đã tạo, theo thứ tự câu |
| DICT-11 | `6dd45a6` | Từ đã có gọn một dòng; bỏ In the world; từ đã xoá nền đỏ trong câu, bôi đen + Shift để học lại (tạo tay luôn bỏ ẩn) |
| DICT-12 | `a717735` | Bỏ dòng đếm từ; giữ câu ví dụ thế giới dưới mỗi từ, chỉ bỏ nhãn In the world |
| DICT-13 | `e63c4d7` | Từ đã có hai dòng: từ + pinyin, rồi nghĩa |
| DICT-14 | `31984d2` | Thẻ từ mới cũng hai dòng: từ + pinyin + 🔊, rồi nghĩa |
| DICT-15 | `c7d0edf` | Bấm từ đỏ (đã xoá) là mở ô học lại; bỏ con trỏ dấu ? ở mọi chỗ |
| DICT-16 | `6fe4717` | Lại ba dòng cân đối: từ + 🔊, pinyin, nghĩa (từ dài không đẩy 🔊 xuống) |
| DICT-17 | `032d080` | Delete/Shift tức thì: lấy thẻ dưới chuột lúc bấm (cả sau khi cuộn), thẻ đi ngay |
| DICT-18 | `eec36a0` | Ô sửa thẻ: từ điển đọc mọi câu đang hiện; câu đầu từ điển không còn lặp chữ |
| DICT-19 | `a3e9ca1` | Từ tiếng Anh khác đuôi (passports/passport) chỉ hiện một lần |
| DICT-20 | `5111240` | Câu đầu từ điển bỏ gạch chân; tạo từ xong: từ nảy xanh, dòng notes sáng lên, báo đã thêm |
| DICT-21 | `197a1c6` | Bỏ đường kẻ dưới câu đầu từ điển; click ra ngoài khung sửa từ đóng được cả sau khi Add |
| DICT-22 | `321567a` | Khoảng cách câu–thẻ cân đối (16 px); tạo từ xong hiện dòng xanh “✓ … added” ngay dưới câu |
| DICT-23 | `8064cf8` | Bỏ dòng “added”; tạo hết từ của câu: khung xanh “Sentence complete” có dấu ✓ nảy, số từ |
| DICT-24 | `07954ab` | “Sentence complete” không nền, đầu từ điển không đổi màu nền |
| DICT-25 | `817a1f6` | Không có từ nào để thêm: hiện ghi chú nhỏ giữa khung (Nothing to add here, bấm từ đỏ để học lại) |
| DICT-26 | `b921742` | Từ đã có/vừa Add rời danh sách như Delete; bấm từ xanh ở câu trên để sửa; câu đứng yên, lề trên dưới bằng nhau, thẻ mờ dần ở mép khi cuộn |
| DICT-27 | `c95a43e` | Tách từ tiếng Trung bằng jieba (批复, 介于 không bị tách lẻ), từ đã có luôn giữ nguyên; câu đầu không bao giờ lặp hai lần |
| DICT-28 | `5b0a629` | Bấm từ xanh/đỏ trong câu: popup thẻ từ (đổi nghĩa / Add lại), tìm được từ ở mọi bài; viền xanh đỏ cùng cỡ |
| DICT-29 | `71d9610` | Kéo qua các từ trong câu để tạo cụm: chọn tự bắt trọn từ, thả tay mở popup Add |
| DICT-30 | `91d7103` | Kéo từ bất kỳ đâu (cả trên từ có sẵn) để chọn cụm, nhấn không di chuyển mới là bấm; câu đầu to bằng ô thẻ (22/30, phone 20/28) |
| DICT-31 | `28ef288` | Kéo chọn cụm mở ô A: B như cũ, con trỏ sẵn sau dấu hai chấm để tự gõ nghĩa |
| DICT-32 | `9f2b660` | Popup thẻ có ô gõ nghĩa tuỳ ý (Save/Add/Enter), không chỉ chọn nghĩa từ điển |
| DICT-33 | `8873df2` | Câu gốc của từ lên đầu; dòng định nghĩa trong notes (có dấu :) hay chữ khác hệ không thành câu để bấm |
| DICT-34 | `cc14df6` | Shift/Delete tác dụng lên thẻ dưới chuột cả khi con trỏ gõ còn trong ô sửa (ô nhả con trỏ); nhãn nhắc trên thẻ |
| DICT-35 | `86a7bf3` | Bấm từ trên mọi câu đang hiện (thẻ Lessons đã show, mặt sau flashcard, theater, câu đầu ô sửa) mở popup từ điển; nghĩa sửa thẳng tại chỗ, không ô nhập riêng; từ đơn đã có mở popup để đổi nghĩa, cụm từ vẫn ô A: B; rê sáng từ + nghĩa |
| DICT-36 | `e20ad1e` | Popup từ ở theater, thẻ học, flashcard cũng tải câu ví dụ như trong ô sửa: một popup giống hệt ở mọi màn |
| DICT-37 | `504be8c` | Ô sửa thẻ quay lại nhúng trang từ điển (chinesedictionary.mobi, Bing) như DICT-1; bỏ danh sách từ, câu đầu, kéo chọn cụm, Shift/Delete trong ô sửa; tạo từ chỉ ở câu ngoài màn bằng popup |
| DICT-38 | `d0dfb12` | Giữ Shift rồi kéo: câu thành chữ thường để bôi đen (không sáng/mở từ), thả tay mở ô A: B với con trỏ sẵn sau dấu hai chấm; bỏ dấu câu ở hai đầu cụm; ở theater, thẻ Lessons, flashcard |
| DICT-39 | `aec0764` | Popup từ: Save chỉ hiện khi đã đổi nghĩa, cùng kiểu nút Add; Shift bấm Add/Save dù chuột ở đâu; từ dài không bị ngắt giữa |
| DICT-40 | `5888791` | Bấm nghĩa gợi ý chỉ thêm vào dòng nghĩa (sau dấu phẩy), không lưu; nghĩa đã có trong dòng được viền |
| DICT-41 | `7b097cc` | Popup từ: mỗi nghĩa một dòng (không dấu phẩy), nghĩa gợi ý thêm thành dòng mới; rê chuột vào từ chỉ hiện nghĩa |
| DICT-42 | `c339e9d` | Bấm từ / Shift tạo cụm chạy cả ở Today, task, danh sách nhiều bài (trước bị chặn), từ lưu vào bài gốc của câu |
| DICT-43 | `adf7c9a` | Popup từ: Enter lưu, Shift+Enter xuống dòng, bỏ Shift để lưu, click ra ngoài lưu thay đổi; ô Notes riêng của từ |
| DICT-44 | `4132aa4` | Nghĩa chỉ lặp lại chính từ (passport → passport) không hiện, tra lại theo chiều kia |
| DICT-45 | `59a5528` | Popup từ: bỏ mọi đường gạch, mọi phần thẳng một lề trái; Delete xoá từ đã có (⌘Z lấy lại); tooltip nghĩa giữa dưới từ, chữ lề trái, đệm trên dưới bằng nhau |
| DICT-46 | `53dbe49` | Enter lưu ngay khi popup mở (không cần click vào popup), không chấm thẻ phía sau |
| DICT-47 | `4346d3a` | Click ra ngoài popup/ô sửa chỉ đóng (không play/pause, không chấm, không mở thứ khác); từ vừa tạo/sửa tô màu ngay ở flashcard và theater |
| DICT-48 | `3a55847` | Từ tạo từ câu thế giới của flashcard vào Notes của thẻ đang học (cả Today/task, trước không lưu), câu giữ trong notes của từ; nút Add/Save luôn đặc màu khi rê |
| DICT-49 | `5f98cc4` | Câu ví dụ trong popup từ lấy từ các bài của bạn, không tải từ bên ngoài |
| DICT-50 | `f47dc4c` | Cụm từ dùng chung popup từ đơn: dòng đầu là cụm (sửa được), nghĩa mỗi dòng, Notes, Enter lưu; bỏ hẳn ô A: B ở mọi nơi (ô sửa, ô thêm thẻ, flashcard, sách, câu học) |
| DICT-51 | `71c9e83` | Tải sẵn nghĩa mọi từ của mọi câu đang hiện (cả từ thông dụng): popup mở là đủ, không nháy |
| DICT-52 | `47e260f` | Theo ODH: 🔊 từ đơn phát âm thật (Free Dictionary, Youdao), nhãn cấp độ (HSK, JLPT, TOPIK, CEFR) cạnh từ, định nghĩa tiếng Anh bấm để thêm vào nghĩa |
| DICT-53 | `bda56fb` | Định nghĩa và câu ví dụ từ điển thật qua extension (Cambridge, Youdao, Jisho·Weblio, krdict): trong popup, ô sửa từ và làm câu "nơi khác" của flashcard; extension 1.6.22 |

Hàm chính: `showDictSite`, `hideDictOverlay`, `dictUrlFor`, `ownDictCardHtml`, `openWordFloat`, `sentenceWordAt`, `ownDictLookup`, `ownDictFetch`, `ownDictPrefetch`.

### DICTLOAD: Tải trước trang từ điển
| Mã | Commit | Là gì |
|---|---|---|
| DICTLOAD-1 | `7b097cc` | Trang từ điển của thẻ đang hiện và thẻ kế tiếp (Lessons, flashcard, theater) tải sẵn trong ô sửa ẩn, đúng kích thước; mở ô sửa dùng lại trang đã tải, không tải lại |
| DICTLOAD-2 | `8d03895` | Từ điển (tải trước và trong ô sửa) nhận mọi câu đang hiện trên thẻ + ghi chú cùng ngôn ngữ |

Hàm chính: `dictLoad`, `dictSlot`, `dictFit`, `showDictSite`, `hideDictOverlay`, `preloadCardDict`, `preloadVocabDict`, `rowDictText`, `dictPreloadObserver`.

### DATA: Dữ liệu thẻ (Q/A)
| Mã | Commit | Là gì |
|---|---|---|
| DATA-1 | `961cf80` | Thẻ có Q và A; thẻ dịch chuyển sang Vocabulary; dán bài tự dịch câu thành từ vựng (V1) |
| DATA-2 | `c87d38e` | Chỉ học chính ngôn ngữ: A là bản dịch thì vào notes; câu kèm bản dịch giữ làm thẻ câu; bỏ tự dịch câu khi dán |
| DATA-3 | `28401a5` | Bỏ hẳn code thẻ dịch: câu dán kèm bản dịch vào notes ngay khi tạo; gộp một lần mỗi máy; bỏ gộp khi nạp/lưu, hộp thoại chuyển sang Vocabulary, bộ thẻ dịch |
| DATA-4 | `876d8af` | Chỉ còn Q và notes: mọi A (cả câu trả lời mẫu Speaking) vào notes, một lần mỗi máy; bỏ ô Answer; mọi mode: mặt trước Q, Show ra notes |
| DATA-5 | `3f33aa9` | Bỏ bước chuyển đổi một lần và mọi code xử lý dữ liệu A cũ; ô nghĩa chỉ còn cho từ bên Vocabulary |
| DATA-6 | `4fe949e` | A giữ lại như trước, viết trong một ô: dòng `/câu hỏi` rồi các dòng trả lời; chỉ bản dịch vào notes (khi dán hoặc khi gõ trong ô sửa) |
| DATA-7 | `1d418a1` | Không học dịch ở đâu cả: bỏ ⇄ (nghĩa trước), Translate to khi nhập, phần Translation trong Tests; câu và câu trả lời vẫn lưu như trước, không có code gộp |
| DATA-8 | `d8ccbdb` | Chỉ một ô `/Q, rồi A` + Notes ở mọi chỗ nhập: bỏ ô Answer của ＋ và ô Meaning của trình sửa từ Vocabulary; không có code gộp |
| DATA-9 | `f9e5447` | Dán bài không tự tạo từ: dòng `từ: nghĩa`, bullet, bản dịch, tiêu đề nằm nguyên trong notes của thẻ gần nhất |
| DATA-10 | `9b3cf86` | Ô /Q tự thêm / ở dòng đầu khi có dòng thứ hai (ô sửa thẻ, sửa từ, ＋) |
| DATA-11 | `7e54b58` | Ô thẻ (sửa thẻ, sửa từ, ＋): dòng câu hỏi tô màu của bên, dấu / không vẽ ra, thẳng lề |
| DATA-12 | `ac10946` | Bỏ luật /: xuống dòng 2 lần liên tiếp thì phần trên thành Q, sau đó xuống dòng bình thường; xoá hết đáp án thì về câu thường |
| DATA-13 | `551decf` | Bỏ hẳn /: Q đánh dấu bằng ký tự vô hình (do 2 lần xuống dòng tạo ra), / gõ hay dán đều là chữ thường |
| DATA-14 | `8529b6f` | Mở ô sửa là dòng Q có màu ngay; bỏ đoạn dọn ký tự đánh dấu trong cleanText |
| DATA-15 | `76fd44b` | Bỏ tự dọn: không làm sạch/nối/ghép khi mở app hay mở bài, không tự chuyển thẻ↔từ hay xoá trùng khi lưu; giữ chuyển định dạng tiến độ và bỏ mốc giờ khi không có video |
| DATA-16 | `11b9bb7` | Không tự lưu gì: bỏ xoá bài rỗng, chuyển tiến độ chỉ trong bộ nhớ, bài không video chỉ hiển thị như Speaking (giữ mốc giờ) |
| DATA-17 | `31ff949` | Ô thẻ: hết dòng trống thừa sau khi xuống dòng 2 lần thành Q (ô từ, ô thêm thẻ); ô sửa thẻ Lessons chỉ tô màu dòng Q, không tô dòng nghĩa |
| DATA-18 | `59a5528` | Thẻ có video cũng dùng ô Q/A chung (trước chỉ có câu) |
| DATA-19 | `0091022` | Ghi chú của từ là các dòng con dưới dòng `từ: nghĩa` trong Notes thẻ (một loại notes duy nhất); notes riêng cũ chuyển vào khi lưu |
| DATA-20 | `673d6cc` | Delete giống nhau ở popup, ô sửa thẻ, ô sửa từ (khi không gõ trong box) |
| DATA-21 | `de572ec` | Mỗi nghĩa một dòng trong mục của từ ở Notes (không dùng dấu phẩy để tách); dấu phẩy thuộc về nghĩa; tiến độ giữ nguyên |
| DATA-22 | `330101e` | Ô sửa thẻ Lessons cùng kiểu thẻ: câu + bản dịch xanh, loa góc trên, Notes nền xám |
| DATA-23 | `e8979d4` | Notes: Shift+Enter 1 lần trong mục từ = nghĩa tiếp (thẳng cột nghĩa đầu), 2 lần = mục mới |

Hàm chính: `newRow` (bản dịch vào notes khi tạo), `foldAnswer` + `keepsAnswer` (dòng thêm dưới câu khi sửa thẻ hoặc khi dán thì vào notes), `wordLike`, `belongsInVocab`, `isTranslationCard` (cho dòng `từ: nghĩa`), `autoSortLibrary`.

### BAR: Thanh công cụ khi học
| Mã | Commit | Là gì |
|---|---|---|
| BAR-1 | `961cf80` | Thanh trên đầy đủ (cờ, mode, số đếm, âm thanh, tốc độ); thanh đáy chỉ trên điện thoại (V1) |
| BAR-2 | `e981763` | Trong focus: thanh trên cố định ở mép trên, một ✕ chung |
| BAR-3 | `2a6b0d1` | Bản A: trên chỉ có số đếm và ✕; một thanh đáy cả trên máy tính (↶ ↷ 🔊 Show ✕ ✓ ⋯); ⋯ mở các công tắc khác; bỏ dấu giữ chỗ |
| BAR-4 | `1d418a1` | Bỏ nút ⋯; thanh trên luôn hiện đủ |
| BAR-5 | `2b33b9c` | Bỏ thanh A: không còn hàng nút đáy và nút 🔊 riêng trên máy tính; thanh trên cố định như BAR-2 |
| BAR-6 | `bb0fca5` | Podcast dùng đúng thanh trên chung: cờ, New/Due/Done, ✕ |
| BAR-7 | `acf2457` | Popup giới hạn mỗi ngày mở từ bộ đếm 🆕 ⏳ ✅ của mọi mode học (cả theater), ngay dưới bộ đếm; ô 🔥 chỉ hiện streak |
| BAR-8 | `f266b4e` | Hiệu ứng bộ đếm khi đổi giới hạn: một nhịp phồng nhẹ + vòng mờ, bỏ nảy đàn hồi và xoay; số lăn trong 1 giây |

Hàm chính: `updateTouchBar`, `sizeTouchBar`, `#tbSound`, `#tbMore`, `tools-open`.

### TODAY: Today và task
| Mã | Commit | Là gì |
|---|---|---|
| TODAY-1 | `961cf80` | Task mỗi bài, khoá, tiên bay tới ô tick (V1) |
| TODAY-2 | `83c560f` | Từ trong task học bằng Podcast |
| TODAY-3 | `e981763` | Trong focus: không khung, không thanh tên task |
| TODAY-4 | `f42c79a` | Từ trong task: ngẫu nhiên flashcard hoặc Podcast |
| TODAY-5 | `326581f` | Task theo đúng mode thường: câu video mở theater, không còn thẻ Listening |
| TODAY-6 | `bfcec26` | Bỏ luật thẻ chờ từ: thẻ câu và từ học độc lập (bỏ màn Words first, vuốt ⏳ Waiting) |

Hàm chính: `todayTasks`, `todayTaskCounts`, `taskQueue`, `startTaskSide`, `taskAdvance`, `leftToday`, `limitStudy`, `limitRows`.

### LAYOUT: Sidebar và cách mở bài
| Mã | Commit | Là gì |
|---|---|---|
| LAYOUT-1 | `961cf80` | Hai bên Lessons / Vocabulary riêng, màu xanh dương và xanh lá (V1) |
| LAYOUT-2 | `ba6d9ec` | "One way to study": một sidebar, mỗi bài mở theo cách học của nó |
| LAYOUT-3 | `df9253c` | Bỏ Word bank, sidebar một list |
| LAYOUT-4 | `f5796be` | Một màu ở mọi nơi |
| LAYOUT-5 | `f42c79a` | Khôi phục hai bên như LAYOUT-1: logo chuyển Lessons / Vocabulary, màu xanh lá, list bài riêng; ☰ flashcard và 🎧 Podcast trong Vocabulary; bỏ nút 字 trong bài và trên theater |
| LAYOUT-6 | `d0a1d9b` | Nút vào mode thành nút tròn xếp dọc (Speaking, theater, Podcast / flashcard, Podcast), bỏ ☰ trên thanh công cụ |
| LAYOUT-7 | `dac6f98` | Nút tròn không bao giờ đè thanh công cụ: xếp từ dưới thanh xuống, nằm ở đáy màn khi đủ chỗ |
| LAYOUT-8 | `91183ba` | Sidebar Vocabulary hiện các ngôn ngữ thay cho danh sách bài; bỏ hẳn Tests (📝, ⌘⌥X, công tắc Settings, backup tests) |
| LAYOUT-9 | `fb2edb8` | Logo và tên đổi màu cùng lúc (giữa vòng lật), tên mờ rồi hiện lại cùng nhịp logo |
| LAYOUT-10 | `4182897` | Sidebar Vocabulary: thẻ Vocabulary dưới Today (đếm, chip ngôn ngữ, thanh) mở trang Vocabulary; bỏ ô ngôn ngữ to |
| LAYOUT-11 | `003965a` | Thẻ Vocabulary chiếm hết sidebar: số New/Due/Today, hàng từng ngôn ngữ (bước lộ trình, thanh Done), biểu đồ 7 ngày, buổi đang chờ |
| LAYOUT-12 | `266b0f1` | Thẻ Vocabulary ở sidebar làm lại: nền gradient rực, ô số dạng kính, mỗi ngôn ngữ một thẻ màu riêng (tên đủ, 🆕⏳✅, bước), biểu đồ 7 ngày, nút Open trắng |
| LAYOUT-13 | `673d6cc` | Bộ rule chung (README → Rules, 12 nhóm); màu ngôn ngữ Library = Vocabulary |

Hàm chính: `switchToLesson`, `setAppMode`, `syncModeButtonHighlights`, `lessonInMode`, `lessonShown`, `bookHidden`.

### FOCUS: Chế độ focus (toàn màn hình khi học)
| Mã | Commit | Là gì |
|---|---|---|
| FOCUS-1 | `db44c63` | Ẩn sidebar, cảnh dịu đổi mỗi lần chấm |
| FOCUS-2 | `970a1f2` | Khung ôm nội dung, nằm giữa màn hình |
| FOCUS-3 | `e981763` | Một ✕ chung ở góc phải trên; thanh công cụ ở mép trên |
| FOCUS-4 | `16a2b79` | 18 cảnh, không cảnh tím |
| FOCUS-5 | `3921081` | Bấm lá cờ không còn thoát mode; chỉ thoát bằng ✕ |
| FOCUS-6 | `1a9077c` | Điện thoại: chạm cờ để thoát, không có ✕ (máy tính giữ ✕) |
| FOCUS-7 | `adac075` | Điện thoại: thanh trên sát mép, không chừa chỗ cho ✕ |
| FOCUS-8 | `abc1ae4` | Thanh trên cân hai bên: cờ cách mép trái bằng ✕ cách mép phải |

Hàm chính: `syncFocus`, `pickFocusScene`, `FOCUS_SCENES`, nút `#focusExit`.

### CLOCK: Đồng hồ học
| Mã | Commit | Là gì |
|---|---|---|
| CLOCK-1 | `06f8d2c` | Đồng hồ chỉ chạy khi học, lưu theo ngày |
| CLOCK-2 | `4d8c3a8` | Một đồng hồ mờ kính nổi, kéo đi được, nhớ chỗ |
| CLOCK-3 | `2b33b9c` | Gỡ hẳn đồng hồ học (về như V1) |

Hàm chính: `studyingNow`, `placeStudyClock`, `STUDY_TIME_KEY`, `#focusClock`.

### MOVE: Hiệu ứng chấm và xoá
| Mã | Commit | Là gì |
|---|---|---|
| MOVE-1 | `961cf80` | Thẻ bay với nhãn Good/Again; Delete là bóng ✕ có cánh thiên thần bay lên (V1) |
| MOVE-2 | `21fa119` | Toàn màn hình: hất phải/trái kèm dấu, Delete chém đôi |
| MOVE-3 | `0cb743b` | Dấu đặc, phủ màu, dừng một chút trước khi bay |
| MOVE-4 | `71aff22` | Nhát chém dày, viền đỏ, chậm hơn |
| MOVE-5 | `f4c55cc` | Good/Again nhanh hơn |
| MOVE-6 | `7ea384e` | Good/Again/Delete nhanh hơn nữa (khoảng 0,35 giây; Delete dưới 1 giây) |
| MOVE-7 | `71d9610` | Good/Again: dấu ✓/✕ nằm sẵn trên thẻ và bay cùng thẻ, không đóng dấu rồi mới vuốt |
| MOVE-8 | `d203440` | Sửa MOVE-7: dấu ✓/✕ hiện sẵn trên thẻ khi bay (trước đó bị trong suốt) |
| MOVE-9 | `a09ce83` | Theater dùng chung hiệu ứng chấm và xoá của mọi mode (trước có dấu nhỏ riêng và nền đen bị chém) |
| MOVE-10 | `71e0073` | Good/Again/chuyển: nền màu đậm hơn (38%) làm mờ nội dung dưới, viền màu đặc 6 px và bóng đổ cho tấm đang bay |
| MOVE-11 | `fbda3d8` | Bỏ viền màu quanh tấm đang bay, giữ nền đậm làm mờ và bóng đổ |
| MOVE-12 | `7667158` | Bật giảm chuyển động trong hệ thống thì mọi hiệu ứng (CSS và JS) đều bỏ, mọi thứ hiện ngay |

Hàm chính: `swipe`, `ghostFor`, `angelFly`, `cutLayer`, `playCut`.

### RING: Vòng âm thanh trên nút
| Mã | Commit | Là gì |
|---|---|---|
| RING-1 | `961cf80` | Vòng rút dần (V1) |
| RING-2 | `78e6a57` | Vòng đầy dần từ giữa cạnh trên |
| RING-3 | `47a9a4e` | Rút dần như V1 nhưng trượt mượt |
| RING-4 | `ea6c79f` | Vòng mới tạo thì đầy ngay, không chạy ngược |
| RING-5 | `0ab30de` | Bỏ tia sét giật khi chờ tiếng ở mọi mode |
| RING-6 | `91ea79a` | Giọng đọc (TTS) cũng có vòng viền, chạy theo từng chữ được đọc (sự kiện boundary), thanh chạy thẻ nghe cũng vậy |
| RING-7 | `1901f9a` | Ưu tiên: thanh chạy dưới cảnh (thẻ nghe) > mốc giờ của câu > nút loa trên cùng; chỉ một dấu tiến độ một lúc |
| RING-8 | `5b0a629` | Flashcard: vòng chạy trên pill của từng câu thay vì nút loa trên cùng |
| RING-9 | `199b7d3` | Lessons: câu không video có pill ▶/⏸ ở ☰ Full và tờ Speaking, vòng chạy trên pill |
| RING-10 | `71d9610` | Pill ▶/giờ căn giữa dòng đầu của câu (Speaking, ☰ Full) |
| RING-11 | `bba0a99` | Vòng chạy trên nút sound của theater và nút 🔊 trong Dictionary; không vẽ vòng lên mặt thẻ đang ẩn |
| RING-12 | `e44ef17` | Trả lại tia sét giật khi chờ tiếng (như trước RING-5), thêm cho nút sound theater, pill ▶ và 🔊 Dictionary |
| RING-13 | `43e7be1` | Tia sét chỉ khi chờ tiếng lần đầu sau khi mở app; tiếng đã phát một lần thì các lần chờ sau không giật |
| RING-14 | `4346d3a` | Mặt trước Podcast đọc bằng giọng máy: nút 🔊 hiện ⏸ đồng bộ với thanh chạy |

Hàm chính: `paintRing`, `dropRing`, `setDash`.

### LOOKUP: Từ đã có trong câu
| Mã | Commit | Là gì |
|---|---|---|
| LOOKUP-1 | `961cf80` | Tô nền (V1) |
| LOOKUP-2 | `51f8b07` | Chỉ tô màu chữ: xanh lá cho từ của thẻ khác, tím cho từ của thẻ này |
| LOOKUP-3 | `16a2b79` | Xanh lá đậm hơn và xanh dương, không tím |
| LOOKUP-4 | `3921081` | Rê chuột lên lookup không còn gạch chân |
| LOOKUP-5 | `b921742` | Popup từ chỉ hiện dòng notes của đúng từ đó; pinyin chỉ hiện khi rê đúng vào từ |
| LOOKUP-6 | `adf7c9a` | Từ đã có được tô ở mọi lần xuất hiện trong câu (cùng màu); bấm từ màu mở popup từ (cụm mở ô A: B), không mở ô sửa thẻ |
| LOOKUP-7 | `c9a7c3f` | Ô sửa thẻ: từ đã có cùng màu như bên ngoài (hết nền vàng do lớp tô dòng Q), rê hiện nghĩa, bấm mở popup từ; tạo từ bằng bôi đen + Shift |
| LOOKUP-8 | `71c9e83` | Từ tô màu không bị cắt chữ: dải bo được tính lại khi font của thẻ tải xong, đo lệch thì bỏ mặt nạ |
| LOOKUP-9 | `003965a` | Popup câu dài: tiêu đề nhỏ trải hết bề ngang, loa + Add một hàng dưới, nghĩa giữ một câu (không tách theo dấu phẩy, cả tooltip) |
| LOOKUP-10 | `8602c89` | Popup câu dài: loa và ＋ thu gọn, nằm cùng dòng đầu bên phải, chữ chảy quanh |
| LOOKUP-11 | `526e75b` | Popup đều 4 lề (Notes không thò ra ngoài lề chữ), dấu ＋ là icon căn giữa |
| LOOKUP-12 | `9a54d6a` | Popup từ: đang tải nghĩa thì hiện Translating… như extension (bỏ thanh xám chờ) |
| LOOKUP-13 | `0091022` | Rule chung: từ đã có = mọi bài cùng ngôn ngữ (tô màu, popup); khác ngôn ngữ không tính |
| LOOKUP-14 | `673d6cc` | Ô sửa từ tô màu mọi từ của bạn trong câu, rê chuột hiện nghĩa, click mở popup |
| LOOKUP-15 | `0ce61a7` | Chữ phụ trong popup từ (Add, Save, In your words, NOUN, Notes) dùng font pixel; lọc ngôn ngữ chỉ giữa Trung/Nhật/Hàn |
| LOOKUP-16 | `de572ec` | Popup, ô sửa từ, flashcard, list từ đều hiện mỗi nghĩa một dòng |
| LOOKUP-17 | `c0caa7e` | Lề đồng bộ popup và ô sửa: khung 16px quanh thẻ, Save cách 16px, Notes 8/12px, loa canh giữa dòng đầu |
| LOOKUP-18 | `2e19088` | Một thiết kế duy nhất cho popup và mọi ô sửa (cỡ chữ, thứ tự, màu như popup); Notes xuống dưới cùng |
| LOOKUP-19 | `0b06da0` | Ô sửa bỏ viền thẻ bên trong (khung là thẻ); In your words thành dấu ✓ tròn nhỏ; popup lề 16px cả trên điện thoại |
| LOOKUP-20 | `e8979d4` | Nhãn từ loại (noun, adj, adv…) viết thường |
| LOOKUP-21 | `8d03895` | Ô sửa cạnh từ điển cao vừa nội dung: lề 16px đều quanh nội dung và Save, tối thiểu 360px, căn giữa khi ngắn |
| LOOKUP-22 | `e9da0fd` | Trang từ điển cách mép khung 16px trên, trái, dưới và cách nội dung 16px; ô ＋ thêm thẻ/từ dùng chung thẻ của popup |
| LOOKUP-23 | `60ef5d9` | Ô sửa cạnh từ điển trở lại cỡ đầy đủ như trước (900×640, nhỏ hơn khi màn hình nhỏ); nội dung căn giữa, trên dưới bằng nhau |
| LOOKUP-24 | `14ab296` | Nội dung ô sửa cạnh từ điển nằm sát trên như trước (không căn giữa), thẳng hàng với mép trên trang từ điển |
| LOOKUP-25 | `812fbee` | Trả khung ô sửa cạnh từ điển về đúng như trước LOOKUP-21: từ điển sát mép trái, khung cỡ đầy đủ, nội dung sát trên |
| LOOKUP-26 | `c7979be` | Popup và mọi ô sửa: trừ dòng chính, mọi chữ (chip, từ loại, câu, pinyin, Notes) cùng cỡ bản dịch 18px/26px |
| LOOKUP-27 | `83738fe` | Ô sửa (Lessons, Vocabulary) và popup tra từ: một khoảng 10px giữa mọi phần (dòng chính, câu, Notes, Save, ô nét chữ) |
| LOOKUP-28 | `0fc66d7` | Ô sửa: bản dịch cách dòng chính 10px (Lessons và Vocabulary), như popup tra từ |
| LOOKUP-29 | `d96bfb8` | Popup tra từ: các câu ví dụ cũng cách nhau 10px như mọi phần khác |
| LOOKUP-30 | `d4ba644` | Cân theo mắt: khoảng 12px tính từ đỉnh chữ hoa tới chân chữ; mỗi nghĩa một dòng riêng cách nhau 12px (popup, ô sửa Lessons và Vocabulary) |
| LOOKUP-31 | `6bb600d` | Popup tra từ: nhãn cấp độ, 🔊 và Add dồn về góc phải như ô sửa; nút không đẩy dòng nghĩa xuống, từ → nghĩa cách 12px |
| LOOKUP-32 | `54fcb75` | Khoảng chung trong popup tra từ và ô sửa tăng 12px → 15px (đỡ dính) |
| LOOKUP-33 | `58fda29` | Ô sửa Vocabulary: các hàng chip/định nghĩa cách nhau 15px như popup |
| LOOKUP-34 | `pending` | Chốt khoảng chung 16px (12 + 4) trong popup tra từ và ô sửa |

Hàm chính: `highlightVocabInHtml`, `markLookup`, `markTip`, `showVocabPopup`, `showWordView`, `showVocabAddPopup`, `fitLookupMarks`, `fitHighlights`.

---

## Cách dùng

- **Lấy lại nguyên một phần:** "lấy lại FLASH-1". Tôi lấy đúng các hàm, CSS và HTML của phần đó từ commit tương ứng, ghép vào bản hiện tại, giữ nguyên các phần khác.
- **Trộn:** "POD-12 nhưng mặt sau như POD-8".
- **Chỉ xem:** "cho xem THEATER-10". Tôi mô tả lại hoặc chụp ảnh đúng phiên bản đó, không sửa gì.
- Mỗi lần sửa xong một phần, tôi thêm một dòng mới vào bảng của phần đó, kèm commit, để mã luôn chỉ đúng chỗ.
