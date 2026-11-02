"use strict";

document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
    data: {
      upbjjList:
        typeof upbjjList !== "undefined"
          ? upbjjList
          : ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
      kategoriList:
        typeof kategoriList !== "undefined"
          ? kategoriList
          : ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
      stok: typeof stok !== "undefined" ? stok : [],

      // Filter & Sorting state
      selectedUpbjj: "",
      selectedKategori: "",
      filterReorderType: "",
      sortBy: "",

      // Edit state
      editIndex: null,
      editForm: { qty: 0 },

      // Form tambah data baru
      formNew: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      },
      errors: {},
      pesanFeedback: "",
      pesanClass: "",
    },
    computed: {
      // Computed property untuk memfilter dan mengurutkan data stok tanpa recompute berlebih
      filteredStok: function () {
        let result = this.stok;

        // Filter berdasarkan UT-Daerah (UPBJJ)
        if (this.selectedUpbjj) {
          result = result.filter((item) => item.upbjj === this.selectedUpbjj);
        }

        // Filter berdasarkan Kategori (dependent option)
        if (this.selectedKategori) {
          result = result.filter(
            (item) => item.kategori === this.selectedKategori,
          );
        }

        // Filter berdasarkan kebutuhan Re-order (Menipis atau Kosong)
        if (this.filterReorderType === "menipis") {
          result = result.filter(
            (item) => item.qty < item.safety && item.qty > 0,
          );
        } else if (this.filterReorderType === "kosong") {
          result = result.filter((item) => item.qty === 0);
        }

        // Sorting data
        if (this.sortBy === "judul") {
          result = result
            .slice()
            .sort((a, b) => a.judul.localeCompare(b.judul));
        } else if (this.sortBy === "qty") {
          result = result.slice().sort((a, b) => a.qty - b.qty);
        } else if (this.sortBy === "harga") {
          result = result.slice().sort((a, b) => a.harga - b.harga);
        }

        return result;
      },
    },
    watch: {
      // Watcher 1: Memantau perubahan pada pilihan UT-Daerah untuk mereset kategori jika daerah diubah
      selectedUpbjj: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.selectedKategori = "";
        }
      },
      // Watcher 2: Memantau jumlah total item pada filteredStok untuk memberikan log / notifikasi di console
      filteredStok: function (newList) {
        console.log(
          "Filter atau data berubah. Jumlah item ditampilkan saat ini: " +
            newList.length,
        );
      },
    },
    methods: {
      onUpbjjChange: function () {
        // Handler ketika UT-Daerah diubah (memicu dependent options)
        this.selectedKategori = "";
      },
      resetFilter: function () {
        this.selectedUpbjj = "";
        this.selectedKategori = "";
        this.filterReorderType = "";
        this.sortBy = "";
      },
      startEdit: function (index, item) {
        this.editIndex = index;
        this.editForm.qty = item.qty;
      },
      cancelEdit: function () {
        this.editIndex = null;
      },
      saveEdit: function (index) {
        // Mencari indeks item asli pada array stok berdasarkan data yang sedang ter-filter
        const targetItem = this.filteredStok[index];
        const originalIndex = this.stok.findIndex(
          (s) => s.kode === targetItem.kode,
        );

        if (originalIndex !== -1) {
          this.stok[originalIndex].qty = this.editForm.qty;
        }
        this.editIndex = null;
      },

      addBahanAjar: function () {
        this.errors = {};
        let isValid = true;

        // Validasi setiap field input form tambah stok
        if (!this.formNew.kode.trim()) {
          this.errors.kode = "Kode Mata Kuliah masih kosong.";
          isValid = false;
        }
        if (!this.formNew.judul.trim()) {
          this.errors.judul = "Judul Mata Kuliah masih kosong.";
          isValid = false;
        }
        if (!this.formNew.kategori) {
          this.errors.kategori = "Kategori belum dipilih.";
          isValid = false;
        }
        if (!this.formNew.upbjj) {
          this.errors.upbjj = "UT-Daerah belum dipilih.";
          isValid = false;
        }
        if (!this.formNew.lokasiRak.trim()) {
          this.errors.lokasiRak = "Lokasi Rak masih kosong.";
          isValid = false;
        }

        if (!isValid) {
          this.pesanFeedback = "Mohon lengkapi seluruh form dengan benar.";
          this.pesanClass = "pesan-error";
          return;
        }

        // Menambahkan data baru ke array stok
        this.stok.push({
          kode: this.formNew.kode.trim(),
          judul: this.formNew.judul.trim(),
          kategori: this.formNew.kategori,
          upbjj: this.formNew.upbjj,
          lokasiRak: this.formNew.lokasiRak.trim(),
          harga: Number(this.formNew.harga),
          qty: Number(this.formNew.qty),
          safety: Number(this.formNew.safety),
          catatanHTML: this.formNew.catatanHTML
            ? this.formNew.catatanHTML
            : "<em>Baru ditambahkan</em>",
        });

        // Reset form
        this.formNew = {
          kode: "",
          judul: "",
          kategori: "",
          upbjj: "",
          lokasiRak: "",
          harga: 0,
          qty: 0,
          safety: 0,
          catatanHTML: "",
        };
        this.errors = {};

        this.pesanFeedback = "Data bahan ajar baru berhasil ditambahkan.";
        this.pesanClass = "pesan-sukses";

        setTimeout(() => {
          this.pesanFeedback = "";
        }, 4000);
      },
    },
  });
});
