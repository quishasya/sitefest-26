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

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        report.coordinates = { lat, lng };

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const data = await res.json();

          const addr = data.address;
          report.location =
            addr.road ||
            addr.neighbourhood ||
            addr.suburb ||
            addr.village ||
            addr.town ||
            addr.city ||
            data.display_name;

          if (!document.getElementById("kecamatan").value) {
            document.getElementById("kecamatan").value =
              addr.suburb || addr.village || "";
          }
          if (!document.getElementById("kelurahan").value) {
            document.getElementById("kelurahan").value =
              addr.quarter || addr.neighbourhood || "";
          }
        } catch (err) {
          report.location = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }

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
      {
        timeout: 10000,
        maximumAge: 60000,
        enableHighAccuracy: false,
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
