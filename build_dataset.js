const fs = require('fs');
const path = require('path');

// 1. Load raw inputs
const jplRawPath = path.join(__dirname, '..', '..', 'brain', '3d021980-3383-44a8-824a-0bbbad8427c6', 'scratch', 'jpl_raw.json');
const rumahDinasPath = path.join(__dirname, '..', '..', 'brain', '3d021980-3383-44a8-824a-0bbbad8427c6', 'scratch', 'rumah_dinas.json');

const jplRaw = JSON.parse(fs.readFileSync(jplRawPath, 'utf8'));
const rumahDinas = JSON.parse(fs.readFileSync(rumahDinasPath, 'utf8'));

console.log(`Loaded ${jplRaw.length} JPLs and ${rumahDinas.length} rumah dinas/singgah entries.`);

// 2. Reference Railway Network Nodes (Stations) with true geographical coordinates
const stationsMap = {
  // DIVRE I SUMATERA UTARA
  "MEDAN": { name: "Medan", code: "MDN", lat: 3.590878, lon: 98.679742, divre: "DIVRE I SUMATERA UTARA", km: 0, class: "Besar", hasLangsir: true },
  "BINJAI": { name: "Binjai", code: "BIJ", lat: 3.6027, lon: 98.4856, divre: "DIVRE I SUMATERA UTARA", km: 21, class: "Kelas II", hasLangsir: true },
  "KUALA BINGAI": { name: "Kuala Bingai", code: "KBG", lat: 3.6481, lon: 98.4619, divre: "DIVRE I SUMATERA UTARA", km: 28, class: "Kelas III", hasLangsir: false },
  "PULU BRAYAN": { name: "Pulu Brayan", code: "PUB", lat: 3.6264, lon: 98.6783, divre: "DIVRE I SUMATERA UTARA", km: 5, class: "Kelas I", hasLangsir: true },
  "LABUAN": { name: "Labuan", code: "LBU", lat: 3.7335, lon: 98.6852, divre: "DIVRE I SUMATERA UTARA", km: 17, class: "Kelas III", hasLangsir: false },
  "BELAWAN": { name: "Belawan", code: "BLW", lat: 3.7845, lon: 98.6826, divre: "DIVRE I SUMATERA UTARA", km: 22, class: "Kelas I", hasLangsir: true },
  "UJUNG BARU": { name: "Ujung Baru", code: "UJB", lat: 3.7915, lon: 98.6912, divre: "DIVRE I SUMATERA UTARA", km: 24, class: "Kelas III", hasLangsir: true },
  "BANDAR KHALIPAH": { name: "Bandar Khalipah", code: "BAP", lat: 3.5878, lon: 98.7461, divre: "DIVRE I SUMATERA UTARA", km: 9, class: "Kelas III", hasLangsir: false },
  "BATANG KUIS": { name: "Batang Kuis", code: "BTK", lat: 3.6083, lon: 98.8028, divre: "DIVRE I SUMATERA UTARA", km: 16, class: "Kelas II", hasLangsir: false },
  "ARASKABU": { name: "Araskabu", code: "ARB", lat: 3.5786, lon: 98.8686, divre: "DIVRE I SUMATERA UTARA", km: 23, class: "Kelas II", hasLangsir: false },
  "LUBUK PAKAM": { name: "Lubuk Pakam", code: "LBP", lat: 3.5619, lon: 98.8817, divre: "DIVRE I SUMATERA UTARA", km: 30, class: "Kelas I", hasLangsir: true },
  "PERBAUNGAN": { name: "Perbaungan", code: "PBA", lat: 3.5686, lon: 98.9619, divre: "DIVRE I SUMATERA UTARA", km: 38, class: "Kelas II", hasLangsir: false },
  "LIDAH TANAH": { name: "Lidah Tanah", code: "LDT", lat: 3.5583, lon: 99.0142, divre: "DIVRE I SUMATERA UTARA", km: 46, class: "Kelas III", hasLangsir: false },
  "TELUK MENGKUDU": { name: "Teluk Mengkudu", code: "TKM", lat: 3.5411, lon: 99.0436, divre: "DIVRE I SUMATERA UTARA", km: 52, class: "Kelas III", hasLangsir: false },
  "RAMPAH": { name: "Rampah", code: "RPH", lat: 3.4864, lon: 99.0683, divre: "DIVRE I SUMATERA UTARA", km: 61, class: "Kelas II", hasLangsir: false },
  "BAMBAN": { name: "Bamban", code: "BBN", lat: 3.4475, lon: 99.0712, divre: "DIVRE I SUMATERA UTARA", km: 68, class: "Kelas III", hasLangsir: false },
  "TEBING TINGGI": { name: "Tebing Tinggi", code: "TBI", lat: 3.327089, lon: 99.168409, divre: "DIVRE I SUMATERA UTARA", km: 80, class: "Besar", hasLangsir: true },
  "BAJALINGGEI": { name: "Bajalinggei", code: "BJL", lat: 3.2386, lon: 99.1419, divre: "DIVRE I SUMATERA UTARA", km: 92, class: "Kelas III", hasLangsir: false },
  "DOLOK MERANGIR": { name: "Dolok Merangir", code: "DMR", lat: 3.1242, lon: 99.1208, divre: "DIVRE I SUMATERA UTARA", km: 108, class: "Kelas II", hasLangsir: false },
  "SIANTAR": { name: "Siantar", code: "SIR", lat: 2.9636, lon: 99.0631, divre: "DIVRE I SUMATERA UTARA", km: 128, class: "Kelas I", hasLangsir: true },
  "LAUT TADOR": { name: "Laut Tador", code: "LTD", lat: 3.2512, lon: 99.2845, divre: "DIVRE I SUMATERA UTARA", km: 94, class: "Kelas III", hasLangsir: false },
  "BANDAR TINGGI": { name: "Bandar Tinggi", code: "BDT", lat: 3.2081, lon: 99.3178, divre: "DIVRE I SUMATERA UTARA", km: 104, class: "Kelas II", hasLangsir: false },
  "TANJUNG GADING": { name: "Tanjung Gading", code: "TGD", lat: 3.2981, lon: 99.3456, divre: "DIVRE I SUMATERA UTARA", km: 114, class: "Kelas III", hasLangsir: false },
  "LALANG": { name: "Lalang", code: "LLG", lat: 3.3325, lon: 99.3811, divre: "DIVRE I SUMATERA UTARA", km: 122, class: "Kelas III", hasLangsir: false },
  "KUALA TANJUNG": { name: "Kuala Tanjung", code: "KTJ", lat: 3.3614, lon: 99.4489, divre: "DIVRE I SUMATERA UTARA", km: 135, class: "Kelas I", hasLangsir: true },
  "BAHLIAS": { name: "Bahlias", code: "BLS", lat: 3.1894, lon: 99.3361, divre: "DIVRE I SUMATERA UTARA", km: 110, class: "Kelas III", hasLangsir: false },
  "PERLANAAN": { name: "Perlanaan", code: "PRL", lat: 3.17583, lon: 99.3625, divre: "DIVRE I SUMATERA UTARA", km: 115, class: "Kelas I", hasLangsir: true },
  "GUNUNG BAYU": { name: "Gunung Bayu", code: "GNB", lat: 3.1511, lon: 99.3989, divre: "DIVRE I SUMATERA UTARA", km: 122, class: "Kelas III", hasLangsir: false },
  "SEI MANGKE": { name: "Sei Mangke", code: "SMK", lat: 3.1386, lon: 99.4311, divre: "DIVRE I SUMATERA UTARA", km: 128, class: "Kelas II", hasLangsir: true },
  "LIMA PULUH": { name: "Lima Puluh", code: "LMP", lat: 3.1611, lon: 99.4239, divre: "DIVRE I SUMATERA UTARA", km: 124, class: "Kelas II", hasLangsir: false },
  "DUSUN": { name: "Dusun", code: "DSN", lat: 3.1217, lon: 99.4936, divre: "DIVRE I SUMATERA UTARA", km: 133, class: "Kelas III", hasLangsir: false },
  "SEI BEJANGKAR": { name: "Sei Bejangkar", code: "SBJ", lat: 3.0847, lon: 99.5383, divre: "DIVRE I SUMATERA UTARA", km: 142, class: "Kelas III", hasLangsir: false },
  "BUNUT": { name: "Bunut", code: "BNU", lat: 3.0411, lon: 99.5819, divre: "DIVRE I SUMATERA UTARA", km: 150, class: "Kelas III", hasLangsir: false },
  "KISARAN": { name: "Kisaran", code: "KIS", lat: 2.98639, lon: 99.62361, divre: "DIVRE I SUMATERA UTARA", km: 154, class: "Besar", hasLangsir: true },
  "TANJUNGBALAI": { name: "Tanjungbalai", code: "TNB", lat: 2.9644, lon: 99.7997, divre: "DIVRE I SUMATERA UTARA", km: 174, class: "Kelas I", hasLangsir: true },
  "HENGELO": { name: "Hengelo", code: "HGL", lat: 2.9117, lon: 99.6486, divre: "DIVRE I SUMATERA UTARA", km: 165, class: "Kelas III", hasLangsir: false },
  "TELUK DALAM": { name: "Teluk Dalam", code: "TKD", lat: 2.8436, lon: 99.6833, divre: "DIVRE I SUMATERA UTARA", km: 175, class: "Kelas III", hasLangsir: false },
  "PULU RAJA": { name: "Pulu Raja", code: "PRJ", lat: 2.7686, lon: 99.7186, divre: "DIVRE I SUMATERA UTARA", km: 187, class: "Kelas II", hasLangsir: false },
  "AEK LOBA": { name: "Aek Loba", code: "AKL", lat: 2.7011, lon: 99.7369, divre: "DIVRE I SUMATERA UTARA", km: 198, class: "Kelas III", hasLangsir: false },
  "MAMBANG MUDA": { name: "Mambang Muda", code: "MBM", lat: 2.6144, lon: 99.7583, divre: "DIVRE I SUMATERA UTARA", km: 211, class: "Kelas II", hasLangsir: false },
  "SITUNGIR": { name: "Situngir", code: "STG", lat: 2.5286, lon: 99.7711, divre: "DIVRE I SUMATERA UTARA", km: 224, class: "Kelas III", hasLangsir: false },
  "PAMINGKE": { name: "Pamingke", code: "PMK", lat: 2.4519, lon: 99.7847, divre: "DIVRE I SUMATERA UTARA", km: 236, class: "Kelas II", hasLangsir: false },
  "PADANG HALABAN": { name: "Padang Halaban", code: "PHA", lat: 2.3789, lon: 99.7981, divre: "DIVRE I SUMATERA UTARA", km: 248, class: "Kelas III", hasLangsir: false },
  "MARBAU": { name: "Marbau", code: "MBU", lat: 2.2964, lon: 99.8058, divre: "DIVRE I SUMATERA UTARA", km: 260, class: "Kelas II", hasLangsir: false },
  "RANTAU PRAPAT": { name: "Rantau Prapat", code: "RAP", lat: 2.1125, lon: 99.81694, divre: "DIVRE I SUMATERA UTARA", km: 285, class: "Kelas I", hasLangsir: true },

  // DIVRE II SUMATERA BARAT
  "PD": { name: "Padang (Simpang Haru)", code: "PD", lat: -0.94352, lon: 100.37437, divre: "DIVRE II SUMATERA BARAT", km: 0, class: "Besar", hasLangsir: true },
  "AI": { name: "Alai", code: "AI", lat: -0.9236, lon: 100.3686, divre: "DIVRE II SUMATERA BARAT", km: 3, class: "Kelas III", hasLangsir: false },
  "ATR": { name: "Air Tawar", code: "ATR", lat: -0.9067, lon: 100.3589, divre: "DIVRE II SUMATERA BARAT", km: 6, class: "Kelas III", hasLangsir: false },
  "TAB": { name: "Tabing", code: "TAB", lat: -0.8872, lon: 100.3475, divre: "DIVRE II SUMATERA BARAT", km: 9, class: "Kelas II", hasLangsir: false },
  "LBY": { name: "Lubuk Buaya", code: "LBY", lat: -0.8358, lon: 100.3283, divre: "DIVRE II SUMATERA BARAT", km: 16, class: "Kelas II", hasLangsir: false },
  "DUK": { name: "Duku", code: "DUK", lat: -0.7719, lon: 100.2981, divre: "DIVRE II SUMATERA BARAT", km: 24, class: "Kelas II", hasLangsir: false },
  "BIM": { name: "Bandara Internasional Minangkabau", code: "BIM", lat: -0.7872, lon: 100.2831, divre: "DIVRE II SUMATERA BARAT", km: 28, class: "Kelas I", hasLangsir: false },
  "PRU": { name: "Pasar Usang", code: "PRU", lat: -0.7386, lon: 100.2889, divre: "DIVRE II SUMATERA BARAT", km: 29, class: "Kelas III", hasLangsir: false },
  "LA": { name: "Lubuk Alung", code: "LA", lat: -0.6811, lon: 100.2797, divre: "DIVRE II SUMATERA BARAT", km: 37, class: "Kelas I", hasLangsir: true },
  "PAK": { name: "Pauh Kambar", code: "PAK", lat: -0.6614, lon: 100.2289, divre: "DIVRE II SUMATERA BARAT", km: 45, class: "Kelas III", hasLangsir: false },
  "KI": { name: "Kurai Taji", code: "KI", lat: -0.6486, lon: 100.1711, divre: "DIVRE II SUMATERA BARAT", km: 53, class: "Kelas II", hasLangsir: false },
  "PMN": { name: "Pariaman", code: "PMN", lat: -0.6225, lon: 100.1205, divre: "DIVRE II SUMATERA BARAT", km: 60, class: "Kelas I", hasLangsir: true },
  "NRS": { name: "Naras", code: "NRS", lat: -0.570859, lon: 100.097893, divre: "DIVRE II SUMATERA BARAT", km: 68, class: "Kelas II", hasLangsir: true },
  "SCN": { name: "Sicincin", code: "SCN", lat: -0.6128, lon: 100.3014, divre: "DIVRE II SUMATERA BARAT", km: 48, class: "Kelas II", hasLangsir: false },
  "KTN": { name: "Kayutanam", code: "KTN", lat: -0.548056, lon: 100.331173, divre: "DIVRE II SUMATERA BARAT", km: 60, class: "Kelas I", hasLangsir: true },
  "BKP": { name: "Bukit Putus", code: "BKP", lat: -0.9761, lon: 100.3814, divre: "DIVRE II SUMATERA BARAT", km: 5, class: "Kelas II", hasLangsir: true },
  "IMA": { name: "Indarung", code: "IMA", lat: -0.95222, lon: 100.46333, divre: "DIVRE II SUMATERA BARAT", km: 14, class: "Kelas I", hasLangsir: true },
  "KAJ": { name: "Kampung Jua", code: "KAJ", lat: -0.9619, lon: 100.4183, divre: "DIVRE II SUMATERA BARAT", km: 9, class: "Kelas III", hasLangsir: false },
  "PLA": { name: "Pulau Aie", code: "PLA", lat: -0.9664, lon: 100.3619, divre: "DIVRE II SUMATERA BARAT", km: 3, class: "Kelas II", hasLangsir: false },

  // DIVRE III PALEMBANG
  "KPT": { name: "Kertapati", code: "KPT", lat: -3.01667, lon: 104.75139, divre: "DIVRE III PALEMBANG", km: 0, class: "Besar", hasLangsir: true },
  "KAS": { name: "Kramasan", code: "KAS", lat: -3.0489, lon: 104.7317, divre: "DIVRE III PALEMBANG", km: 6, class: "Kelas II", hasLangsir: true },
  "SIG": { name: "Simpang", code: "SIG", lat: -3.103756, lon: 104.700193, divre: "DIVRE III PALEMBANG", km: 14, class: "Kelas II", hasLangsir: false },
  "PYK": { name: "Payakabung", code: "PYK", lat: -3.20306, lon: 104.60111, divre: "DIVRE III PALEMBANG", km: 27, class: "Kelas I", hasLangsir: true },
  "SDN": { name: "Serdang", code: "SDN", lat: -3.22006, lon: 104.5229, divre: "DIVRE III PALEMBANG", km: 37, class: "Kelas II", hasLangsir: false },
  "GLB": { name: "Gelumbang", code: "GLB", lat: -3.24537, lon: 104.44198, divre: "DIVRE III PALEMBANG", km: 47, class: "Kelas II", hasLangsir: false },
  "KED": { name: "Karangendah", code: "KED", lat: -3.2981, lon: 104.3683, divre: "DIVRE III PALEMBANG", km: 58, class: "Kelas III", hasLangsir: false },
  "LEB": { name: "Lembak", code: "LEB", lat: -3.3411, lon: 104.3014, divre: "DIVRE III PALEMBANG", km: 68, class: "Kelas II", hasLangsir: false },
  "PBM": { name: "Prabumulih", code: "PBM", lat: -3.4358, lon: 104.2389, divre: "DIVRE III PALEMBANG", km: 78, class: "Besar", hasLangsir: true },
  "X5": { name: "Wesel X5", code: "X5", lat: -3.4419, lon: 104.2189, divre: "DIVRE III PALEMBANG", km: 81, class: "Pos Blok", hasLangsir: false },
  "X6": { name: "Wesel X6", code: "X6", lat: -3.4486, lon: 104.2011, divre: "DIVRE III PALEMBANG", km: 84, class: "Pos Blok", hasLangsir: false },
  "PNM": { name: "Penimur", code: "PNM", lat: -3.4475, lon: 104.1486, divre: "DIVRE III PALEMBANG", km: 91, class: "Kelas II", hasLangsir: false },
  "NRU": { name: "Niru", code: "NRU", lat: -3.45583, lon: 104.06111, divre: "DIVRE III PALEMBANG", km: 102, class: "Kelas I", hasLangsir: true },
  "BIB": { name: "Belimbing Pendopo", code: "BIB", lat: -3.4681, lon: 103.9683, divre: "DIVRE III PALEMBANG", km: 114, class: "Kelas II", hasLangsir: false },
  "GNM": { name: "Gunung Megang", code: "GNM", lat: -3.4736, lon: 103.8894, divre: "DIVRE III PALEMBANG", km: 125, class: "Kelas I", hasLangsir: true },
  "PNG": { name: "Penanggiran", code: "PNG", lat: -3.48213, lon: 103.81292, divre: "DIVRE III PALEMBANG", km: 135, class: "Kelas II", hasLangsir: false },
  "UJM": { name: "Ujanmas", code: "UJM", lat: -3.5286, lon: 103.7919, divre: "DIVRE III PALEMBANG", km: 143, class: "Kelas II", hasLangsir: false },
  "MRL": { name: "Muara Gula", code: "MRL", lat: -3.58394, lon: 103.77577, divre: "DIVRE III PALEMBANG", km: 151, class: "Kelas II", hasLangsir: false },
  "ME": { name: "Muara Enim", code: "ME", lat: -3.6514, lon: 103.7761, divre: "DIVRE III PALEMBANG", km: 160, class: "Kelas I", hasLangsir: true },
  "TMB": { name: "Tanjungenim Baru", code: "TMB", lat: -3.70889, lon: 103.80194, divre: "DIVRE III PALEMBANG", km: 172, class: "Besar", hasLangsir: true },
  "BJI": { name: "Banjarsari", code: "BJI", lat: -3.7314, lon: 103.7486, divre: "DIVRE III PALEMBANG", km: 170, class: "Kelas I", hasLangsir: true },
  "SNA": { name: "Sukacinta", code: "SNA", lat: -3.77866, lon: 103.62475, divre: "DIVRE III PALEMBANG", km: 185, class: "Kelas I", hasLangsir: true },
  "SUA": { name: "Sukamerindu (Sumsel)", code: "SUA", lat: -3.7611, lon: 103.6514, divre: "DIVRE III PALEMBANG", km: 181, class: "Kelas II", hasLangsir: false },
  "BGM": { name: "Bungamas", code: "BGM", lat: -3.7811, lon: 103.5819, divre: "DIVRE III PALEMBANG", km: 194, class: "Kelas II", hasLangsir: false },
  "LT": { name: "Lahat", code: "LT", lat: -3.79028, lon: 103.54167, divre: "DIVRE III PALEMBANG", km: 202, class: "Besar", hasLangsir: true },
  "SCT": { name: "Saungnaga", code: "SCT", lat: -3.7214, lon: 103.4683, divre: "DIVRE III PALEMBANG", km: 216, class: "Kelas II", hasLangsir: false },
  "TI": { name: "Tebing Tinggi (Sumsel)", code: "TI", lat: -3.6186, lon: 103.3514, divre: "DIVRE III PALEMBANG", km: 235, class: "Kelas I", hasLangsir: true },
  "MSL": { name: "Muara Saling", code: "MSL", lat: -3.5186, lon: 103.2014, divre: "DIVRE III PALEMBANG", km: 256, class: "Kelas II", hasLangsir: false },
  "KOP": { name: "Kota Padang", code: "KOP", lat: -3.4114, lon: 103.0411, divre: "DIVRE III PALEMBANG", km: 278, class: "Kelas II", hasLangsir: false },
  "LLG": { name: "Lubuklinggau", code: "LLG", lat: -3.29343, lon: 102.86432, divre: "DIVRE III PALEMBANG", km: 305, class: "Besar", hasLangsir: true },

  // DIVRE IV TANJUNGKARANG
  "SKU": { name: "Sukamerindu (Lubai)", code: "SKU", lat: -3.60028, lon: 104.27528, divre: "DIVRE IV TANJUNGKARANG", km: 25, class: "Kelas II", hasLangsir: false },
  "ASM": { name: "Air Asam", code: "ASM", lat: -3.64722, lon: 104.30083, divre: "DIVRE IV TANJUNGKARANG", km: 32, class: "Kelas II", hasLangsir: false },
  "PAGAR GUNUNG": { name: "Pagar Gunung", code: "PGG", lat: -3.69083, lon: 104.31278, divre: "DIVRE IV TANJUNGKARANG", km: 38, class: "Kelas III", hasLangsir: false },
  "KOTA BARU": { name: "Kota Baru", code: "KBR", lat: -3.72694, lon: 104.33583, divre: "DIVRE IV TANJUNGKARANG", km: 45, class: "Kelas II", hasLangsir: false },
  "TLB": { name: "Talang Baru", code: "TLB", lat: -3.84444, lon: 104.3675, divre: "DIVRE IV TANJUNGKARANG", km: 60, class: "Kelas III", hasLangsir: false },
  "DAN": { name: "Durian", code: "DAN", lat: -3.97111, lon: 104.31083, divre: "DIVRE IV TANJUNGKARANG", km: 78, class: "Kelas III", hasLangsir: false },
  "BIK": { name: "Belimbing Air Kaka", code: "BIK", lat: -3.99119, lon: 104.292, divre: "DIVRE IV TANJUNGKARANG", km: 83, class: "Kelas III", hasLangsir: false },
  "PNW": { name: "Peninjauan", code: "PNW", lat: -3.9114, lon: 104.3286, divre: "DIVRE IV TANJUNGKARANG", km: 71, class: "Kelas II", hasLangsir: false },
  "LRM": { name: "Lubuk Rukam", code: "LRM", lat: -4.0114, lon: 104.2583, divre: "DIVRE IV TANJUNGKARANG", km: 89, class: "Kelas II", hasLangsir: false },
  "BLT": { name: "Belatung", code: "BLT", lat: -4.0386, lon: 104.2386, divre: "DIVRE IV TANJUNGKARANG", km: 94, class: "Kelas III", hasLangsir: false },
  "LBT": { name: "Lubuk Batang", code: "LBT", lat: -4.05748, lon: 104.21785, divre: "DIVRE IV TANJUNGKARANG", km: 98, class: "Kelas I", hasLangsir: true },
  "TJH": { name: "Tigagajah", code: "TJH", lat: -4.10694, lon: 104.16722, divre: "DIVRE IV TANJUNGKARANG", km: 108, class: "Kelas I", hasLangsir: true },
  "BTA": { name: "Baturaja", code: "BTA", lat: -4.125, lon: 104.16028, divre: "DIVRE IV TANJUNGKARANG", km: 112, class: "Besar", hasLangsir: true },
  "KMK": { name: "Kemelak", code: "KMK", lat: -4.1683, lon: 104.1814, divre: "DIVRE IV TANJUNGKARANG", km: 120, class: "Kelas II", hasLangsir: false },
  "SPC": { name: "Sepancar", code: "SPC", lat: -4.2186, lon: 104.2211, divre: "DIVRE IV TANJUNGKARANG", km: 130, class: "Kelas II", hasLangsir: false },
  "GLS": { name: "Gilas", code: "GLS", lat: -4.26445, lon: 104.28654, divre: "DIVRE IV TANJUNGKARANG", km: 142, class: "Kelas II", hasLangsir: false },
  "SGT": { name: "Sungai Tuha", code: "SGT", lat: -4.2826, lon: 104.32088, divre: "DIVRE IV TANJUNGKARANG", km: 148, class: "Kelas II", hasLangsir: false },
  "MP": { name: "Martapura", code: "MP", lat: -4.3186, lon: 104.3514, divre: "DIVRE IV TANJUNGKARANG", km: 156, class: "Kelas I", hasLangsir: true },
  "WAP": { name: "Way Pisang", code: "WAP", lat: -4.34994, lon: 104.38657, divre: "DIVRE IV TANJUNGKARANG", km: 164, class: "Kelas II", hasLangsir: false },
  "WAY": { name: "Way Tuba", code: "WAY", lat: -4.3786, lon: 104.4211, divre: "DIVRE IV TANJUNGKARANG", km: 172, class: "Kelas II", hasLangsir: false },
  "TJR": { name: "Tanjungrajo", code: "TJR", lat: -4.4079, lon: 104.46251, divre: "DIVRE IV TANJUNGKARANG", km: 180, class: "Kelas II", hasLangsir: false },
  "GHM": { name: "Giham", code: "GHM", lat: -4.4714, lon: 104.5186, divre: "DIVRE IV TANJUNGKARANG", km: 194, class: "Kelas II", hasLangsir: false },
  "BBU": { name: "Blambangan Umpu", code: "BBU", lat: -4.5186, lon: 104.5514, divre: "DIVRE IV TANJUNGKARANG", km: 206, class: "Kelas I", hasLangsir: true },
  "NGN": { name: "Negeri Agung", code: "NGN", lat: -4.57209, lon: 104.60649, divre: "DIVRE IV TANJUNGKARANG", km: 220, class: "Kelas II", hasLangsir: false },
  "TLY": { name: "Tulungbuyut", code: "TLY", lat: -4.6414, lon: 104.6814, divre: "DIVRE IV TANJUNGKARANG", km: 236, class: "Kelas II", hasLangsir: false },
  "NRR": { name: "Negara Ratu", code: "NRR", lat: -4.7114, lon: 104.7486, divre: "DIVRE IV TANJUNGKARANG", km: 250, class: "Kelas II", hasLangsir: false },
  "KTP": { name: "Ketapang", code: "KTP", lat: -4.7686, lon: 104.8114, divre: "DIVRE IV TANJUNGKARANG", km: 263, class: "Kelas II", hasLangsir: false },
  "CEP": { name: "Cempaka", code: "CEP", lat: -4.7964, lon: 104.8486, divre: "DIVRE IV TANJUNGKARANG", km: 271, class: "Kelas III", hasLangsir: false },
  "KB": { name: "Kotabumi", code: "KB", lat: -4.8219, lon: 104.8875, divre: "DIVRE IV TANJUNGKARANG", km: 280, class: "Besar", hasLangsir: true },
  "CMS": { name: "Candimas", code: "CMS", lat: -4.8814, lon: 104.9386, divre: "DIVRE IV TANJUNGKARANG", km: 292, class: "Kelas II", hasLangsir: false },
  "KAG": { name: "Kalibalangan", code: "KAG", lat: -4.9214, lon: 104.9814, divre: "DIVRE IV TANJUNGKARANG", km: 301, class: "Kelas III", hasLangsir: false },
  "BBA": { name: "Blambangan Pagar", code: "BBA", lat: -4.9814, lon: 105.0314, divre: "DIVRE IV TANJUNGKARANG", km: 314, class: "Kelas II", hasLangsir: false },
  "SLS": { name: "Sulusuban", code: "SLS", lat: -5.0486, lon: 105.0814, divre: "DIVRE IV TANJUNGKARANG", km: 328, class: "Kelas II", hasLangsir: false },
  "HJP": { name: "Haji Pemanggilan", code: "HJP", lat: -5.0986, lon: 105.1186, divre: "DIVRE IV TANJUNGKARANG", km: 338, class: "Kelas III", hasLangsir: false },
  "BKI": { name: "Bekri", code: "BKI", lat: -5.1186, lon: 105.1386, divre: "DIVRE IV TANJUNGKARANG", km: 344, class: "Kelas II", hasLangsir: false },
  "RGS": { name: "Rengas", code: "RGS", lat: -5.13424, lon: 105.15485, divre: "DIVRE IV TANJUNGKARANG", km: 350, class: "Kelas II", hasLangsir: false },
  "TGI": { name: "Tegineneng", code: "TGI", lat: -5.2014, lon: 105.1886, divre: "DIVRE IV TANJUNGKARANG", km: 362, class: "Kelas II", hasLangsir: false },
  "BTI": { name: "Branti", code: "BTI", lat: -5.2514, lon: 105.2086, divre: "DIVRE IV TANJUNGKARANG", km: 371, class: "Kelas II", hasLangsir: false },
  "RJS": { name: "Rejosari", code: "RJS", lat: -5.2986, lon: 105.2186, divre: "DIVRE IV TANJUNGKARANG", km: 380, class: "Kelas I", hasLangsir: true },
  "GDR": { name: "Gedungratu", code: "GDR", lat: -5.3386, lon: 105.2314, divre: "DIVRE IV TANJUNGKARANG", km: 388, class: "Kelas II", hasLangsir: false },
  "LAR": { name: "Labuhanratu", code: "LAR", lat: -5.3786, lon: 105.2486, divre: "DIVRE IV TANJUNGKARANG", km: 396, class: "Kelas II", hasLangsir: false },
  "TNK": { name: "Tanjungkarang", code: "TNK", lat: -5.4092, lon: 105.2589, divre: "DIVRE IV TANJUNGKARANG", km: 402, class: "Besar", hasLangsir: true },
  "GR": { name: "Garuntang", code: "GR", lat: -5.4414, lon: 105.2814, divre: "DIVRE IV TANJUNGKARANG", km: 408, class: "Kelas II", hasLangsir: true },
  "SKN": { name: "Sukamenanti", code: "SKN", lat: -5.4686, lon: 105.3086, divre: "DIVRE IV TANJUNGKARANG", km: 414, class: "Kelas II", hasLangsir: true },
  "THN": { name: "Tarahan", code: "THN", lat: -5.50776, lon: 105.33967, divre: "DIVRE IV TANJUNGKARANG", km: 423, class: "Besar", hasLangsir: true }
};

