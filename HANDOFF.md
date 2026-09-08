# BabyMix — Hành trình hai chị em Yên & Cá

Cập nhật 06/09/2026. Bản local, chưa publish. BabyMix khác Baby1/Baby2: kể chuyện HAI CHỊ EM trên một dòng thời gian chung.

## Dữ kiện chốt
- Yên (Tsàn Thuý Yên, 秦邃嫣) sinh 04/04/2021 16:00 — accent hồng phấn #E98EB8
- Cá (Tsàn Ý Khuê, 秦懿奎) sinh 08/12/2022 07:10, âm lịch 15/11/2022 — accent xanh lá #4F9271
- Bảng màu site: nền kem ấm #FDF9F3, duo hồng Yên × xanh Cá, mid #C9A87C
- Card launcher: ảnh IMG_checked/2023-01-21_1_52.webp (đã copy sang assets/babymix/ui/card-avatar.webp); nền gate mờ từ chính ảnh này

## Pipeline (G0 — DONE)
- Nguồn: `BabyMix/IMG_checked` (552 WebP) + `Video_checked` (159 MP4), người dùng đặt sẵn, GIỮ NGUYÊN không xóa
- `scripts/build-display.py`: copy hash-audited → `assets/babymix/{images,videos}/YYYY/MM/`
- `scripts/build-video-posters.py`: poster 640px — 159/159 DONE
- `scripts/build-media-manifest.py`: manifest runtime (552 ảnh + 159 video, 0 prenatal-ca)
- `scripts/watch-media.py` + start-media-watch.bat: auto-sync copy/xóa
- .gitignore: media nặng (nguồn + display), chỉ code/data vào git

## Runtime (G1 — DONE)
- Shell copy từ Baby2 (đã kiểm chứng) + adapt: index.html, access-gate.js (hero kép: thẻ "Hồ sơ chị em" 2 khối Yên/Cá + tuổi runtime), main.js (render tuổi 2 bé, journeyNow text kép), story-enrichment-v2.js (sisterAgeText: mỗi media/ngày hiển thị "Yên XtYm · Cá XtYm"), media-filename.js giữ nguyên
- data/baby-data.js: profile hợp nhất + `sisters[]`, backgrounds 4 giai đoạn (Chào em Cá → Cùng lớn → Cùng khám phá → Lớn khôn cùng nhau), scene đầu `bm-sisters-birth` 08/12/2022
- Timeline anchor theo ngày sinh Cá (em út); manifest group "prenatal-ca" cho media trước 08/12/2022 (hiện 0 file)
- Gate: badge YC gradient hồng-kem-xanh, panel nâu ấm, nền ảnh mờ

## Kiểm thử
- Smoke đầu 1440: 85 scene render, manifest 552+159 nối đủ, 39 album, 0 JS error, 0 404
- Tuổi kép xác nhận: "Ngày 10/12/2022 · Yên 1t8m · Cá 0m" (sửa 1 bug công thức tuổi ban đầu)
- Ảnh avatar card + viewer alt "Ảnh của Yên & Cá"

## Chưa làm / tiếp theo (G2)
- Review contact sheet toàn bộ 552 ảnh + 159 poster → viết chương chuyện hai chị em (8–12 chương dự kiến: Chào em Cá, những ngày đầu, Tết, đi chơi…)
- Mapping sự kiện theo yêu cầu người dùng (quy trình như sự kiện Vũng Tàu của Baby2)
- Mobile QA 390/320 đầy đủ

## G2 — Câu chuyện hai chị em (DONE 06/09/2026)
- Review toàn bộ 21 contact sheets (552 ảnh + 159 poster) trong `review/contact-sheets/`.
- `scripts/build-story-observations.py` sinh `data/story-observations.js` với **12 chương chuyện** (69 media, mọi đường dẫn đã verify trên disk trước khi ghi):
  1. Chào em Cá — Yên lên chức làm chị (12/2022, 9 media + video)
  2. Bốn câu chuyện, một khung hình (08/01/2023)
  3. Chiếc xe đẩy đôi đầu tiên (05/02/2023)
  4. Yên tròn hai tuổi (04/04/2023)
  5. Chị Yên ôm em — chương dễ thương nhất (05/2023, 9 media gồm đọc sách cho em)
  6. Giấc ngủ trên ngực ba (07/2023)
  7. Buổi chụp hình cùng "bạn thú" (21/08/2023)
  8. Yên ba tuổi: bóng bay và bong bóng xà phòng (18/04/2024)
  9. Chiếc ghế của hai chị em (10/2024)
  10. Dã ngoại chào năm mới (31/12/2024)
  11. Hai gương mặt khẩu trang (30/05/2025)
  12. Yên tròn năm tuổi (04/2026)
- Mỗi chương là 1 scene với lời kể riêng, media tách khỏi nhật ký tháng, preview tối đa 4 ảnh.
- Sửa lỗi launcher: card BabyMix từng bị chèn nhầm vào touchstart listener (addEventListener bỏ qua tham số thừa nên không hiện) — đã chuyển vào đúng mảng `discoveries[]` trong `app.js`; card load OK, screenshot `review/launcher-babymix.png`.
- Mobile 390: 109 scene, không tràn ngang, 0 lỗi. Sự kiện/months mới thêm sau: sửa `events` trong story-observations qua script build-story-observations.py rồi chạy lại.

