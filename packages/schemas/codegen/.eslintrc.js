// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@body-link/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@body-link/eslint-config/profile/node'],
  parserOptions: { tsconfigRootDir: __dirname },
};