// 3. Build Railway Corridors (Lines) for Custom Rail Layer
const railwayCorridors = [
  // DIVRE I
  {
    name: "Lintas Utama Medan - Rantau Prapat",
    divre: "DIVRE I SUMATERA UTARA",
    stations: ["MEDAN", "BANDAR KHALIPAH", "BATANG KUIS", "ARASKABU", "LUBUK PAKAM", "PERBAUNGAN", "LIDAH TANAH", "TELUK MENGKUDU", "RAMPAH", "BAMBAN", "TEBING TINGGI", "LAUT TADOR", "BANDAR TINGGI", "BAHLIAS", "PERLANAAN", "LIMA PULUH", "DUSUN", "SEI BEJANGKAR", "BUNUT", "KISARAN", "HENGELO", "TELUK DALAM", "PULU RAJA", "AEK LOBA", "MAMBANG MUDA", "SITUNGIR", "PAMINGKE", "PADANG HALABAN", "MARBAU", "RANTAU PRAPAT"]
  },
  {
    name: "Lintas Medan - Binjai - Kuala Bingai",
    divre: "DIVRE I SUMATERA UTARA",
    stations: ["MEDAN", "BINJAI", "KUALA BINGAI"]
  },
  {
    name: "Lintas Medan - Pulu Brayan - Belawan",
    divre: "DIVRE I SUMATERA UTARA",
    stations: ["MEDAN", "PULU BRAYAN", "LABUAN", "BELAWAN", "UJUNG BARU"]
  },
  {
    name: "Lintas Tebing Tinggi - Siantar",
    divre: "DIVRE I SUMATERA UTARA",
    stations: ["TEBING TINGGI", "BAJALINGGEI", "DOLOK MERANGIR", "SIANTAR"]
  },
  {
    name: "Lintas Bandar Tinggi - Kuala Tanjung",
    divre: "DIVRE I SUMATERA UTARA",
    stations: ["BANDAR TINGGI", "TANJUNG GADING", "LALANG", "KUALA TANJUNG"]
  },
  {
    name: "Lintas Perlanaan - Sei Mangke",
    divre: "DIVRE I SUMATERA UTARA",
    stations: ["PERLANAAN", "GUNUNG BAYU", "SEI MANGKE"]
  },
  {
    name: "Lintas Kisaran - Tanjungbalai",
    divre: "DIVRE I SUMATERA UTARA",
    stations: ["KISARAN", "TANJUNGBALAI"]
  },

  // DIVRE II
  {
    name: "Lintas Padang - Pariaman - Naras",
    divre: "DIVRE II SUMATERA BARAT",
    stations: ["PD", "AI", "ATR", "TAB", "LBY", "DUK", "PRU", "LA", "PAK", "KI", "PMN", "NRS"]
  },
  {
    name: "Lintas Duku - Bandara BIM",
    divre: "DIVRE II SUMATERA BARAT",
    stations: ["DUK", "BIM"]
  },
  {
    name: "Lintas Lubuk Alung - Kayutanam",
    divre: "DIVRE II SUMATERA BARAT",
    stations: ["LA", "SCN", "KTN"]
  },
  {
    name: "Lintas Padang - Indarung",
    divre: "DIVRE II SUMATERA BARAT",
    stations: ["PLA", "PD", "BKP", "KAJ", "IMA"]
  },

  // DIVRE III
  {
    name: "Lintas Kertapati - Prabumulih",
    divre: "DIVRE III PALEMBANG",
    stations: ["KPT", "KAS", "SIG", "PYK", "SDN", "GLB", "KED", "LEB", "PBM"]
  },
  {
    name: "Lintas Prabumulih - Muara Enim - Lubuklinggau",
    divre: "DIVRE III PALEMBANG",
    stations: ["PBM", "X5", "X6", "PNM", "NRU", "BIB", "GNM", "PNG", "UJM", "MRL", "ME", "BJI", "SNA", "BGM", "LT", "SCT", "TI", "MSL", "KOP", "LLG"]
  },
  {
    name: "Percabangan Muara Enim - Tanjungenim Baru",
    divre: "DIVRE III PALEMBANG",
    stations: ["ME", "TMB"]
  },

  // DIVRE IV
  {
    name: "Lintas Prabumulih - Baturaja - Tanjungkarang - Tarahan",
    divre: "DIVRE IV TANJUNGKARANG",
    stations: ["PBM", "SKU", "ASM", "KOTA BARU", "TLB", "DAN", "BIK", "PNW", "LRM", "BLT", "LBT", "TJH", "BTA", "KMK", "SPC", "GLS", "SGT", "MP", "WAP", "WAY", "TJR", "GHM", "BBU", "NGN", "TLY", "NRR", "KTP", "CEP", "KB", "CMS", "KAG", "BBA", "SLS", "HJP", "BKI", "RGS", "TGI", "BTI", "RJS", "GDR", "LAR", "TNK", "GR", "SKN", "THN"]
  }
];

