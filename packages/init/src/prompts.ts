import { input, select } from '@inquirer/prompts';

const getPrompt = async () => {
  const name = await input({
    message: "What's your project name?",
  });

  const type = await select({
    message: 'Select type',
    choices: [
      {
        name: 'Product',
        value: 'product',
        description: 'if you don’t want to make a library, just choose it.',
      },
      {
        name: 'Lib',
        value: 'lib',
        description: 'just select it when making a library',
      },
    ],
  });

  const language = await select({
    message: 'Select language',
    choices: [
      {
        name: 'Typescript',
        value: 'typescript',
      },
      {
        name: 'Javascript',
        value: 'javascript',
      },
    ],
  });

  return { name, type, language };
};

export { getPrompt };
