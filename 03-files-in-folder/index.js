const fs = require('fs/promises');
const path = require('path');

const readPath = path.join(__dirname, 'secret-folder');

async function printFileInfo(file) {
  const filePath = path.join(__dirname, 'secret-folder', file);
  const stat = await fs.stat(filePath);

  if (!stat.isDirectory()) {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const info = `${name} - ${ext.slice(1)} - ${Math.round(stat.size / 1024)}kb\n`;
    process.stdout.write(info);
  }
}

async function runRead() {
  const files = await fs.readdir(readPath);

  files.forEach(async (file) => {
    printFileInfo(file);
  });
}

runRead();