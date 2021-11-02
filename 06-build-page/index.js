const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');

const pathCss = path.join(__dirname, 'styles');
const pathHtml = path.join(__dirname, 'template.html');
const pathAssets = path.join(__dirname, 'assets');
const pathComponents = path.join(__dirname, 'components');
const pathCssBundle = path.join(__dirname, 'project-dist', 'style.css');
const pathAssetsBundle = path.join(__dirname, 'project-dist', 'assets');
const pathHtmlBundle = path.join(__dirname, 'project-dist', 'index.html');

let htmlFile = '';

async function createHtmlBundle() {
  const articles = await fsProm.readFile(path.join(pathComponents, 'articles.html'));
  const footer = await fsProm.readFile(path.join(pathComponents, 'footer.html'));
  const header = await fsProm.readFile(path.join(pathComponents, 'header.html'));

  const readable = fs.createReadStream(pathHtml, 'utf8');

  readable.on('data', (chunk) => {
    htmlFile = chunk.toString().replace('{{header}}', header);
    htmlFile = htmlFile.replace('{{articles}}', articles);
    htmlFile = htmlFile.replace('{{footer}}', footer);
  });

  readable.on('end', async () => {
    await fsProm.writeFile(pathHtmlBundle, htmlFile, 'utf8');
  });
}

async function createCssBundle() {
  const allFiles = await fsProm.readdir(pathCss);
  const cssFiles = allFiles.filter(file => path.extname(file) === '.css');
  const stream = fs.createWriteStream(pathCssBundle, 'utf8');

  streamMergeRecursive(cssFiles, stream);
}

function streamMergeRecursive(files = [], fileWriteStream) {
  if (!files.length) {
    return fileWriteStream.end();
  }

  const currentFile = path.resolve(pathCss, files.shift());
  const currentReadStream = fs.createReadStream(currentFile, 'utf8');

  currentReadStream.pipe(fileWriteStream, { end: false });
  currentReadStream.on('end', function () {
    fileWriteStream.write('\n\n');
    streamMergeRecursive(files, fileWriteStream);
  });

  currentReadStream.on('error', function (error) {
    console.error(error);
    fileWriteStream.close();
  });
}

async function crateBuildFolder() {
  const newFolderPath = path.join(__dirname, 'project-dist');
  await fsProm.mkdir(newFolderPath, { recursive: true });
}

async function copyAssets(pathBundle, pathSource) {
  await fsProm.mkdir(pathBundle, { recursive: true });
  const files = await fsProm.readdir(pathSource);

  files.forEach(async (file) => {
    const baseFile = path.join(pathSource, file);
    const newFile = path.join(pathBundle, file);
    const stat = await fsProm.stat(baseFile);
    if (stat.isDirectory()) {
      copyAssets(newFile, baseFile);
    } else {
      await fsProm.copyFile(baseFile, newFile);
    }
  });
}

async function buildPage() {
  await crateBuildFolder();
  createHtmlBundle();
  createCssBundle();
  copyAssets(pathAssetsBundle, pathAssets);
}

buildPage();