module.exports = {
  overrides: [
    {
      // Declare an override that applies to TypeScript files only
      files: ['*.ts', '*.tsx'],

      rules: {
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              Array: 'Use `[]` instead.',
            },
          },
        ],
      },
    },
  ],
};
