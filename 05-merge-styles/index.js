const fs = require('fs');
const path = require('path');
const fsProm = require('fs/promises');

const pathCss = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function createBundle() {
  const allFiles = await fsProm.readdir(pathCss);
  const cssFiles = allFiles.filter(file => path.extname(file) === '.css');
  const stream = fs.createWriteStream(pathBundle, 'utf8');

  streamMergeRecursive(cssFiles, stream);

}

function streamMergeRecursive(files = [], fileWriteStream){
  if (!files.length) {
    return fileWriteStream.end();
  }
  const currentFile = path.resolve(pathCss, files.shift());
  const currentReadStream = fs.createReadStream(currentFile, 'utf8');
  
  currentReadStream.pipe(fileWriteStream, { end:false });
  currentReadStream.on('end', function () {
    streamMergeRecursive(files, fileWriteStream);
  });
  
  currentReadStream.on('error', function (error) {
    console.error(error);
    fileWriteStream.close();
  });
}
createBundle();