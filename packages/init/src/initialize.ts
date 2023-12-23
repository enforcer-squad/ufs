import path from 'path';
import { createWriteStream, readdirSync } from 'fs';
import { ensureDir, copy, remove } from 'fs-extra';
import https from 'https';
import { intro, outro, spinner, text, select, note } from '@clack/prompts';
import AdmZip from 'adm-zip';
import { exec, cd } from 'shelljs';

const urlMaps = {
  'product|typescript': 'https://codeload.github.com/enforcer-squad/tpl-react-product-ts/zip/refs/heads/main',
  'product|javascript': 'https://codeload.github.com/enforcer-squad/tpl-react-product-js/zip/refs/heads/main',
  'lib|typescript': 'https://codeload.github.com/enforcer-squad/tpl-lib-ts/zip/refs/heads/main',
  'lib|javascript': 'https://codeload.github.com/enforcer-squad/tpl-lib-js/zip/refs/heads/main',
};

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

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

const unzipFile = (filePath: string, dest: string) => {
  const unzipPath = path.join(dest, 'temp_unzip');
  const zip = new AdmZip(filePath);
  zip.extractAllTo(unzipPath, true);
  return unzipPath;
};

const initialize = async () => {
  try {
    const s = spinner();

    intro(`Create app`);

    const projectName = (await text({
      message: "What's your project name?",
      validate(value) {
        if (value.length === 0) return `project name is required!`;
      },
    })) as string;

    const projectType = (await select({
      message: 'Select project type.',
      options: [
        { value: 'product', label: 'Product', hint: 'if you don’t want to make a library, just choose it.' },
        { value: 'lib', label: 'Lib', hint: 'just select it when making a library' },
      ],
    })) as string;

    const projectLanguage = (await select({
      message: 'Select project language.',
      options: [
        { value: 'typescript', label: 'Typescript' },
        { value: 'javascript', label: 'Javascript' },
      ],
    })) as string;

    const root = path.join(process.cwd(), projectName);

    s.start('Create folder...');
    await ensureDir(root);
    await sleep(100);
    s.stop('Folder creation completed.');

    s.start('Start downloading the compressed package...');
    const key = `${projectType}|${projectLanguage}` as keyof typeof urlMaps;
    const url = urlMaps[key];
    const downloadZipPath = await downloadFile(url, root);
    s.stop('Download completed.');

    s.start('Start decompressing...');
    const unzipPath = unzipFile(downloadZipPath, root);
    await sleep(100);
    s.stop('Decompression completed.');

    s.start('Start copying...');
    const files = readdirSync(unzipPath);
    const srcPath = path.join(unzipPath, files[0]);
    const destPath = path.join(root);
    await copy(srcPath, destPath);
    s.stop('Copy completed.');

    s.start('Start cleaning...');
    await remove(downloadZipPath);
    await remove(unzipPath);
    cd(projectName);
    exec('git init -b main');
    exec('chmod ug+x .husky/*');
    s.stop('Cleanup completed.');
    const nextSteps = [`cd ${projectName}`, `pnpm install`, `pnpm start`];

    note(nextSteps.join('\n'), 'Next steps');
    outro(`Completed!`);
  } catch (error) {
    console.log('An error occurred ', error);
  }
};

export default initialize;
