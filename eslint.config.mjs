import pluginJs from '@eslint/js';
// noinspection SpellCheckingInspection
import tseslint from 'typescript-eslint';

// noinspection JSUnusedGlobalSymbols
export default [
  { files: ['src/*.{js,mjs,cjs,ts}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
