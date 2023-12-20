/* eslint-disable @typescript-eslint/no-unused-vars */
import https from 'https';
import path from 'path';
import { createWriteStream } from 'fs';
import { ensureDir } from 'fs-extra';
import { intro, outro } from '@clack/prompts';
import AdmZip from 'adm-zip';

// const ensureDirectoryExistence = async (dest: string) => {
//   try {
//     await access(dest);
//   } catch (error) {
//     await mkdir(dest, { recursive: true });
//   }
// };

const downloadFile = (url: string, dest: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const downloadZipPath = path.join(dest, '/download.zip');
    const file = createWriteStream(downloadZipPath);
    https
      .get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            resolve(downloadZipPath);
          });
        });
      })
      .on('error', err => {
        reject(err);
      });
  });

// const unzipFile = (filePath: string, dest: string) => {
//   const unzipPath = path.join(dest, 'temp_unzip');
//   const zip = new AdmZip(filePath);
//   zip.extractAllTo(unzipPath, true);
//   return unzipPath;
// };

// const copyFiles = (srcDir: string, destDir: string) => {
//   cp('-R', [`${srcDir}/*`, `${srcDir}/.*`], destDir);
// };

// const deleteFiles = (dest: string) => {
//   rm('-rf', dest);
// };

const downloadAndUnzip = async (url: string, root: string) => {
  try {
    // console.log('ora', ora);
    // await ensureDir(root);
    //   ensureDirectoryExistence(root);
    //   const downloadZipPath = await downloadFile(url, root);
    //   console.log(`Downloaded to ${downloadZipPath}`);
    //   const unzipPath = unzipFile(downloadZipPath, root);
    //   console.log(`Extracted to ${unzipPath}`);
    //   const files = readdirSync(unzipPath);
    //   const srcPath = path.join(unzipPath, files[0]);
    //   copyFiles(srcPath, root);
    //   console.log(`Copied all unzip files to ${root}`);
    //   deleteFiles(downloadZipPath);
    //   deleteFiles(unzipPath);
    //   console.log(`Deleted zip file: ${downloadZipPath}`);
  } catch (err) {
    console.error('Error:', err);
  }
};

export { downloadAndUnzip };
