"use strict";

document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
    data: {
      pengirimanList:
        typeof pengirimanList !== "undefined" ? pengirimanList : [],
      paket: typeof paket !== "undefined" ? paket : [],
      trackingData: typeof tracking !== "undefined" ? tracking : {},

      // Pencarian DO
      keywordDO: "",
      selectedDOData: null,
      pesanErrorCari: "",

      // Form tambah DO baru
      formDO: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: new Date().toISOString().slice(0, 10),
      },
      errorsDO: {},
      selectedPaketDetail: null,
      pesanSuksesDO: "",
    },
    computed: {
      // Computed property untuk men-generate nomor DO secara otomatis (Tahun + Sequence Number)
      nextDONumber: function () {
        const tahun = new Date().getFullYear();
        const keys = Object.keys(this.trackingData);
        const nextSeq = keys.length + 1;
        const seqFormatted = String(nextSeq).padStart(4, "0");
        return `DO${tahun}-${seqFormatted}`;
      },
    },
    watch: {
      // Watcher 1: Memantau perubahan keyword pencarian DO
      keywordDO: function (newVal) {
        if (!newVal.trim()) {
          this.selectedDOData = null;
          this.pesanErrorCari = "";
        }
      },
      // Watcher 2: Memantau total data tracking untuk logging perubahan
      trackingData: function (newData) {
        console.log(
          "Database tracking diperbarui. Jumlah total DO saat ini: " +
            Object.keys(newData).length,
        );
      },
    },
    methods: {
      cariDO: function () {
        this.pesanErrorCari = "";
        const query = this.keywordDO.trim();

        if (this.trackingData[query]) {
          this.selectedDOData = this.trackingData[query];
        } else {
          this.selectedDOData = null;
          this.pesanErrorCari =
            "Nomor DO tidak ditemukan. Silakan periksa kembali nomor yang dimasukkan.";
        }
      },
      onPaketChange: function () {
        // Menampilkan detail paket yang dipilih di bawah elemen select
        const found = this.paket.find((p) => p.kode === this.formDO.paketKode);
        this.selectedPaketDetail = found ? found : null;
      },
      tambahDO: function () {
        this.errorsDO = {};
        let isValid = true;

        if (!this.formDO.nim.trim()) {
          this.errorsDO.nim = "NIM Mahasiswa masih kosong.";
          isValid = false;
        }
        if (!this.formDO.nama.trim()) {
          this.errorsDO.nama = "Nama Mahasiswa masih kosong.";
          isValid = false;
        }
        if (!this.formDO.ekspedisi) {
          this.errorsDO.ekspedisi = "Ekspedisi belum dipilih.";
          isValid = false;
        }
        if (!this.formDO.paketKode) {
          this.errorsDO.paketKode = "Paket bahan ajar belum dipilih.";
          isValid = false;
        }
        if (!isValid) {
          this.pesanSuksesDO = "";
          return;
        }
        const newNoDO = this.nextDONumber;
        const selectedPkt = this.paket.find(
          (p) => p.kode === this.formDO.paketKode,
        );

        // Menambahkan data baru ke objek tracking
        this.$set(this.trackingData, newNoDO, {
          nomorDO: newNoDO,
          nim: this.formDO.nim.trim(),
          nama: this.formDO.nama.trim(),
          status: "Dalam Perjalanan",
          ekspedisi: this.formDO.ekspedisi,
          tanggalKirim: this.formDO.tanggalKirim,
          paket: this.formDO.paketKode,
          total: selectedPkt ? selectedPkt.harga : 0,
          perjalanan: [
            {
              waktu: `${this.formDO.tanggalKirim} 08:00:00`,
              keterangan: "Delivery Order berhasil dibuat dan diproses.",
            },
            {
              waktu: `${this.formDO.tanggalKirim} 10:30:00`,
              keterangan: "Penerimaan di Loket Pengiriman UT-Daerah.",
            },
          ],
        });

        this.pesanSuksesDO = `Delivery Order baru berhasil ditambahkan dengan Nomor: ${newNoDO}`;

        // Reset form
        this.formDO.nim = "";
        this.formDO.nama = "";
        this.formDO.ekspedisi = "";
        this.formDO.paketKode = "";
        this.selectedPaketDetail = null;

        setTimeout(() => {
          this.pesanSuksesDO = "";
        }, 5000);
      },
    },
  });
});