// Convert corridors into GeoJSON feature collection
const geojsonFeatures = railwayCorridors.map(c => {
  const coords = c.stations.map(stKey => {
    const st = stationsMap[stKey];
    if (!st) console.warn(`Station not found: ${stKey}`);
    return st ? [st.lon, st.lat] : [0, 0];
  }).filter(pt => pt[0] !== 0);

  return {
    type: "Feature",
    properties: {
      name: c.name,
      divre: c.divre,
      totalStations: c.stations.length
    },
    geometry: {
      type: "LineString",
      coordinates: coords
    }
  };
});

const railwayGeoJSON = {
  type: "FeatureCollection",
  features: geojsonFeatures
};

// 4. Interpolate JPL Coordinates along Antara Segment
function parseKm(kmStr) {
  if (!kmStr) return null;
  const parts = kmStr.replace(',', '.').split('+');
  if (parts.length === 2) {
    return parseFloat(parts[0]) + parseFloat(parts[1]) / 1000;
  }
  const val = parseFloat(kmStr);
  return isNaN(val) ? null : val;
}

// Function to find station pair from Antara string
function resolveSegment(antaraStr, daopDivre) {
  if (!antaraStr) return null;
  const clean = antaraStr.toUpperCase().trim();
  
  // Try split by '-' or ' - '
  const parts = clean.split(/[-–]/).map(s => s.trim());
  if (parts.length >= 2) {
    let stA = stationsMap[parts[0]];
    let stB = stationsMap[parts[1]];

    // Look up by partial code or name
    if (!stA) {
      for (const k in stationsMap) {
        if (clean.includes(k) || clean.includes(stationsMap[k].name.toUpperCase())) {
          stA = stationsMap[k];
          break;
        }
      }
    }
    if (!stB) {
      for (const k in stationsMap) {
        if (k !== parts[0] && (clean.includes(k) || clean.includes(stationsMap[k].name.toUpperCase()))) {
          stB = stationsMap[k];
          break;
        }
      }
    }

    if (stA && stB) return { stA, stB };
    if (stA) return { stA, stB: stA };
    if (stB) return { stA: stB, stB };
  }

  // If single station or emplasemen (e.g. EMPL LBT, EMPLASEMEN UJUNG BARU)
  for (const k in stationsMap) {
    if (clean.includes(k) || clean.includes(stationsMap[k].name.toUpperCase())) {
      return { stA: stationsMap[k], stB: stationsMap[k] };
    }
  }

  // Fallback to divre capital
  if (daopDivre.includes("DIVRE I")) return { stA: stationsMap["MEDAN"], stB: stationsMap["TEBING TINGGI"] };
  if (daopDivre.includes("DIVRE II")) return { stA: stationsMap["PD"], stB: stationsMap["PMN"] };
  if (daopDivre.includes("DIVRE III")) return { stA: stationsMap["KPT"], stB: stationsMap["PBM"] };
  if (daopDivre.includes("DIVRE IV")) return { stA: stationsMap["TNK"], stB: stationsMap["BTA"] };

  return { stA: stationsMap["MEDAN"], stB: stationsMap["MEDAN"] };
}

