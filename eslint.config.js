const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // ✅ Ignorar especificamente o erro de importação de @env
      'import/no-unresolved': ['error', { ignore: ['^@env$'] }]
    }
  }
]);
