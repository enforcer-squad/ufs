import { getPrompt } from './prompts';

const initialize = async () => {
  const options = await getPrompt();

  console.log('options', options);
};

export default initialize;