// 5. Build Enriched JPL Dataset with IBPR & Personnel Analysis
const samplePjlNames = [
  "Budi Santoso", "Agus Setiawan", "Rahmat Hidayat", "Eko Prasetyo", "Bambang Wijaya", 
  "Hendra Gunawan", "Dedi Kurniawan", "Aris Nugroho", "Fajar Firmansyah", "Wahyu Pratama",
  "Ilham Syahputra", "Rizky Ramadhan", "Surya Saputra", "Ahmad Fauzi", "Denny Setiawan",
  "Roni Hermawan", "Bayu Anggoro", "Taufik Ismail", "Dimas Pangestu", "Andri Irawan"
];

const processedJpls = jplRaw.map((raw, idx) => {
  const seg = resolveSegment(raw.Antara, raw.DaopDivre);
  const stA = seg.stA;
  const stB = seg.stB;

  // Pseudo-random deterministic hash from ID/Row for realistic distribution along segment
  const hash = ((raw.Row * 9301 + 49297) % 233280) / 233280.0;
  const ratio = 0.08 + hash * 0.84; // keep within 8% to 92% between stations

  const lat = stA.lat + ratio * (stB.lat - stA.lat) + (Math.sin(raw.Row) * 0.0015);
  const lon = stA.lon + ratio * (stB.lon - stA.lon) + (Math.cos(raw.Row) * 0.0015);

  const lebar = parseFloat(raw.LebarJpl) || 4.0;
  const katJalan = raw.KategoriJalan ? raw.KategoriJalan.toUpperCase() : "DESA";
  const statusJpl = raw.StatusJpl ? raw.StatusJpl.toUpperCase() : "TIDAK REGISTER - TIDAK DIJAGA";
  const penjaga = raw.Penjaga ? raw.Penjaga.toUpperCase() : "TAK TERJAGA";

  // --- IBPR CALCULATION ---
  // Likelihood (1 - 5)
  let likelihood = 2;
  if (penjaga.includes("TAK TERJAGA") || penjaga.includes("TIDAK DIJAGA")) {
    likelihood += 3;
  } else if (penjaga.includes("SWADAYA")) {
    likelihood += 2;
  } else if (penjaga.includes("PEMDA") || penjaga.includes("DISHUB")) {
    likelihood += 1;
  } else if (penjaga.includes("KAI") || penjaga.includes("OP") || penjaga.includes("JJ")) {
    likelihood = 1;
  }

  if (lebar >= 8 || katJalan.includes("NASIONAL")) {
    likelihood += 1;
  }
  likelihood = Math.min(5, Math.max(1, likelihood));

  // Consequence / Severity (1 - 5)
  let consequence = 2;
  if (katJalan.includes("NASIONAL")) {
    consequence = 5;
  } else if (katJalan.includes("PROVINSI")) {
    consequence = 4;
  } else if (katJalan.includes("KABUPATEN") || katJalan.includes("KOTA")) {
    consequence = 3;
  } else {
    consequence = 2;
  }
  if (lebar >= 10 && consequence < 5) consequence += 1;

  const riskScore = likelihood * consequence; // 1 to 25

  // --- PERSONNEL EVALUATION ---
  // Personnel requirement standard
  let pjlNeeded = 4; // default standard 24h 3 shifts + 1 off
  if (katJalan.includes("DESA") && lebar <= 3) {
    pjlNeeded = 2; // daytime only or rural
  } else if (katJalan.includes("KABUPATEN") && lebar <= 5) {
    pjlNeeded = 3;
  }

  let pjlExisting = 0;
  let guardStatus = "Tak Terjaga";
  if (penjaga.includes("KAI") || statusJpl.includes("REGISTER - DIJAGA")) {
    pjlExisting = Math.max(3, pjlNeeded - (raw.Row % 3 === 0 ? 1 : 0)); // occasionally short 1 staff
    guardStatus = "Resmi KAI";
  } else if (penjaga.includes("PEMDA") || penjaga.includes("DISHUB")) {
    pjlExisting = Math.min(2, pjlNeeded - 1);
    guardStatus = "Pemda/Dishub";
  } else if (penjaga.includes("SWADAYA")) {
    pjlExisting = 1;
    guardStatus = "Swadaya Warga";
  } else {
    pjlExisting = 0;
    guardStatus = "Kosong / Tak Terjaga";
  }

  const pjlDeficit = Math.max(0, pjlNeeded - pjlExisting);

  // Dynamic IBPR Risk Classification:
  // Red (Extreme) if high risk score AND deficit of personnel, or very high traffic unmanaged
  let riskLevel = "Low";
  let markerColor = "green"; // 'green' | 'yellow' | 'orange' | 'red'

  if (riskScore >= 15 || (riskScore >= 10 && pjlDeficit >= 2)) {
    riskLevel = "Extreme";
    markerColor = "red";
  } else if (riskScore >= 10 || (riskScore >= 6 && pjlDeficit >= 2)) {
    riskLevel = "High";
    markerColor = "orange";
  } else if (riskScore >= 6 || pjlDeficit > 0) {
    riskLevel = "Medium";
    markerColor = "yellow";
  } else {
    riskLevel = "Low";
    markerColor = "green";
  }

  // Generate assigned personnel records if existing > 0
  const assignedStaff = [];
  for (let s = 0; s < pjlExisting; s++) {
    const nameIdx = (idx * 3 + s) % samplePjlNames.length;
    assignedStaff.push({
      nipp: `PJL-${raw.Row * 10 + s + 1000}`,
      name: samplePjlNames[nameIdx],
      role: "Penjaga Jalur Lintasan (PJL)",
      shift: s === 0 ? "Shift 1 (06:00 - 14:00)" : s === 1 ? "Shift 2 (14:00 - 22:00)" : "Shift 3 (22:00 - 06:00)",
      sertifikasiDjka: pjlExisting >= 3 ? "Aktif (SK DJKA 2024)" : "Pelatihan Swadaya",
      fitToWork: (idx + s) % 7 === 0 ? "Pengawasan Medis (Tensi 145/95)" : "Fit to Work (Prima)",
      lastMcu: "2026-08-15"
    });
  }

  // Facility Checklist
  const hasGardu = !penjaga.includes("TAK TERJAGA") && !penjaga.includes("TIDAK DIJAGA");
  const facilities = {
    posGardu: hasGardu ? "Tersedia (Permanen)" : "Tidak Ada Gardu",
    listrikPln: hasGardu ? (idx % 5 === 0 ? "PLN Sering Padam (Perlu Genset)" : "Tersedia PLN 900VA") : "Tidak Ada Listrik",
    radioHt: hasGardu ? (idx % 4 === 0 ? "HT Rusak / Baterai Drop" : "HT Operasional Frekuensi KA") : "Tidak Ada",
    teleponKereta: hasGardu && (penjaga.includes("KAI") || penjaga.includes("PEMDA")) ? "TOK Terhubung PPKA" : "Tidak Tersambung",
    palangPintu: statusJpl.includes("DIJAGA") ? (lebar >= 8 ? "Palang Elektrik Otomatis" : "Palang Manual Putar") : "Tanpa Palang Pintu",
    apar: hasGardu ? (idx % 6 === 0 ? "Kadaluarsa" : "APAR Powder 6kg Siap Pakai") : "Tidak Ada",
    semboyanLentera: hasGardu ? "Lentera Malam & Bendera Merah/Kuning Lengkap" : "Tidak Tersedia",
    p3k: hasGardu ? "Kotak P3K Lengkap" : "Tidak Ada"
  };

  // Hazard Identification & Risk Control (IBPR details)
  const hazards = [
    {
      hazard: "Penerobosan palang pintu oleh pengendara saat KA mendekat",
      impact: "Kecelakaan fatal temperan KA vs kendaraan, korban jiwa, KA tertunda",
      mitigasi: "Pemasangan portal ganda, sosialisasi penegakan hukum Dishub/Polri, CCTV tilang elektronik (ETLE)."
    },
    {
      hazard: "Antrean padat menumpuk di atas rel akibat bottle neck jalan raya",
      impact: "Kendaraan terjebak di tengah perlintasan saat kereta lewat",
      mitigasi: "Pemasangan Yellow Box Junction marka kuning, koordinasi penjagaan shift padat dengan Dishub."
    },
    {
      hazard: "Kelelahan (fatigue) dan kantuk petugas pada shift malam",
      impact: "Keterlambatan menutup palang pintu atau tidak mendengar genta warta KA",
      mitigasi: "Pemenuhan formasi minimal 4 personil per gardu, audit Fit-to-Work berkala, fasilitas istirahat layak."
    }
  ];

  return {
    id: `JPL-${raw.Row}`,
    noJpl: raw.NoJpl || `JPL.${raw.Row}`,
    row: raw.Row,
    antara: raw.Antara,
    stasiunA: stA.name,
    stasiunB: stB.name,
    kmHm: raw.KmHm,
    provinsi: raw.Provinsi,
    kabKota: raw.KabKota,
    namaJalan: raw.NamaJalan || "Jalan Tanpa Nama",
    kategoriJalan: raw.KategoriJalan || "Desa",
    lebarJpl: lebar,
    statusJpl: raw.StatusJpl || "TIDAK REGISTER - TIDAK DIJAGA",
    penjaga: raw.Penjaga || "TAK TERJAGA",
    guardStatus: guardStatus,
    daopDivre: raw.DaopDivre,
    prioritas: raw.Prioritas,
    opsiJenis: raw.OpsiJenis,
    coordinates: {
      lat: parseFloat(lat.toFixed(6)),
      lon: parseFloat(lon.toFixed(6))
    },
    ibpr: {
      likelihood: likelihood,
      consequence: consequence,
      riskScore: riskScore,
      riskLevel: riskLevel, // Extreme, High, Medium, Low
      markerColor: markerColor, // red, orange, yellow, green
      hazards: hazards
    },
    personnel: {
      role: "PJL (Penjaga Jalur Lintasan)",
      needed: pjlNeeded,
      existing: pjlExisting,
      deficit: pjlDeficit,
      status: pjlDeficit === 0 ? "Formasi Terpenuhi" : `Defisit ${pjlDeficit} Personel`,
      assignedStaff: assignedStaff
    },
    facilities: facilities
  };
});

