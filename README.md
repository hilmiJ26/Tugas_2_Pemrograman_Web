# SITTA UT - Sistem Informasi Bahan Ajar Universitas Terbuka (Tugas 2 - Vue.js)

Aplikasi web **SITTA UT** (Sistem Informasi Bahan Ajar Universitas Terbuka) ini merupakan pengembangan lanjutan dari Tugas 1, di mana seluruh logika aplikasi dan manajemen antarmuka (*UI*) telah direfaktor menggunakan **Vue.js 2 (via CDN)** dengan mempertahankan struktur aset dan ruang lingkup proyek asli.

---

## 🚀 Fitur Utama & Modul Aplikasi

Proyek ini terbagi menjadi dua halaman utama modul fungsional:

### 1. Halaman Stok Bahan Ajar (`stok.html`)
* **Daftar Stok Dinamis**: Menampilkan seluruh data bahan ajar berdasarkan kolom data field (Kode/Nama, Kategori, UT-Daerah, Lokasi Rak, Jumlah Stok, Safety Stock, Status, dan Catatan HTML).
* **Fitur Edit Stok**: Memungkinkan pengguna memperbarui jumlah stok (*qty*) secara langsung dan reaktif pada baris tabel.
* **Filter & Sort Kompleks**:
  * **Filter UT-Daerah**: Memilih data berdasarkan wilayah UPBJJ-UT.
  * **Dependent Options Kategori**: Filter kategori mata kuliah baru akan aktif dan muncul setelah pengguna memilih wilayah UT-Daerah terlebih dahulu.
  * **Filter Re-order**: Filter cepat untuk mendeteksi stok bahan ajar yang menipis (`qty < safety`) dan stok kosong (`qty === 0`).
  * **Sorting Data**: Mengurutkan daftar berdasarkan Judul Mata Kuliah (A-Z), Jumlah Stok, dan Harga.
  * **Reset Filter**: Tombol untuk mengembalikan seluruh pengaturan filter dan pengurutan ke kondisi awal.
  * **Optimasi Kinerja**: Seluruh proses filter dan sort dikelola secara efisien menggunakan Vue `computed property` tanpa *recompute* berlebihan.
* **Indikator Status Stok Visual**:
  * 🟢 **Aman**: Ditampilkan dengan teks hijau jika stok mencukupi ($\text{stok} \ge \text{safety}$).
  * 🟠 **Menipis**: Ditampilkan dengan teks orange jika stok di bawah batas aman ($\text{stok} < \text{safety}$).
  * 🔴 **Kosong**: Ditampilkan dengan teks merah jika stok habis ($\text{stok} = 0$).
* **Formulir Tambah Data & Validasi Interaktif**: Form kecil untuk menambah bahan ajar baru dengan penanganan error teks merah secara dinamis apabila terdapat field kosong atau bernilai negatif.

### 2. Tracking Delivery Order / DO (`tracking.html`)
* **Pencarian Nomor DO**: Memungkinkan pengguna melacak status pengiriman paket bahan ajar mahasiswa berdasarkan nomor DO.
* **Nomor DO Otomatis**: Penomoran DO tergenerate secara otomatis dengan format:  
  `DO[Tahun Berjalan]-[Sequence Number]` (Contoh: `DO2026-0001`).
* **Formulir Tambah Delivery Order Baru**:
  * Input manual untuk **NIM** dan **Nama Mahasiswa**.
  * Pemilihan **Ekspedisi** pengiriman.
  * Pemilihan **Paket Bahan Ajar** menggunakan elemen `<select>` yang memuat kode dan nama paket.
  * **Detail Paket Dinamis**: Otomatis menampilkan rincian isi modul/mata kuliah serta total harga paket di bawah pilihan setelah paket dipilih.
  * Tanggal kirim otomatis berdasarkan waktu lokal sistem.

---

## 🛠️ Teknologi yang Digunakan

* **HTML5 & CSS3**: Menggunakan struktur dan file tata letak (*stylesheet*) yang diselaraskan dari Tugas 1 (`css/style.css`).
* **Vue.js 2 (UMD / CDN)**: Framework JavaScript reaktif untuk menangani *data binding*, *computed properties*, *watchers*, dan manajemen *state*.
* **JavaScript (ES6+)**: Logika aplikasi modular terpisah dari tampilan.

---

## 📂 Struktur Direktori Proyek

```text
/tugas2-vue-ut/
├── index.html           # Beranda utama / navigasi modul
├── stok.html            # Modul Informasi Stok & Manajemen (Vue.js)
├── tracking.html        # Modul Tracking Delivery Order (Vue.js)
├── css/
│   └── style.css        # Lembar gaya (Stylesheet) utama
├── js/
│   ├── dataBahanAjar.js # Sumber data dummy global (window object)
│   ├── stok-app.js      # Logika & ViewModel Vue.js untuk halaman stok
│   └── tracking-app.js  # Logika & ViewModel Vue.js untuk halaman tracking
├── assets/
│   └── ut.png           # Logo resmi Universitas Terbuka
└── img/
    └── (Kumpulan file gambar cover buku bahan ajar)
