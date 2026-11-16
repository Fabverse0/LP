# Arah desain Kage

## Pembacaan

Kisah visual fiktif untuk pembaca cerita, bergaya sinematik editorial.
Dial: ENERGY 3 / RHYTHM 3 / MOTION 3.

## Identitas

- **Motif:** kanji 影 (kage, bayangan). Muncul di intro, hero, dan daftar bab.
- **Aksen:** merah matahari (`--red-bright`), dipakai pada satu tindakan utama per layar.
- **Warna:** malam (`--night`), biru dingin (`--blue`), merah (`--red`), kertas (`--paper`),
  kertas merah muda (`--pink-paper`). Seluruhnya berubah mengikuti suasana
  senja, sisa bara, atau malam melalui `.site-shell[data-hour]`.
- **Huruf:** Libre Franklin 700 untuk judul (rapat, huruf kapital, pelacakan negatif),
  Source Serif 4 untuk teks. Alasan: judul tebal terbaca dari jauh di atas gambar,
  serif menjaga bacaan panjang nyaman.
- **Bentuk:** sudut tajam, tanpa kartu membulat. Warna datar menjadi bidang penuh.

## Alasan komposisi

- Setiap bagian adalah satu bab warna dengan komposisinya sendiri, bukan template
  judul tengah plus kartu seragam (RHYTHM 3).
- Gerak besar hanya di tiga tempat: hero, gerhana matahari, storyboard menyamping.
  Sisanya tenang (MOTION 3 berarti terarah, bukan di mana-mana).
- Satu gambar sumber dipakai ulang dengan potongan berbeda, jadi cerita terasa
  satu dunia.

## Batas yang dijaga

- Tidak ada statistik, testimoni, atau klaim yang dibuat-buat. Angka di halaman
  (jumlah bab, menit baca) dihitung dari konten sebenarnya.
- Form "Kabari aku" adalah demo dan mengatakannya terang-terangan.
- Semua gerak berhenti saat `prefers-reduced-motion: reduce`.
- Tanpa em dash di teks yang tampil.