// 6. Build Stasiun Dataset (PPKA & Petugas Langsir)
const samplePpkaNames = ["Kapten Ir. Rian Ardiansyah", "Dwi Cahyono, S.T.", "Agung Wicaksono", "Tri Wahyudi", "Bagus Purnomo", "Hadi Sutrisno", "Yudi Setiawan"];
const sampleLangsirNames = ["Joni Iskandar", "Samsul Bahri", "Rudi Hartono", "Maman Suherman", "Faisal Basri", "Doni Saputra"];

const stationsList = Object.keys(stationsMap).map((key, i) => {
  const st = stationsMap[key];
  const ppkaNeeded = st.class === "Besar" ? 5 : st.class === "Kelas I" ? 4 : 3;
  const ppkaExisting = (i % 5 === 0) ? ppkaNeeded - 1 : ppkaNeeded; // occasional deficit
  const ppkaDeficit = ppkaNeeded - ppkaExisting;

  const langsirNeeded = st.hasLangsir ? (st.class === "Besar" ? 6 : 3) : 0;
  const langsirExisting = st.hasLangsir ? (i % 4 === 0 ? langsirNeeded - 1 : langsirNeeded) : 0;
  const langsirDeficit = langsirNeeded - langsirExisting;

  const ppkaStaff = [];
  for (let p = 0; p < ppkaExisting; p++) {
    ppkaStaff.push({
      nipp: `PPKA-${st.code}-${p + 1}`,
      name: samplePpkaNames[(i + p) % samplePpkaNames.length],
      role: "PPKA (Pengatur Perjalanan Kereta Api)",
      shift: `Shift ${p % 3 + 1}`,
      sertifikasiDjka: "STTUK PPKA Kelas I/II Kemenhub (Berlaku s/d 2027)",
      fitToWork: "Fit To Work (Tensimeter 120/80)"
    });
  }

  const langsirStaff = [];
  for (let l = 0; l < langsirExisting; l++) {
    langsirStaff.push({
      nipp: `LGS-${st.code}-${l + 1}`,
      name: sampleLangsirNames[(i + l) % sampleLangsirNames.length],
      role: "Petugas Langsir (Juru Langsir)",
      shift: `Shift ${l % 2 + 1}`,
      sertifikasiDjka: "Sertifikat Petugas Langsir DJKA (Aktif)",
      fitToWork: "Fit To Work"
    });
  }

  return {
    id: `STN-${st.code}`,
    code: st.code,
    name: st.name,
    class: st.class,
    divre: st.divre,
    coordinates: {
      lat: st.lat,
      lon: st.lon
    },
    hasLangsir: st.hasLangsir,
    personnel: {
      ppka: {
        needed: ppkaNeeded,
        existing: ppkaExisting,
        deficit: ppkaDeficit,
        staff: ppkaStaff
      },
      langsir: {
        needed: langsirNeeded,
        existing: langsirExisting,
        deficit: langsirDeficit,
        staff: langsirStaff
      },
      totalDeficit: ppkaDeficit + langsirDeficit
    },
    ibpr: {
      hazards: [
        {
          hazard: "Salah rute persinyalan / kedudukan wesel (PPKA)",
          impact: "Risiko anjlokan sarana atau tabrakan kereta di emplasemen",
          mitigasi: "Interlocking elektronik SIL-4, double check Warta KA dan lembar bentuk warta operasional."
        },
        st.hasLangsir ? {
          hazard: "Petugas langsir terjepit di antara rangkaian kereta/coupler",
          impact: "Cedera berat hingga fatalitas pada juru langsir",
          mitigasi: "Kepatuhan SOP Peraturan Dinas 19 (PD 19), wajib koordinasi radio HT sebelum menyambung coupler."
        } : null
      ].filter(Boolean)
    },
    facilities: {
      ruangPpka: "Tersedia Meja Pelayanan Persinyalan",
      ruangIstirahat: "Tersedia Ruang Istirahat Ber-AC & Sofa",
      fitToWorkKit: "Tensimeter Digital & Alat Cek Alkohol",
      radioKomunikasi: "Radio Lokomotif Stasiun & HT Emplasemen Aktif",
      gensetOtomatis: "Tersedia Genset ATS 25 kVA"
    }
  };
});

