# KAI Rail-Safety & IBPR Mapping Integration System
### Visualisasi Mapping Interaktif, Analisis Risiko IBPR, & Manajemen Personel (Area 2 Sumatera)

Aplikasi web GIS dan Dashboard Monitoring Keselamatan Perkeretaapian terintegrasi yang menghubungkan titik **JPL (Jalur Perlintasan Langsung)**, **Stasiun Kereta Api**, dan **Rumah Singgah / Griya Karya** dengan analisis **IBPR (Identifikasi Bahaya dan Penilaian Risiko)** serta **Personnel Management (PJL, PPKA, dan Petugas Langsir)** di wilayah **Area 2 Sumatera (Divre I Sumut, Divre II Sumbar, Divre III Palembang, dan Divre IV Tanjungkarang)**.

---

## 🌟 Fitur Utama

1. **Layer Jalur Rel Kereta Api (Garis Rel Kustom)**
   - Vektorisasi koridor rel KA (15 rute lintas utama dan percabangan) dengan simbologi realistis (bantalan rel ganda & garis rel metalik).
2. **Marker Otomatis Berubah Warna Berdasarkan IBPR & Ketersediaan Personil**
   - 🔴 **Extreme Risk (Merah):** Risiko Kritis IBPR $\ge 15$ atau Risiko Tinggi dengan defisit personil PJL $\ge 2$ orang (misal jalan nasional/provinsi tak terjaga).
   - 🟠 **High Risk (Oranye):** Risiko Tinggi atau jalur padat dengan penjagaan parsial.
   - 🟡 **Medium Risk (Kuning):** Risiko Sedang, jalan kabupaten/desa.
   - 🟢 **Low Risk (Hijau):** Risiko Rendah, perlintasan resmi terjaga penuh oleh petugas KAI bersertifikat (formasi lengkap 100%).
3. **Manajemen Personel Terpadu**
   - **PJL (Penjaga Jalur Lintasan):** Roster giliran dinas 3 shift, monitoring formasi kebutuhan standar vs eksisting, gap/defisit formasi, NIPP, sertifikasi kecakapan DJKA Kemenhub, dan evaluasi *Fit to Work*.
   - **PPKA (Pengatur Perjalanan Kereta Api):** Monitoring formasi dan kualifikasi STTUK PPKA di 139 stasiun se-Sumatera.
   - **Petugas Langsir (Juru Langsir):** Manajemen juru langsir di stasiun dengan emplasemen langsir aktif, kepatuhan SOP Peraturan Dinas 19 (PD 19), dan checklist APD.
   - **Simulasi Penugasan Personel:** Fitur interaktif untuk menambah atau memutasi personel PJL yang langsung meng-update skor risiko dan warna marker.
4. **Monitoring Fasilitas Personel & Rumah Singgah**
   - **Fasilitas Gardu JPL:** Checklist gardu fisik, pasokan listrik PLN/genset, radio komunikasi HT frekuensi KA, telepon kereta TOK, palang pintu, APAR, semboyan lentera/bendera, dan P3K.
   - **Rumah Singgah / Griya Karya:** 51 titik mess/rumah singgah se-Sumatera dengan kapasitas bed, okupansi istirahat, dan kelayakan fasilitas (AC, kasur, MCK, dapur).
5. **Dashboard Eksekutif & Statistik IBPR**
   - Grafik interaktif distribusi tingkat risiko IBPR (Extreme, High, Medium, Low).
   - Perbandingan kebutuhan formasi vs eksisting personil PJL per Divre.
   - Ekspor data hasil filter ke format **CSV / Excel**.

---

## 📂 Struktur Data & File

```text
├── index.html                  # Aplikasi Web Single-Page (Leaflet, Tailwind CSS, Chart.js, Lucide)
├── server.js                   # Node.js HTTP server lokal
├── build_dataset.js            # Skrip kompilasi dan kalkulasi otomatis matriks IBPR
├── create_bundle.js            # Skrip pembungkus data bundle offline
├── data/
│   ├── data_bundle.js          # Bundle data mandiri (bisa dibuka langsung via file://)
│   ├── jpl_data.json           # 654 data JPL lengkap dengan koordinat & IBPR
│   ├── stations_data.json      # 139 Stasiun KA dengan data PPKA & Langsir
│   ├── rest_houses_data.json   # 51 Rumah Singgah & Griya Karya
│   └── railway_lines.json      # GeoJSON garis rel kereta api kustom
└── README.md
```

---

## 🚀 Cara Menjalankan

### Cara 1: Langsung Buka di Browser (Tanpa Instalasi Apapun)
Double-click file `index.html` langsung dari File Explorer pada Google Chrome, Microsoft Edge, atau Mozilla Firefox.

### Cara 2: Menjalankan via Local Server
```bash
# Menggunakan Node.js
node server.js

# Akses via browser:
# http://localhost:3000
```
