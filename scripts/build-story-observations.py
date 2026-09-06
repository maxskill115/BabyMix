"""Write BabyMix story chapters into data/story-observations.js.

12 chapters built from the 2026-09-06 contact-sheet review of all 552 images
and 159 video posters. Media paths are verified against disk before writing.
"""
import json
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parent
IMG = "./assets/babymix/images"
VID = "./assets/babymix/videos"


def media(*names):
    out = []
    for n in names:
        folder = "videos" if n.endswith(".mp4") else "images"
        out.append(f"./assets/babymix/{folder}/{n[:4]}/{n[5:7]}/{n}")
    return out


EVENTS = [
 {
  "sceneId": "bm-ch1-chao-em-ca", "date": "2022-12-10", "importance": 5,
  "title": "Chào em Cá — Yên lên chức làm chị",
  "story": "Tháng 12/2022, Cá chào đời, ngôi nhà có thêm một “gói hồng” nhỏ xíu được quấn kỹ trong khăn. Chị Yên hai tuổi rưỡi hãy còn ngơ ngác, nhưng mỗi lần nằm cạnh em là chị lại rón rén đặt tay lên người em, liếc nhìn rồi cười. Những ngày đầu ấy chưa có gì nhiều — chỉ có hai chị em trên chiếc chiếu hoa, một bé ngủ, một bé tò mò — nhưng đó chính là trang đầu tiên của cuốn sổ hai chị em.",
  "media": media("2022-12-10_17.webp","2022-12-10_18.webp","2022-12-11_3.webp","2022-12-13_3.webp","2022-12-22.webp","2022-12-27.webp","2022-12-27_2.webp","2022-12-27_4.webp","2022-12-10_6.mp4","2022-12-10_8.mp4"),
  "evidence": ["Contact sheet 000: Yên nằm cạnh Cá mới sinh 10-17/12/2022; 27/12 Yên được bế kèm ôm em"],
  "context": "Ảnh chụp tại nhà trong những ngày Cá mới sinh; một số tấm có mẹ hỗ trợ để Yên ôm em an toàn."
 },
 {
  "sceneId": "bm-ch2-bon-nguoi", "date": "2023-01-08", "importance": 4,
  "title": "Bốn câu chuyện, một khung hình",
  "story": "Đầu tháng 01/2023, cả nhà mặc đồ đen chỉnh tề để chụp bộ ảnh đầu tiên đủ bốn người: mẹ ôm Cá, Yên ngồi tựa vào người lớn, ai cũng nhìn vào ống kính. Hơn bốn mươi tấm được bấm liên tục trong một buổi chiều — bụng đói, chân tê, em bé khóc ngang — để cuối cùng chọn được vài tấm ưng nhất. Tấm nào cũng quý, vì đó là lần đầu tiên “gia đình bốn người” hiện diện trọn vẹn trong một khung hình.",
  "media": media("2023-01-01.webp","2023-01-01_1.mp4","2023-01-08_2.webp","2023-01-08_14.webp","2023-01-08_20.webp","2023-01-08_30.webp","2023-01-08_40.webp","2023-01-08_43.webp","2023-01-09_1.mp4"),
  "evidence": ["Contact sheet 001-002: chuỗi ảnh gia đình 01-08/01/2023"],
  "context": "Buổi chụp ảnh gia đình tại nhà đầu năm 2023."
 },
 {
  "sceneId": "bm-ch3-xe-day-doi", "date": "2023-02-05", "importance": 4,
  "title": "Chiếc xe đẩy đôi đầu tiên",
  "story": "Tháng 02/2023, chiếc xe đẩy đôi về nhà: một bên là nôi cho Cá quấn tã hồng, một bên là ghế vàng cho Yên ngồi canh em. Hai chị em đặt cạnh nhau trên xe, một bé ngủ say, một bé mắt lum xum nhìn quanh — đúng chuẩn một tổ hợp đi chơi chuyên nghiệp sắp ra mắt.",
  "media": media("2023-02-05_1.webp","2023-02-05_3.webp","2023-02-05_5.webp","2023-02-05_6.webp"),
  "evidence": ["Contact sheet 002: xe đẩy đôi 05/02/2023"],
  "context": "Chuẩn bị đi chơi với xe đẩy đôi mới."
 },
 {
  "sceneId": "bm-ch4-yen-2-tuoi", "date": "2023-04-04", "importance": 5,
  "title": "Yên tròn hai tuổi",
  "story": "04/04/2023, Yên tròn hai tuổi. Cả nhà đi ăn riêng, chiếc bánh trái tim tím mang dòng chữ “Happy Birthday Thuý Yên” được đặt giữa mâm. Lần đầu tiên Yên thổi nến trước đám đông và biết rõ mình đang được chúc mừng — mắt mở to, miệng nhếch lên thích thích. Cá bốn tháng tuổi nằm trong vòng tay mẹ, là khách mời nhỏ tuổi nhất của bữa tiệc.",
  "media": media("2023-04-04_1.webp","2023-04-04_2.webp","2023-04-04_3.webp","2023-04-04_4.webp"),
  "evidence": ["Contact sheet 003: bánh sinh nhật 'Happy Birthday Thuý Yên' + tiệc nhà hàng 04/04/2023"],
  "context": "Tiệc sinh nhật lần thứ hai của Yên tại nhà hàng."
 },
 {
  "sceneId": "bm-ch5-chi-om-em", "date": "2023-05-14", "importance": 5,
  "title": "Chị Yên ôm em — chương dễ thương nhất",
  "story": "Tháng 05/2023 ghi nhận nhiều “tấm ôm” nhất của hai chị em: Yên mặc áo vàng ôm chầm lấy Cá từ phía sau, dụi mặt vào vai em, rồi hai chị em nằm trọn trong một vòng tay. Có tấm Cá nhăn nhó vì bị ôm hơi chặt, nhưng cũng có tấm hai đứa cùng cười toe. Chiều 14/05, Yên cầm quyển sách tập đọc kê lên chân và “giảng” cho Cá nghe dù em chưa hiểu gì — mẹ chụp trọn một loạt, và đó là bằng chứng đầu tiên của nghề “chị kèm em” về sau.",
  "media": media("2023-05-04_1.mp4","2023-05-04_10.webp","2023-05-04_12.webp","2023-05-04_14.webp","2023-05-04_15.webp","2023-05-05.mp4","2023-05-05_1.webp","2023-05-07.mp4","2023-05-14_1.webp","2023-05-14_3.mp4","2023-05-14_4.webp","2023-05-14_7.webp"),
  "evidence": ["Contact sheet 004-005: chuỗi Yên ôm Cá đầu 05/2023; 14/05 đọc sách cho em"],
  "context": "Ảnh tại nhà, tháng 05/2023."
 },
 {
  "sceneId": "bm-ch6-ngu-cung-ba", "date": "2023-07-05", "importance": 4,
  "title": "Giấc ngủ trên ngực ba",
  "story": "Đầu tháng 07/2023 có một loạt ảnh “hiếm”: ba nằm gối chăn, và hai công chúa lần lượt leo lên leo lên nằm gọn giữa ngực. Yên trốn dưới cằm ba, Cá ngáy khò trong tã. Cả ba người ngủ như một chồng bánh kẹp — ai đi ngang cũng phải chụp lại làm kỷ niệm. Lần đầu tiên ba nhận “nhiệm vụ bất khả kháng”: không được dậy dù tay đã tê.",
  "media": media("2023-07-05.mp4","2023-07-05_10.webp","2023-07-05_12.webp","2023-07-05_14.webp","2023-07-05_16.webp","2023-07-05_6.webp"),
  "evidence": ["Contact sheet 005: ba nằm ngủ chung với hai bé 05-07/07/2023"],
  "context": "Khoảnh khắc nghỉ trưa của ba và hai chị em."
 },
 {
  "sceneId": "bm-ch7-buoi-chup-thu", "date": "2023-08-21", "importance": 4,
  "title": "Buổi chụp hình cùng “bạn thú”",
  "story": "21/08/2023, sân nhà được dọn thành phim trường: rèm bạc giăng phía sau, cả đội nhân vật nhồi bông — tuần lộc đội nón, gấu, vịt — quay quanh ghế của Cá. Yên phụ “sắp đặt đạo cụ” rồi ngồi vào giữa; Cá ngồi giữa rừng thú nhìn quanh vô cùng nghiêm túc. Buổi chụp khép lại khi hai chị em tự động rúc vào lòng nhau cười.",
  "media": media("2023-08-21.mp4","2023-08-21.webp","2023-08-21_1.mp4","2023-08-21_1.webp","2023-08-21_1_1.webp","2023-08-21_2.webp","2023-08-21_3.webp","2023-08-21_4.webp","2023-08-21_5.webp"),
  "evidence": ["Contact sheet 006: buổi chụp với thú nhồi bông 21/08/2023"],
  "context": "Tự chụp tại nhà, có đạo cụ thú bông."
 },
 {
  "sceneId": "bm-ch8-yen-3-tuoi", "date": "2024-04-18", "importance": 5,
  "title": "Yên ba tuổi: bóng bay và bong bóng xà phòng",
  "story": "Sinh nhật Yên năm 2024 không có bánh kem lớn, nhưng có bóng bay đủ màu treo kín góc nhà và một “súng” thổi bong bóng xà phòng tỏa ra hàng trăm quả lơ lửng. Hai chị em đuổi theo bong bóng khắp phòng, Cá chúm chím tay bắt cho được một quả. Mốc này cũng đánh dấu giai đoạn hai chị em bắt đầu tự “ra đề” chơi cùng nhau thật sự — không cần người lớn khởi xướng.",
  "media": media("2024-04-18.webp","2024-04-18_2.webp","2024-04-19.mp4"),
  "evidence": ["Contact sheet 009: bóng bay 18-19/04/2024 + khung bong bóng"],
  "context": "Sinh nhật 3 tuổi của Yên, tổ chức tại nhà."
 },
 {
  "sceneId": "bm-ch9-ghe-gaming", "date": "2024-10-09", "importance": 4,
  "title": "Chiếc ghế của hai chị em",
  "story": "Nửa cuối 2024, chiếc ghế gaming của ba biến thành “chỗ ngồi chung” của hai chị em: hai đứa chen nhau, đắp chung chăn, bốc snack cùng nhau và cùng nhìn về một phía như đang xem phim. Có hôm Yên bế Cá đặt lên ghế trước rồi mới trèo lên ngồi kề. Chiếc ghế một người vô tình thành biểu tượng của hai chị em: chật chội nhưng không ai muốn ngồi chỗ khác.",
  "media": media("2024-09-19.webp","2024-09-19_1.webp","2024-09-19_2.webp","2024-09-19_3.webp","2024-10-05.mp4","2024-10-05_1.mp4","2024-10-05_2.mp4","2024-10-09.webp","2024-10-09_1.webp","2024-10-09_2.webp"),
  "evidence": ["Contact sheet 011: hai bé trên ghế gaming tháng 09 và 10/2024"],
  "context": "Ảnh tại nhà, tháng 09-10/2024."
 },
 {
  "sceneId": "bm-ch10-giao-thua-cong-vien", "date": "2024-12-31", "importance": 5,
  "title": "Dã ngoại chào năm mới",
  "story": "Chiều 31/12/2024, cả nhà đi công viên chào năm mới. Yên khoác chiếc váy hồng chấm bi, tung tăng từ tảng đá chụp hình tới khu tượng máy bay. Cá được bế bổng lên “chạm thử” mũi máy bay. Năm mới đến với hai chị em bằng gió lạnh, váy hồng và tiếng cười không dứt — những tấm ảnh chụp khép lại một năm mà hai chị em lớn lên thấy rõ từng centimet.",
  "media": media("2024-12-31_27.webp","2024-12-31_31.webp","2024-12-31_34.webp","2024-12-31_37.webp","2024-12-31_40.webp","2024-12-31_43.webp"),
  "evidence": ["Contact sheet 012-013: dã ngoại công viên 31/12/2024"],
  "context": "Đi công viên chiều cuối năm dương lịch."
 },
 {
  "sceneId": "bm-ch11-khau-trang", "date": "2025-05-30", "importance": 3,
  "title": "Hai gương mặt khẩu trang",
  "story": "30/05/2025, hai chị em đeo khẩu trang to cùng màu, rồi thi nhau kéo lên tới tận mắt để chọc quê nhau. Vẻ mặt méo mó của Yên và cái cười hì hị của Cá sau lớp vải khiến người cầm máy không giữ nổi máy ảnh. Tối hôm đó không có chuyện gì “đáng kể” — và chính vì thế mà nó đáng nhớ.",
  "media": media("2025-05-30_2.webp","2025-05-30_4.webp","2025-05-30_6.webp","2025-05-30_8.webp"),
  "evidence": ["Contact sheet 013: đeo khẩu trang làm trò 30/05/2025"],
  "context": "Chơi đùa tại nhà với khẩu trang."
 },
 {
  "sceneId": "bm-ch12-yen-5-tuoi", "date": "2026-04-10", "importance": 5,
  "title": "Yên tròn năm tuổi",
  "story": "Tháng 04/2026, Yên ăn sinh nhật lần thứ năm tại nhà hàng thân quen: chiếc bánh hồng đặt giữa bàn, hai chị em đội vương miện giấy, Cá làm nhiệm vụ “phụ họ” thổi nến thay cho chị. Năm năm — từ một bé hay khóc trong vòng tay mẹ đã thành cô gái lớn biết nhường nhịn và lo cho em. Đèn phòng tắt dần, nến sáng lên, và tất cả những gì gia đình muốn giữ lại đã nằm gọn trong ảnh.",
  "media": media("2026-04-04.webp","2026-04-10_4.webp","2026-04-10_5.webp","2026-04-10_6.webp","2026-04-10_7.webp"),
  "evidence": ["Contact sheet 014-015: tiệc sinh nhật Yên 5 tuổi, bánh hồng + gia đình"],
  "context": "Tiệc sinh nhật 5 tuổi của Yên tại nhà hàng tháng 04/2026."
 },
 {
  "sceneId": "bm-ch13-yen-tap-viet", "date": "2025-07-29", "importance": 4,
  "title": "Yên tập viết những chữ đầu tiên",
  "story": "Cuối tháng 07/2025, Yên bốn tuổi bắt đầu tập viết. Video đầu tiên ghi lại bàn tay nhỏ cầm bút tô từng nét trên trang giấy trắng — chậm, cầu kỳ và cực kỳ nghiêm túc. Những ngày sau, em Cá ngồi kế bên “học theo” chị, hai chị em chụm đầu bên vở. Đây là chương mở đầu cho giai đoạn đến trường của Yên — và Cá, như thường lệ, luôn muốn làm mọi thứ chị đang làm.",
  "media": media("2025-07-29.mp4","2025-08-01.mp4","2025-08-01_1.mp4","2025-08-03.mp4","2025-08-03_1.mp4"),
  "evidence": ["Poster video nền giấy trắng đặc trưng của video tập viết 29/07-03/08/2025"],
  "context": "Video tập viết tại nhà cuối tháng 07 - đầu tháng 08/2025; khung đầu nền giấy trắng nên poster trắng."
 }
]