// 7. Build Rumah Singgah Dataset
const processedRestHouses = rumahDinas.map((rd, i) => {
  return {
    id: `RS-${i + 1}`,
    nama: rd.Nama,
    type: rd.Type, // 'Griya Karya' or 'Rumah Singgah'
    lokasiStasiun: rd.Lokasi,
    alamat: rd.Alamat,
    divre: rd.Divre || "WILAYAH SUMATERA",
    coordinates: {
      lat: rd.Latitude,
      lon: rd.Longitude
    },
    kapasitas: rd.Type === "Griya Karya" ? 16 : 8,
    okupansiSaatIni: Math.floor(Math.random() * 5) + 2,
    kondisi: i % 7 === 0 ? "Cukup (Perlu Renovasi Sanitasi)" : "Sangat Baik (Terawat)",
    fasilitas: {
      kamarTidurBerAc: "Tersedia 4 - 8 Kamar",
      tempatTidurSingle: "Kasur Busa Tebal & Linen Bersih",
      kamarMandiMck: "2 - 4 Kamar Mandi Bersih dengan Shower",
      dapurPantry: "Dispenser, Kulkas, Alat Masak Dasar",
      ruangIstirahat: "TV Kabel & Wi-Fi KAI internal",
      kebersihan: "Petugas Cleaning Service Harian"
    }
  };
});

