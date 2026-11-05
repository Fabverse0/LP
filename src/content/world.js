// Isi dunia Kage: tokoh, istilah, jalur perjalanan, dan larik pendek.
// Semua teks mengikuti nada bab pertama: tenang, kalimat pendek.

export const characters = [
  {
    id: "ronin",
    name: "Kage",
    role: "Sang ronin",
    kanji: "影",
    reading: "kage · bayangan",
    bio: [
      "Ia melepas lambang tuannya siang tadi dan menyimpan kainnya di dasar kantong.",
      "Kakinya masih mengikuti perintah orang yang telah mati, sampai sebuah roda tersangkut di lumpur.",
    ],
    quote: "Jalan tidak memutuskan apa pun. Aku yang belum berani.",
    image: {
      src: "/images/kage-ronin-4k.webp",
      alt: "Siluet ronin berdiri di rumput gelap menghadap matahari merah.",
      position: "50% 58%",
    },
  },
  {
    id: "perempuan",
    name: "Perempuan bergerobak",
    role: "Penarik roda",
    kanji: "車",
    reading: "kuruma · roda",
    bio: [
      "Ia menarik gerobak berisi jeruk menuju desa di tepi sungai.",
      "Ia tidak meminta bantuan, tetapi tidak menolak tangan yang datang.",
    ],
    quote: "Ambillah. Jeruk ini tidak akan sampai ke pasar tanpa rodamu.",
    image: {
      src: "/images/kage-landscape-4k.webp",
      alt: "Ladang luas di bawah langit senja, jalan turun menuju pepohonan.",
      position: "22% 70%",
    },
  },
  {
    id: "anak",
    name: "Anak berlentera",
    role: "Penjaga cahaya",
    kanji: "灯",
    reading: "tomoshibi · nyala",
    bio: [
      "Ia memeluk lentera yang belum menyala sepanjang jalan.",
      "Saat roda terangkat, ia menyalakannya dan melindungi sumbunya dengan dua tangan.",
    ],
    quote: "Kalau gelap datang, kita sudah punya cahaya.",
    image: {
      src: "/images/kage-grass-layer.webp",
      alt: "Helai rumput tinggi dalam bayangan senja.",
      position: "70% 85%",
    },
  },
  {
    id: "tuan",
    name: "Sang tuan",
    role: "Yang telah mati",
    kanji: "主",
    reading: "nushi · tuan",
    bio: [
      "Ia menuliskan perintah terakhir: capai celah gunung sebelum malam.",
      "Ia tidak pernah muncul, tetapi suaranya mengikuti setiap langkah.",
    ],
    quote: "Sebelum malam. Celah gunung. Jangan berhenti.",
    image: {
      src: "/images/kage-landscape-4k.webp",
      alt: "Matahari merah besar tenggelam di balik punggung gunung.",
      position: "50% 30%",
    },
  },
];

export const glossary = [
  {
    id: "ronin",
    term: "Ronin",
    kanji: "浪人",
    romaji: "rōnin",
    meaning:
      "Samurai tanpa tuan. Kata itu berarti orang yang terombang-ambing seperti ombak. Kage menjadi ronin pada hari tuannya mati, tetapi baru merasakannya di persimpangan.",
  },
  {
    id: "kamon",
    term: "Kamon",
    kanji: "家紋",
    romaji: "kamon",
    meaning:
      "Lambang keluarga yang dijahit di pakaian. Kage melepasnya siang tadi. Bekas jahitannya masih terlihat, seperti nama yang belum benar-benar hilang.",
  },
  {
    id: "celah-gunung",
    term: "Celah gunung",
    kanji: "峠",
    romaji: "tōge",
    meaning:
      "Titik tertinggi jalur pendakian, tempat satu lembah berganti ke lembah lain. Perintah terakhir menunjuk ke sana. Kabut menutupnya sebelum senja habis.",
  },
  {
    id: "sumpah",
    term: "Sumpah",
    kanji: "誓い",
    romaji: "chikai",
    meaning:
      "Janji yang diucapkan kepada tuan. Ia tidak berakhir saat tuannya mati. Ia hanya berubah menjadi pertanyaan.",
  },
  {
    id: "lentera",
    term: "Lentera",
    kanji: "提灯",
    romaji: "chōchin",
    meaning:
      "Lampu kertas yang dibawa dengan tangan. Cahayanya kecil dan pucat di bawah langit merah. Cukup untuk melihat langkah berikutnya.",
  },
  {
    id: "jalan-sungai",
    term: "Jalan sungai",
    kanji: "川沿い",
    romaji: "kawazoi",
    meaning:
      "Jalur tanah yang turun ke pepohonan di tepi air. Tidak ada perintah yang menunjuk ke sana. Kage memilihnya sendiri.",
  },
  {
    id: "jeruk",
    term: "Jeruk",
    kanji: "蜜柑",
    romaji: "mikan",
    meaning:
      "Buah dingin yang sedikit penyok, diberikan tanpa kata. Imbalan pertama yang diterima Kage bukan dari seorang tuan.",
  },
  {
    id: "senja",
    term: "Senja",
    kanji: "黄昏",
    romaji: "tasogare",
    meaning:
      "Waktu ketika wajah sulit dikenali dari kejauhan. Di jam itulah semua keputusan dalam cerita ini diambil.",
  },
];