# Lời kể riêng cho từng tháng tuổi (tính theo tuổi Cá - em út), viết tay từ review.
MONTH_STORIES = {
    0: "Tháng 12/2022 — Cá chào đời, Yên hai tuổi rưỡi lần đầu được nằm cạnh em bé. Những ngày đầu chỉ có ăn, ngủ và hai chị em quấn quýt trên chiếu hoa.",
    1: "Tháng 01/2023 — cả nhà chụp bộ ảnh đầu tiên đủ bốn người; Yên học cách ôm em, Cá ngủ quấn tã hồng không rời mắt người lớn.",
    2: "Tháng 02/2023 — chiếc xe đẩy đôi ra mắt, Tết đầu tiên Cá biết ngắm đèn. Hai chị em bắt đầu có những giấc ngủ trưa chung trên đệm.",
    3: "Tháng 03/2023 — Cá ba tháng biết cười giòn với ống kính; Yên được tổ chức sinh nhật hai tuổi với vương miện, Cá làm khách mời nhỏ tuổi nhất.",
    4: "Tháng 04/2023 — Yên tròn hai tuổi giữa mùa hoa; Cá bốn tháng nằm hiếu kỳ nghe tiếng cả nhà hát chúc mừng.",
    5: "Tháng 05/2023 — những tấm “chị ôm em” dễ thương nhất: Yên gấu chụm Cá vào lòng, rồi hai chị em cùng đọc sách trên chiếu.",
    6: "Tháng 06/2023 — Cá sáu tháng cười toe với máy quay, lăn lộn trên gối; nhà mình có thêm những chuyến đi siêu thị đầu tiên.",
    7: "Tháng 07/2023 — Cá bảy tháng có những giấc ngủ say trên ngực ba; Yên khoác áo đỏ rực rỡ chụp cùng cụ.",
    8: "Tháng 08/2023 — Cá tám tháng tập ăn dặm với thìa cháo đầu tiên; cả nhà chụp bộ ảnh cùng “bạn thú” nhồi bông.",
    9: "Tháng 09/2023 — Cá chín tháng tóc chửa hai bên đứng trước gương cười hì hì, tập các tư thế nằm mới.",
    10: "Tháng 10/2023 — Cá mười tháng đeo kính gọng xanh ngầu lòi, mừng sinh nhật bằng xe đạp ba bánh và mũ thỏ hồng.",
    11: "Tháng 11/2023 — Cá trùm khăn trắng đi khắp nhà, Yên khoác váy hồng chạy xe đạp ba bánh trước sân.",
    12: "Tháng 12/2023 — Cá tròn một tuổi: có bánh, có hố bóng ở TTTM và những giấc ngủ đè lên nhau của hai chị em.",
    13: "Tháng 01/2024 — Yên “khách hàng tí hon” tự kéo xe đẩy siêu thị; Cá mười ba tháng ôm gối Doraemon ngủ một mình bản lĩnh.",
    14: "Tháng 02/2024 — dã ngoại công viên đầu năm: Yên tự xách túi, Cá ngồi xe shoper giơ hai tay sướng rơn.",
    15: "Tháng 03/2024 — Cá mười lăm tháng nằm ngủ trong nôi lắc, chân tay đạp liên hồi; Yên “nàng thơ” trên sofa.",
    16: "Tháng 04/2024 — Yên ba tuổi với bóng bay và bong bóng xà phòng; Cá mười sáu tháng ôm gối bông ngủ khò.",
    17: "Tháng 05/2024 — Yên ngồi “ngai vàng” nhân sinh nhật muộn; Cá mặc áo mưa xanh đeo kính vàng đi siêu thị.",
    18: "Tháng 06/2024 — Cá mười tám tháng có xe đạp hồng và mũ bảo hiểm riêng; Yên hóa công chúa Elsa ngày Tết thiếu nhi.",
    19: "Tháng 07/2024 — tháng có cú té ở Vũng Tàu (album riêng); hai chị em vẫn vậy — đau thì xoa, lành thì chơi tiếp. Yên tập gym cùng huấn luyện viên.",
    20: "Tháng 08/2024 — Yên và ba có buổi selfie nghịch ngợm; Cá ăn cơm cùng cả nhà ngon lành.",
    21: "Tháng 09/2024 — Cá hai mươi mốt tháng cầm bút chì màu vọc bảng vẽ, ngồi nghiêm túc như họa sĩ tập sự.",
    22: "Tháng 10/2024 — tháng có sự kiện đứt tay của Yên (album riêng); Cá hai mươi hai tháng ăn ngon ngủ yên bên gối My Melody.",
    23: "Tháng 11/2024 — Cá chạy xe máy điện cho Yên ngồi sau; hai chị em ôm nhau trước cửa nhà, cây Noel sớm đã lên nền nhà.",
    24: "Tháng 12/2024 — giao thừa dương lịch ở công viên với váy hồng và tượng máy bay; Cá hai tuổi khóc giữa chừng rồi lại cười.",
    25: "Tháng 01/2025 — Cá chế “mũ” từ thùng xốp; Yên bắt đầu những buổi học đầu năm với bảng màu và vở.",
    26: "Tháng 02/2025 — hai chị em lần lượt ốm rồi khỏe, có những giấc ngủ cuộn tròn dài nhất mùa đông.",
    27: "Tháng 03/2025 — Yên học viết với bà; Cá hai mươi bảy tháng nằm sàn nhà xoay tròn như chiếc chong chóng.",
    28: "Tháng 04/2025 — Yên đi giữa đám đông với mũ len hồng; Cá ôm gấu bông nâu ngủ suốt những đêm lành lạnh.",
    29: "Tháng 05/2025 — Yên đi siêu thị với váy đỏ nhún tự tin khoe váy; Cá hai mươi chín tháng nằm gối ôm khàn khò.",
    30: "Tháng 06/2025 — Cá hai mươi chín tháng gọi video với mẹ; Yên bốn tuổi nằm quạt điện pose đủ kiểu sau buổi học.",
    31: "Tháng 07/2025 — Yên tập viết những chữ đầu tiên, Cá ngồi kế “học theo”; hai chị em cùng chơi flashcard trên giường.",
    32: "Tháng 08/2025 — tiếp tuần tập viết: nét chữ ngày càng thẳng; áo mưa vàng ra sân trong cơn mưa đầu mùa.",
    33: "Tháng 09/2025 — Cá ba mươi ba tháng tóc ướt sau tắm cười tít mắt; Yên với vở tập viết dày thêm mấy trang.",
    35: "Tháng 11/2025 — Cá ba mươi lăm tháng ngồi xếp hình cả buổi; Yên ăn kem giữa những ngày lành lạnh.",
    36: "Tháng 12/2025 — Cá tròn ba tuổi, ôm quạt mini ngủ và cười to hơn xưa rất nhiều.",
    37: "Tháng 01/2026 — đêm hội xuống phố với váy trắng lấp lánh; hai chị em có buổi chụp filter hai chị em vui nhộn.",
    38: "Tháng 02/2026 — Valentine Yên tập đánh đàn; dã ngoại bộ đồ hồng trước thác nước nhân tạo.",
    39: "Tháng 03/2026 — Cá ba mươi chín tháng đội mũ mèo hồng đi chơi; hai chị em phụ mẹ trong bếp.",
    40: "Tháng 04/2026 — Yên tròn năm tuổi với bánh hồng và ánh đèn vàng; Cá bốn mươi tháng “phụ họ” thổi nến cho chị.",
    43: "Tháng 07/2026 — những ngày gần nhất: Cá bốn mươi ba tháng tự tin hơn, Yên năm tuổi đầm hồng chăm em. Hành trình hai chị em vẫn đang được viết tiếp."
}

