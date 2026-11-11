# Kage — The Last Light

Situs visual fiktif tentang seorang ronin di bawah matahari merah. Dibangun dengan
React 19 dan Vite 7, tanpa library animasi: semua gerak memakai CSS, Web Animations
dan satu handler scroll per bagian.

## Menjalankan

```bash
npm ci
npm run dev
```

Build produksi: `npm run build`, lalu `npm run preview`.

## Isi halaman

| Bagian | Id | Keterangan |
| --- | --- | --- |
| Hero | `#top` | Tiga lapis parallax, bara melayang, judul muncul per huruf |
| Kisah | `#story` | Pengantar dan gambar yang terbuka seperti matahari terbit |
| Gerhana | `#eclipse` | Matahari tumbuh menelan layar, lalu berbalik ke malam |
| Bab | `#chapters` | Daftar bab dan tombol lanjut membaca |
| Suasana | `#hour` | Senja, sisa bara, malam: mengubah seluruh warna halaman |
| Tokoh | `#characters` | Empat tokoh dengan panel yang berganti |
| Dunia | `#world` | Glosarium berkanji |
| Storyboard | `#storyboard` | Panel menyamping yang digerakkan scroll vertikal |
| Perjalanan | `#journey` | Rute yang tergambar mengikuti scroll |
| Kabari aku | `#join` | Form demo, hanya tersimpan di perangkat |
| Bingkai | `#gallery` | Galeri dengan lightbox |

## Pintasan keyboard

`R` baca bab terakhir, `1` `2` `3` ganti suasana, `←` `→` pindah bab di pembaca,
`?` tampilkan daftar pintasan.

## Struktur

- `src/App.jsx` merangkai halaman dan state global (suasana, pembaca).
- `src/components/` satu komponen per bagian, masing-masing dengan file CSS sendiri.
- `src/content/` teks bab dan dunia cerita.
- `src/styles.css` token warna per suasana (`.site-shell[data-hour]`) dan gaya dasar.

## Aksesibilitas dan gerak

Semua animasi besar mati saat `prefers-reduced-motion: reduce`. Bagian yang di-pin
berubah menjadi susunan vertikal biasa pada layar di bawah 680px.
