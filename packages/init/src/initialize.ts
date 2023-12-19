import path from 'path';

import { getPrompt } from './prompts';
import { downloadAndUnzip } from './download';

const initialize = async () => {
  const options = await getPrompt();
  const dest = path.join(process.cwd(), options.name);
  console.log('options', dest);
  const url = `https://codeload.github.com/enforcer-squad/tpl-lib-ts/zip/refs/heads/main`;
  await downloadAndUnzip(url, dest, dest);
};

export default initialize;
