import https from 'https';
import path from 'path';
import { createWriteStream } from 'fs';
import { unlink, access, mkdir } from 'node:fs/promises';
import AdmZip from 'adm-zip';

const ensureDirectoryExistence = async (filePath: string) => {
  const dirname = path.dirname(filePath);
  try {
    await access(dirname);
  } catch (error) {
    await mkdir(dirname, { recursive: true });
  }
};

const downloadFile = async (url: string, dest: string) => {
  await ensureDirectoryExistence(dest);
  const downloadResultPath = await new Promise((resolve, reject) => {
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
  return downloadResultPath as string;
};

const unzipFile = async (filePath: string, dest: string) =>
  await new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip(filePath);
      zip.extractAllTo(dest, true);
      resolve('ok');
    } catch (err) {
      reject(err);
    }
  });

const downloadAndUnzip = async (url: string, dest: string, unzipPath: string) => {
  try {
    const downloadZipPath = await downloadFile(url, dest);
    console.log(`Downloaded to ${dest}`);

    await unzipFile(downloadZipPath, unzipPath);
    console.log(`Extracted to ${downloadZipPath}`);

    await unlink(downloadZipPath);
    console.log(`Deleted ZIP file: ${dest}`);
  } catch (err) {
    console.error('Error:', err);
  }
};

export { downloadAndUnzip };
