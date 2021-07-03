module.exports = {
  stories: ['../src/**/*.story.tsx'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        viewport: false,
        docs: false,
      },
    },
    '@storybook/addon-storysource',
    '@storybook/addon-docs',
  ],
};
