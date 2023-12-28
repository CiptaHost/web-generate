// Mengambil konfigurasi dari file config.js
var config = {
  expirationDays: 7, // Default value
};

// Coba untuk mendapatkan konfigurasi dari localStorage
try {
  var storedConfig = localStorage.getItem('pageConfig');
  if (storedConfig) {
    config = JSON.parse(storedConfig);
  }
} catch (error) {
  console.error('Error loading configuration:', error);
}

// Simpan konfigurasi ke localStorage
function saveConfig() {
  try {
    localStorage.setItem('pageConfig', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving configuration:', error);
  }
}

function generateRandomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function createPage() {
  var pageTitle = document.getElementById('pageTitle').value;
  var randomURL = generateRandomString(8);
  
  // Ambil isi dari template.html dan tempatkan dalam variabel templateHTML
  var templateHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="styles.css">
        <title>${pageTitle}</title>
    </head>
    <body>
        <header>
            <h1>${pageTitle}</h1>
        </header>
        <main>
            <p>Selamat datang di halaman ${pageTitle} yang dibuat secara dinamis!</p>
        </main>
        <footer>
            <p>&copy; 2023 Your Website</p>
        </footer>
    </body>
    </html>
  `;
  
  var blob = new Blob([templateHTML], { type: 'text/html' });
  var newPageURL = URL.createObjectURL(blob);
  var finalURL = 'https://yourwebsite.com/' + randomURL + '.html';

  // Simpan informasi halaman yang baru dibuat ke localStorage
  var storedPages = JSON.parse(localStorage.getItem('generatedPages')) || {};
  storedPages[randomURL] = {
    url: finalURL,
    title: pageTitle,
    expiration: new Date().getTime() + config.expirationDays * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem('generatedPages', JSON.stringify(storedPages));

  // Tampilkan link yang telah digenerate di bawah formulir
  var generatedLinkElement = document.getElementById('generatedLink');
  generatedLinkElement.innerHTML = '<p>Generated Page Link: <a href="' + finalURL + '" target="_blank">' + finalURL + '</a></p>';

  // Set timeout untuk menghapus halaman setelah waktu tertentu
  setTimeout(function () {
    // Hapus halaman dari localStorage jika ada
    var storedPages = JSON.parse(localStorage.getItem('generatedPages')) || {};
    delete storedPages[randomURL];
    localStorage.setItem('generatedPages', JSON.stringify(storedPages));
  }, config.expirationDays * 24 * 60 * 60 * 1000); // Konversi hari ke milidetik

  // Buka halaman baru dalam tab atau window baru
  window.open(finalURL, '_blank');
}