### Cập nhật cấu trúc + câu chuyện "20 tháng — một con số 1" (06/09/2026)
- **Chia lại nguồn:** `IMG_checked`/`Video_checked` từ phẳng → `YYYY/MM/` (711 file move). Sau đó xác minh display 711/711 khớp hash audit → **xóa 2 thư mục nguồn trùng lặp**, giờ BabyMix chỉ còn media trong `assets/babymix/` như Baby1/Baby2.
- `build-display.py` chuyển sang chế độ self-verify (nguồn = display, chỉ re-hash + refresh audit); `manifest` không đổi (552+159).
- **Card "20 tháng — và chỉ một con số 1"** (`bm-dieudacbiet-20-thang`, trước scene Chào em Cá): Yên 04/04/2021, Cá 08/12/2022 — cách 20 tháng 4 ngày nhưng năm sinh chỉ lệch 1 con số (2021/2022), sau này đến trường chỉ lệch đúng một lớp. Cập nhật cả `shortBio`.
- Smoke 1440 PASS, 0 lỗi.

### QA sâu BabyMix (DONE 06/09/2026)
1. **Mobile 320px full-scroll PASS**: 120 nhịp cuộn qua toàn bộ hành trình, 113 scene render, **0 tràn ngang**, 0 JS error/404; album mở được, thumbnail load tốt. Screenshot `review/mobile-320-top.png`, `mobile-320-album.png`.
2. **Lời kể 42 tháng tuổi**: `build-story-observations.py` thêm `MONTH_STORIES` (viết tay theo review) + `build_months()` tự nhóm media theo tuổi Cá, gắn evidence 3 ảnh/tháng → card nhật ký tháng không còn mô tả chung. Các tháng không có media tự bỏ qua (VD tháng 41 = 05/2026).
3. **Bổ sung video vào chương**: thêm video vào 7 chương (Chào em Cá +1, Bốn người +2, Chị ôm em +4, Ngủ với ba +1, Bạn thú +2, Yên 3 tuổi +1, Ghế gaming +3) và **chương mới 13 "Yên tập viết những chữ đầu tiên"** (29/07/2025, 5 video tập viết — poster trắng do video quay nền giấy, đã ghi chú context). Video "xe đẩy" 2023-02-17_2 sau khi xem thực tế là hai chị em trên giường → không ghép vào chương xe đẩy, để ở nhật ký tháng.
- Dọn 6 lỗi văn bản rác (từ liệu tiếng Trung/Đức lọt từ lúc soạn) trong cả 3 build script Baby1/Baby2/BabyMix; sửa tháng 29 ghi nhầm năm.

## TÁCH REPO RIÊNG & PUSH GITHUB (06/09/2026)
- Site đã tách khỏi Discovery, repo riêng: **https://github.com/maxskill115/BabyMix** — local: `F:/0.Tools/fingermath/BabyMix`.
- Push đầy đủ media + video theo đợt ≤350MB bằng `F:/0.Tools/fingermath/push-batched.py` (script dùng chung, idempotent, tự retry/rebase).
- **4 file video >100MB bị GitHub chặn cứng, KHÔNG lên được, giữ local** (xem `.gitignore`): không có (video lớn nhất <100MB)
- Cấu trúc giữ nguyên (assets/css/js/data/scripts); `.gitignore` repo: contact-sheets + IMG_checked/ + Video_checked/ (bản gốc trùng lặp với display) + video assets/babymix/videos/ ĐÃ push lên repo.
- Sau này đổi tên project/domain trên Vercel thì nhớ cập nhật link card trong repo Discovery (`app.js`).

## Video hover/chạm-giữ preview kiểu YouTube (06/09/2026)
- `js/video-hover-preview.js` (dùng chung 3 site, nạp cuối chuỗi access-gate sau media-filename): desktop rê chuột ~0.4s → thumbnail tự phát video muted từ đầu, tối đa 6s rồi loop; rời chuột → dừng + gỡ src. Mobile: chạm giữ ~0.4s → preview, thả tay → dừng và CHẶN click mở viewer (gõ nhanh <0.4s vẫn mở viewer bình thường).
- Performance chuẩn YouTube (đã test Playwright): cuộn full hành trình **0 MP4 nào được tải** (chỉ poster lazy); hover vào thumbnail nào chỉ tải đúng video đó.
- Video hiển thị đè poster qua class `.is-previewing` (opacity poster → 0, video object-fit cover).
- Lưu ý test bằng Playwright synthetic touch: phải dispatch TouchEvent có `touches` thật; `dispatch_event("touchstart")` không kèm touch list sẽ bị bỏ qua (đã nới điều kiện để hoạt động cả khi length != 1).

### Fix hover-preview trên PC (06/09/2026, sau phản hồi người dùng)
- Triệu chứng: mobile chạm giữ phát OK nhưng PC rê chuột không phát.
- Nguyên nhân: khi `<video>` preview được chèn vào thumbnail, chuột "nhảy" từ poster sang video mới → trình duyệt sinh `pointerout` (relatedTarget = video preview) → handler cũ hiểu là rời thumbnail → tắt preview ngay (pointerout cascade).
- Fix: trong `pointerout`, bỏ qua khi `relatedTarget` vẫn nằm trong thumb (`thumb.contains(relatedTarget)`); chỉ dừng preview khi con trỏ rời khỏi thumb thật sự. Desktop click vào thumb đang preview: stop preview rồi vẫn mở viewer bình thường.
- Test chuột THẬT (Playwright mouse.move sinh đủ pointer events + cascade): hover 1.2s → playing; di chuyển vòng trong thumb (qua video mới chèn) → vẫn phát; rời hẳn → dừng. Commit `0fca035` (Baby1), đồng bộ 3 site.
