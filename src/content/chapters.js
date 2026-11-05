import { firstChapter } from "./chapter.js";

export const chapters = [
  {
    id: "jalan-tanpa-tuan",
    number: 1,
    kanji: "道",
    status: "available",
    ...firstChapter,
  },
  {
    id: "sungai-yang-sama",
    number: 2,
    title: "Sungai yang sama",
    kanji: "川",
    intro: "Jembatan telah dirobohkan. Perintah orang mati masih berjalan.",
    paragraphs: [
      "Bekas roda itu membawanya menyusuri sungai. Malam turun pelan. Air bergerak di sebelah kanannya, gelap dan tidak pernah berhenti, membawa daun dan potongan kayu ke arah yang sama dengan langkahnya.",
      "Ia menemukan mereka lagi di dekat jembatan kayu. Gerobak berhenti di tepi tebing. Lentera anak itu tergantung di ujung pegangan, menerangi papan-papan yang patah di tengah jembatan. Pada tiang-tiangnya ada bekas kapak.",
      "Perempuan itu tidak terkejut melihatnya. Ia hanya berkata bahwa jembatan itu masih utuh tiga hari lalu. Ronin itu memeriksa ujung kayu yang terputus. Potongannya rapi. Dibuat oleh orang yang terbiasa menerima perintah dan menjalankannya tanpa bertanya.",
      "Ia tahu perintah itu. Tuannya pernah berkata bahwa jalan di sebelah sungai harus diputus jika musuh mendekat. Desa di hilir dikosongkan. Jembatan dirobohkan. Lumbung dibiarkan. Kata-kata itu diucapkan di ruangan yang hangat, di depan peta yang rapi. Musuh tidak pernah datang. Tuannya mati lebih dulu. Perintahnya tetap berjalan.",
      "Anak itu bertanya apakah sungai ini sama dengan sungai di dekat rumah mereka. Ibunya mengangguk. Rumah mereka di hilir, katanya, sudah tidak ada. Mereka hendak ke rumah saudara di seberang, di desa yang belum menerima kabar apa pun.",
      "Mereka mencari bagian yang dangkal. Ronin itu berjalan lebih dulu di air setinggi lutut, menusuk dasar sungai dengan tongkat untuk mencari batu yang tidak bergeser. Airnya sangat dingin. Di belakangnya, perempuan itu menuntun gerobak, dan anaknya mengangkat lentera tinggi-tinggi, seperti orang yang menjaga sesuatu agar tetap kering.",
      "Di tengah sungai roda tersangkut lagi. Kali ini tidak ada yang menunggu. Ia menyelipkan bahunya di bawah papan gerobak dan mendorong. Perempuan itu menarik. Arus menggeser mereka ke hilir, sedikit demi sedikit, sampai roda terlepas dan naik ke batu yang lebih tinggi.",
      "Di seberang, mereka menyalakan api kecil dari ranting kering. Perempuan itu memeras ujung kainnya. Ia memandang ronin itu lebih lama dari sebelumnya, lalu bertanya dari rumah mana ia berasal. Pertanyaan itu sederhana. Jawabannya tidak.",
      "Ia menyebut nama rumah tuannya. Perempuan itu diam. Anak itu memandang ibunya, lalu memandang pedang yang tergeletak di dekat api. Lentera berkedip sekali. Tidak ada yang bergerak menjauh. Tetapi tidak ada pula yang bergerak mendekat.",
      "Malam itu ia tidur di sisi lain api, menghadap sungai. Air terus datang dari arah desa yang telah dikosongkan. Ia mendengarkannya lama. Sungai yang sama, pikirnya. Membawa apa saja yang dilemparkan ke dalamnya, tanpa bertanya siapa yang melempar.",
    ],
    status: "available",
  },
  {
    id: "bulan-baru",
    number: 4,
    title: "Bulan baru",
    kanji: "月",
    intro: "Desa memutuskan siapa yang pergi dan siapa yang tinggal.",
    paragraphs: [],
    status: "soon",
  },
  {
    id: "celah-gunung",
    number: 5,
    title: "Celah gunung",
    kanji: "峠",
    intro: "Jalan yang ditinggalkan kemarin masih menunggu jawabannya.",
    paragraphs: [],
    status: "soon",
  },
];

export const availableChapters = chapters.filter((chapter) => chapter.status === "available");

export function getChapter(id) {
  return chapters.find((chapter) => chapter.id === id);
}
