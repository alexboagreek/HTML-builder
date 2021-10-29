const fs = require('fs/promises');
const path = require('path');

const newFolderPath = path.join(__dirname, 'files-copy');
const baseFolderPath = path.join(__dirname, 'files');

async function copyFolder() {
 
  await fs.mkdir(newFolderPath, { recursive: true });
  const files = await fs.readdir(baseFolderPath);

  files.forEach(async (file) => {
    const baseFile = path.join(__dirname, 'files', file);
    const newFile = path.join(__dirname, 'files-copy', file);
    await fs.copyFile(baseFile, newFile);
  });
}

copyFolder();