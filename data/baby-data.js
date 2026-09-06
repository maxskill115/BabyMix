(function () {
  "use strict";
  const milestone = (id, month, order, title, subtitle, description, sourceDate) => ({
    id, month, order, type: "milestone", importance: 3, layout: order % 2 ? "right-media" : "left-media",
    align: order % 2 ? "right" : "left", title, subtitle, description, sourceDate, media: []
  });
  window.BABY_DISCOVERY_DATA = {
    version: "1.0.0", technicalBabyId: "babymix",
    profile: {
      id: "yen-ca", sourceId: "babymix", sourceAlias: "Hai chị em", name: "Yên & Cá", initials: "YC",
      hanzi: "秦邃嫣 · 秦懿奎",
      birthDate: "2022-12-08", birthTime: "07:10", birthLunar: "15/11/2022", birthLunarLabel: "Âm lịch Cá · ngày rằm",
      accent: "#E98EB8", accentWarm: "#4F9271", backgroundAsset: "./assets/babymix/ui/journey-background.webp",
      shortBio: "Hai chị em Yên và Cá — cách nhau 20 tháng 4 ngày về tháng tuổi, nhưng năm sinh chỉ lệch đúng một con số: 2021 và 2022. Lớn lên chung nhà, chung từng chuyến đi và cả những lần nghịch ngợm.",
      nameMeaning: "Yên (邃嫣): xinh đẹp, diễm lệ, luôn tươi cười. Cá (懿奎): trí tuệ, nghị lực, tỏa sáng như sao Khuê. Hai chị em — một bên dịu dàng tươi sáng, một bên thông minh lanh lợi.",
      personality: ["Chị Yên dịu dàng", "Em Cá lanh lợi", "Cùng nghịch", "Cùng đi chơi", "Ít khi ngồi yên"],
      strengths: ["Vui vẻ", "Gắn bó", "Khám phá"], interests: ["Đi chơi cùng nhau", "Đồ chơi lắp ghép", "Xe đạp", "Vẽ và tô"]
    },
    sisters: [
      { id: "yen", name: "Yên", hanzi: "秦邃嫣", birthDate: "2021-04-04", birthTime: "16:00", accent: "#E98EB8",
        meaning: "Học sâu hiểu rộng, tinh thông, sâu sắc; xinh đẹp, diễm lệ, yên nhiên luôn tươi cười." },
      { id: "ca", name: "Cá", hanzi: "秦懿奎", birthDate: "2022-12-08", birthTime: "07:10", accent: "#4F9271",
        meaning: "Trí tuệ, nghị lực, văn chương học thuật, tỏa sáng tựa sao Khuê." }
    ],
    backgrounds: [
      {id:"sisters-start",fromMonth:-12,toMonth:6,label:"Chào em Cá",gradient:"radial-gradient(circle at 18% 20%,rgba(233,142,184,.38),transparent 32%),radial-gradient(circle at 82% 22%,rgba(79,146,113,.24),transparent 30%),linear-gradient(#fdf9f3,#f7f1e8)"},
      {id:"sisters-play",fromMonth:6,toMonth:18,label:"Cùng lớn",gradient:"radial-gradient(circle at 78% 16%,rgba(233,142,184,.30),transparent 30%),radial-gradient(circle at 20% 24%,rgba(121,176,141,.26),transparent 30%),linear-gradient(#fdf9f3,#f5efe4)"},
      {id:"sisters-explore",fromMonth:18,toMonth:30,label:"Cùng khám phá",gradient:"radial-gradient(circle at 22% 18%,rgba(79,146,113,.22),transparent 30%),radial-gradient(circle at 80% 26%,rgba(233,142,184,.26),transparent 30%),linear-gradient(#fdf9f3,#f4ede1)"},
      {id:"sisters-school",fromMonth:30,toMonth:120,label:"Lớn khôn cùng nhau",gradient:"radial-gradient(circle at 18% 22%,rgba(233,142,184,.20),transparent 30%),radial-gradient(circle at 82% 18%,rgba(79,146,113,.20),transparent 30%),linear-gradient(#fdf9f3,#f2eade)"}
    ],
    health: [],
    scenes: [
      {id:"bm-dieudacbiet-20-thang",month:0,order:-1,type:"memory",importance:4,layout:"hero",align:"center",eyebrow:"ĐIỀU ĐẶC BIỆT CỦA HAI CHỊ EM",title:"20 tháng — và chỉ một con số 1",description:"Yên sinh ngày 04/04/2021, Cá sinh ngày 08/12/2022. Hai chị em cách nhau đúng 20 tháng 4 ngày — gần hai năm — nhưng nhìn theo năm sinh thì chỉ lệch đúng một con số 1: 2021 và 2022. Vậy nên dù chênh nhau gần hai tuổi rưỡi theo tháng, về “tuổi năm sinh” hai chị em chỉ cách nhau đúng một tuổi: sau này đến trường, hai chị em cũng chỉ lệch nhau đúng một lớp — để cùng đi, cùng học, cùng lớn theo nhịp gần nhau nhất có thể.",sourceRole:"user-confirmed",media:[]},
      {id:"bm-sisters-birth",month:0,order:0,type:"birth",importance:5,layout:"hero",align:"center",date:"2022-12-08",eyebrow:"08 · 12 · 2022",title:"Chào em Cá",subtitle:"Yên chính thức làm chị",description:"Ngày 08/12/2022, Cá (Ý Khuê) chào đời lúc 07:10 sáng. Từ ngày ấy, Yên có thêm một cô em gái và nhà mình có thêm một tiếng cười rộn ràng hơn. Từ thời điểm này, mọi kỷ niệm đều là của hai chị em.",sourceRole:"user-confirmed",media:[]}
    ]
  };
})();
