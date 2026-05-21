// Menyimpan seluruh data report
function saveReports() {
  localStorage.setItem("reports", JSON.stringify(reports));
}

function addReport() {
  const report = {
    id: Date.now().toString(),

    title: document.getElementById("judul").value,
    category: document.getElementById("kategori").value,
    description: document.getElementById("deskripsi").value,
    location: document.getElementById("lokasi").value,
    kecamatan: document.getElementById("kecamatan").value,
    kelurahan: document.getElementById("kelurahan").value,
    name: document.getElementById("nama").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("telepon").value,

    status: "pending",
    createdAt: new Date().toISOString(),
    coordinates: null,
  };

  //   Meminta izin lokasi ke device
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        report.coordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        report.location = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;

        reports.unshift(report);
        saveReports();
        closeModal();
        renderReports();
        updateStatus();
        alert("Laporan berhasil ditambahkan!");
      },

      (err) => {
        console.warn("Gagal ambil lokasi", err.message);
      },
    );
  } else {
    alert("Browser kamu tidak mendukung geolocation");
  }
}

function deleteReport(id) {
  const yakin = confirm("Yakin mau menghapus laporan ini?");
  if (yakin) {
    reports = reports.filter((report) => report.id !== id);
    saveReports();
    renderReports();
    updateStatus();
  }
}

let editingId = null;

function editReport(id) {
  const report = reports.find((r) => r.id === id);
  if (!report) return;

  document.getElementById("judul").value = report.title;
  document.getElementById("kategori").value = report.category;
  document.getElementById("deskripsi").value = report.description;
  document.getElementById("lokasi").value = report.location;
  document.getElementById("kecamatan").value = report.kecamatan;
  document.getElementById("kelurahan").value = report.kelurahan;
  document.getElementById("nama").value = report.name;
  document.getElementById("email").value = report.email;
  document.getElementById("telepon").value = report.phone;

  editingId = id;

  document.querySelector("#addForm button[type='submit']").textContent =
    "Simpan Perubahan";

  openModal();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Mode edit
  if (editingId) {
    const idx = reports.findIndex((r) => r.id === editingId);
    if (idx !== -1) {
      reports[idx] = {
        ...reports[idx],
        title: document.getElementById("judul").value,
        category: document.getElementById("kategori").value,
        description: document.getElementById("deskripsi").value,
        location: document.getElementById("lokasi").value,
        kecamatan: document.getElementById("kecamatan").value,
        kelurahan: document.getElementById("kelurahan").value,
        name: document.getElementById("nama").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("telepon").value,
      };
    }

    saveReports();
    renderReports();
    updateStatus();
    closeModal();

    alert("Laporan berhasil diperbarui!");

    editingId = null;
    document.querySelector("#addForm button[type='submit']").textContent =
      "Tambah Laporan";
    form.reset();
  } else {
    addReport();
    form.reset();
  }
});

function closeModal() {
  modal.style.display = "none";
  form.reset();
  editingId = null;
  document.querySelector("#addForm button[type='submit']").textContent =
    "Tambah Laporan";
}
