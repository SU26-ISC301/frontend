const fs = require('fs');

function searchFile(filePath, term) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`=== Matches in ${filePath} ===`);
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(term.toLowerCase())) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
}

searchFile('src/pages/VendorHome.jsx', 'delete');
searchFile('src/pages/AdminDashboard.jsx', 'delete');
searchFile('src/pages/VendorHome.jsx', 'remove');
searchFile('src/pages/AdminDashboard.jsx', 'remove');
