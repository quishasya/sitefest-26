const CATEGORY_TEXT = {
  jalan: "Jalan & Infrastruktur",
  kebersihan: "Kebersihan",
  lampu: "Lampu Jalan",
  drainase: "Drainase",
  fasilitas: "Fasilitas Umum",
  lainnya: "Lainnya",
};

const STATUS_TEXT = {
  pending: "Menunggu",
  progress: "Diproses",
  resolve: "Selesai",
};

let reports = JSON.parse(localStorage.getItem("reports")) || [];
