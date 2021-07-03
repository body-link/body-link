module.exports = {
  extends: [
    '@rushstack/eslint-config/profile/web-app',
    '@rushstack/eslint-config/mixins/react',
    '../mixins/base',
  ],
  settings: {
    react: {
      version: '17.0',
    },
  },
};