BIRTH = (2022, 12, 8)


def month_at(iso):
    y, m, d = map(int, iso.split("-"))
    return (y - BIRTH[0]) * 12 + m - BIRTH[1] - (1 if d < BIRTH[2] else 0)


def date_label(iso):
    y, m, d = iso.split("-")
    return f"{d}/{m}/{y}"


def build_months(items):
    from collections import defaultdict
    grouped = defaultdict(list)
    for item in items:
        grouped[month_at(item["date"])].append(item)
    months = []
    for month in sorted(grouped):
        entries = grouped[month]
        story = MONTH_STORIES.get(month)
        if not story:
            story = f"Tháng tuổi {month}: những kỷ niệm của hai chị em từ " + date_label(entries[0]["date"]) + " đến " + date_label(entries[-1]["date"]) + "."
        months.append({"ageMonth": month, "story": story,
                       "evidence": [e["src"] for e in entries[:3]]})
    return months


def manifest_items():
    manifest_path = BASE / "data" / "media-manifest.js"
    raw = manifest_path.read_text(encoding="utf-8")
    data = json.loads(raw.replace("window.BABY_MEDIA_MANIFEST = ", "").rstrip().rstrip(";"))
    return data["items"]


def main() -> None:
    missing = []
    for event in EVENTS:
        for src in event["media"]:
            rel = ROOT / src.replace("./", "BabyMix/")
            if not rel.exists():
                missing.append(src)
    if missing:
        raise SystemExit("Missing media:\n" + "\n".join(missing))
    items = manifest_items()
    out = {
        "version": 3,
        "reviewed": {"images": 552, "videos": 159,
                     "method": "contact sheets images 000-015 + posters 000-004, reviewed 2026-09-06; months 2026-09-06"},
        "months": build_months(items),
        "events": EVENTS,
        "milestones": [],
        "excludePreview": [],
        "previewCandidates": [],
    }
    dest = BASE / "data" / "story-observations.js"
    dest.write_text("window.BABY_STORY_OBSERVATIONS = " + json.dumps(out, ensure_ascii=False, indent=2) + ";\n",
                    encoding="utf-8")
    total = sum(len(e["media"]) for e in EVENTS)
    print(f"{len(EVENTS)} chapters, {total} media — all paths verified")


if __name__ == "__main__":
    main()
