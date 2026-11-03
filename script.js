let angka = 0;

// Elemen DOM
const tampilan = document.getElementById("angka");
const tambah = document.getElementById("tambah");
const kurang = document.getElementById("kurang");
const reset = document.getElementById("reset");
const toast = document.getElementById("toast");
const stepSelect = document.getElementById("stepSelect");
const targetInput = document.getElementById("targetInput");
const targetProgress = document.getElementById("targetProgress");
const cardContainer = document.getElementById("cardContainer");
const historyList = document.getElementById("historyList");
const islandStatus = document.getElementById("islandStatus");

// --- SYSTEM EFEK SUARA (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq = 440, type = 'sine', duration = 0.08) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// --- UPDATE TAMPILAN & WARNA ---
function updateTampilan() {
  tampilan.textContent = angka;

  // Ubah warna dinamis berdasarkan nilai
  tampilan.classList.remove("positif", "negatif", "netral");
  if (angka > 0) {
    tampilan.classList.add("positif");
  } else if (angka < 0) {
    tampilan.classList.add("negatif");
  } else {
    tampilan.classList.add("netral");
  }

  // Efek Animasi Pop
  tampilan.classList.add("pop");
  setTimeout(() => tampilan.classList.remove("pop"), 150);

  // Cek Target
  cekTarget();
}

// --- SYSTEM RIWAYAT (HISTORY LOG) ---
function addHistory(aksi, nilaiAwal, nilaiAkhir) {
  // Hapus pesan "Belum ada riwayat" jika ada
  const emptyItem = historyList.querySelector(".empty-history");
  if (emptyItem) emptyItem.remove();

  const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const li = document.createElement("li");
  li.innerHTML = `<span>${aksi} (${nilaiAwal} → ${nilaiAkhir})</span><span style="opacity:0.5; font-size:0.75rem">${time}</span>`;
  
  historyList.insertBefore(li, historyList.firstChild);

  // Batasi hanya 5 riwayat terakhir
  if (historyList.children.length > 5) {
    historyList.removeChild(historyList.lastChild);
  }
}

// --- CEK TARGET COUNTER ---
function cekTarget() {
  const target = parseInt(targetInput.value);

  if (!isNaN(target) && target !== 0) {
    targetProgress.textContent = `Target: ${angka} / ${target}`;

    if (angka === target) {
      cardContainer.classList.add("target-reached");
      islandStatus.textContent = "🎯 Target Tercapai!";
      showToast("🎉 Selamat! Target kamu tercapai!");
      playSound(880, 'triangle', 0.3); // Suara sukses
    } else {
      cardContainer.classList.remove("target-reached");
      islandStatus.textContent = "Yann Project • Aktif 👍";
    }
  } else {
    targetProgress.textContent = "Target: Belum diatur";
    cardContainer.classList.remove("target-reached");
  }
}

// --- NOTIFIKASI TOAST ---
function showToast(pesan) {
  toast.textContent = pesan;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// --- EVENT LISTENERS ---
tambah.addEventListener("click", function () {
  const step = parseInt(stepSelect.value) || 1;
  const awal = angka;
  angka += step;
  updateTampilan();
  playSound(520, 'sine', 0.06);
  addHistory(`+${step}`, awal, angka);
});

kurang.addEventListener("click", function () {
  const step = parseInt(stepSelect.value) || 1;
  const awal = angka;
  angka -= step;
  updateTampilan();
  playSound(380, 'sine', 0.06);
  addHistory(`-${step}`, awal, angka);
});

reset.addEventListener("click", function () {
  const awal = angka;
  angka = 0;
  updateTampilan();
  playSound(220, 'sawtooth', 0.15);
  addHistory("Reset", awal, 0);
  showToast("Angka berhasil di-reset ke 0");
});

targetInput.addEventListener("input", cekTarget);