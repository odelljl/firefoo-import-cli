import eslint from '@eslint/js';
// noinspection SpellCheckingInspection
import tseslint from 'typescript-eslint';

// noinspection JSUnusedGlobalSymbols
export default [
  { files: ['src/*.{js,mjs,cjs,ts}'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
];
