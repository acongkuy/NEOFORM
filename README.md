# NEOFORM

![Logo Neoform](public/neoform-v3.png)

**Neoform** adalah aplikasi web untuk membuat formulir, membagikannya melalui tautan atau QR code, lalu mengelola jawaban dalam satu dashboard.

- **Demo web:** [neoform.chunsky.biz.id](https://neoform.chunsky.biz.id)
- **Aplikasi Android:** [Unduh APK](public/neoform.apk)
- **Pengembang:** Chunsky X ANTISUKI

## Tentang proyek

Neoform menyederhanakan alur pengumpulan data: pembuat formulir menyusun pertanyaan sesuai kebutuhan, membagikan formulir kepada responden, kemudian meninjau dan mengunduh hasilnya. Formulir dapat disesuaikan tampilannya dan diisi melalui halaman publik.

## Fitur utama

- **Pembuat formulir visual:** tambah, edit, duplikasi, hapus, dan susun ulang pertanyaan dengan drag-and-drop. Tersedia pratinjau untuk tampilan desktop, tablet, dan ponsel.
- **20 jenis pertanyaan dan elemen:** teks pendek, paragraf, angka, email, telepon, URL, tanggal, waktu, tanggal dan waktu, checkbox, pilihan ganda, dropdown, unggah file, rating, skala linear, ya/tidak, bagian, pemisah, judul, dan deskripsi.
- **Validasi jawaban:** tandai pertanyaan wajib, atur placeholder dan teks bantuan, serta tambahkan batas panjang, batas angka, dan pola masukan.
- **Kustomisasi formulir:** atur warna tema, warna latar, logo, foto, pesan setelah pengiriman, dan dekorasi.
- **Pengumpulan dan pengelolaan jawaban:** formulir publik menerima jawaban, sementara pemilik dapat mencari, melihat detail, menghapus, dan mengekspor jawaban ke Excel.
- **Berbagi formulir:** bagikan tautan atau QR code. Pengguna juga dapat berteman menggunakan UID, mengirim salinan formulir, dan mengimpor formulir yang dibagikan.
- **Akun dan preferensi:** daftar dan masuk dengan email/password atau Google, reset password, serta pilih tema terang atau gelap.
- **Pusat bantuan dan kabar:** panduan tersedia dalam bahasa Indonesia dan Inggris; pengumuman produk tampil di dalam aplikasi.
- **Unggah file ke Google Drive:** tersedia melalui endpoint Google Apps Script yang dikonfigurasi untuk proyek.

## Teknologi

- React 18 dan Vite 5
- Tailwind CSS
- Firebase Authentication dan Cloud Firestore
- React Router
- dnd-kit untuk drag-and-drop
- Framer Motion untuk animasi
- `xlsx` untuk ekspor Excel
- `qrcode.react` untuk QR code
- Google Apps Script sebagai penghubung opsional untuk unggah file ke Google Drive

## Menjalankan secara lokal

### Prasyarat

- Node.js 18 atau lebih baru
- npm
- Proyek Firebase dengan Authentication dan Cloud Firestore aktif

### Instalasi

```bash
git clone <URL_REPOSITORI>
cd neoform
npm install
```

Buat file `.env` di direktori proyek dan isi konfigurasi Firebase Web App:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Untuk mengaktifkan unggah file ke Google Drive, tambahkan URL deployment Google Apps Script:

```dotenv
VITE_APPS_SCRIPT_URL=
```

> Aktifkan metode masuk Email/Password dan Google pada Firebase Authentication. `authDomain` saat ini ditetapkan sebagai `auth.chunsky.biz.id` di `src/firebase/config.js`; sesuaikan dengan konfigurasi Firebase milik Anda bila menjalankan salinan proyek. Indeks Firestore yang dipakai aplikasi tersedia di `firestore.indexes.json`.

Jalankan server pengembangan:

```bash
npm run dev
```

## Perintah proyek

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan Vite |
| `npm run build` | Membuat build produksi di direktori `dist` |
| `npm run preview` | Meninjau build produksi secara lokal |

## Cara menggunakan

1. Daftar atau masuk ke Neoform.
2. Buat formulir, tambahkan pertanyaan, lalu atur tampilan dan validasinya.
3. Simpan formulir dan bagikan tautan atau QR code kepada responden.
4. Buka bagian respons pada dashboard untuk meninjau, mencari, atau mengekspor jawaban ke Excel.

## Struktur proyek

```text
src/
├── components/   # Builder, formulir, navigasi, modal, dan komponen UI
├── constants/    # Tipe dan nilai awal pertanyaan
├── context/      # State autentikasi dan tema
├── data/         # Konten bantuan
├── firebase/     # Konfigurasi Firebase, autentikasi, dan akses Firestore
├── pages/        # Halaman aplikasi dan formulir publik
├── services/     # Operasi formulir, respons, teman, berita, dan unggah file
└── utils/        # Validasi, format, ID, dan pembatasan percobaan lokal
```

Vercel dapat digunakan untuk deployment; `vercel.json` mengarahkan rute aplikasi kembali ke `index.html` agar halaman React Router dapat dibuka langsung.
