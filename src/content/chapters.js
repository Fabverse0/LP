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