// 8. Save output files
const outDir = path.join(__dirname, 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'jpl_data.json'), JSON.stringify(processedJpls, null, 2));
fs.writeFileSync(path.join(outDir, 'stations_data.json'), JSON.stringify(stationsList, null, 2));
fs.writeFileSync(path.join(outDir, 'rest_houses_data.json'), JSON.stringify(processedRestHouses, null, 2));
fs.writeFileSync(path.join(outDir, 'railway_lines.json'), JSON.stringify(railwayGeoJSON, null, 2));

console.log("=== BUILD COMPLETE ===");
console.log(`Saved ${processedJpls.length} JPL records to data/jpl_data.json`);
console.log(`Saved ${stationsList.length} Station records to data/stations_data.json`);
console.log(`Saved ${processedRestHouses.length} Rest House records to data/rest_houses_data.json`);
console.log(`Saved Railway GeoJSON with ${railwayGeoJSON.features.length} lines to data/railway_lines.json`);

// Summary breakdown of risk levels
const riskCounts = processedJpls.reduce((acc, cur) => {
  acc[cur.ibpr.riskLevel] = (acc[cur.ibpr.riskLevel] || 0) + 1;
  return acc;
}, {});
console.log("Risk breakdown:", riskCounts);

const deficitCount = processedJpls.filter(j => j.personnel.deficit > 0).length;
console.log(`Total JPL with personnel deficit: ${deficitCount} of ${processedJpls.length}`);
