# Catatan perubahan

## Putaran 7

- Peta perjalanan memakai judul, catatan, dan status dari daftar bab.
- Angka besar di storyboard diberi label "Adegan" agar tidak terbaca sebagai nomor bab.
- Tautan `#baca/<id>` yang ditempel di halaman terbuka kini langsung membuka bab.
- Fokus keyboard pindah ke judul daftar bab setelah jejak baca dihapus.
- Pengujian baru menjaga peta, fallback tanpa JavaScript, dan manifest tetap sesuai konten.

## Putaran 6

- Tombol baca di header dan hero berubah menjadi "Lanjutkan" bila ada jejak baca.
- Tombol huruf `H` `K` `B` `T` `D` `G` melompat antarbagian, dan tidak aktif saat dialog terbuka.
- Pengujian otomatis (`npm test`) untuk daftar bab dan penyimpanan jejak baca.
- Aturan cetak tanpa elemen tetap dan efek gerak, teks hitam agar terbaca tanpa warna latar.
- Kanji hero disembunyikan di jendela pendek, semua kanji bertanda `lang="ja"`.
- `engines` mewajibkan Node 20 atau lebih baru.

## Putaran 5

- Tombol "Lanjutkan" menampilkan persen progres bab.
- Kerangka kanji di hero mengikuti warna suasana.
- Tombol "Hapus jejak baca" (dua langkah) membersihkan bab terakhir, penanda selesai, dan posisi gulir.

## Putaran 4

- Pembaca membuka bab di posisi terakhir dibaca (`kage:scroll` di `localStorage`).
- Tombol "Salin tautan bab" di akhir bab, memakai tautan `#baca/<id>`.
- Gambar hasil potongan di bawah hero dimuat malas.
- Ikon aplikasi terpasang punya pintasan "Baca bab pertama".
- `npm run check` menjalankan build produksi.
- Fallback tanpa JavaScript menampilkan daftar bab yang terbuka.

## Putaran 3

- Motif kanji 影 di hero, baris meta bab terbuka dan menit baca.
- Penanda "Selesai" di daftar bab, tautan langsung `#baca/<id>`.
- Halaman error saat render gagal, chunk React terpisah.
- `DESIGN.md` memuat arah desain dan dial-nya.

## Putaran 2

- Tombol baca utama dan petunjuk gulir di hero.
- Warna bar browser dan scrollbar mengikuti suasana.
- Judul tab mengikuti bab yang dibaca, baris kredit di footer.

## Putaran 1

- Pembaca multi-bab, daftar bab, tokoh, glosarium, peta perjalanan, galeri.
- Gerhana matahari, storyboard menyamping, bara hero, tirai intro.
- Header lengket, form "Kabari aku" (demo), metadata SEO.
