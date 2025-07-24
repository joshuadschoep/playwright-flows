// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // Disables the rule
    // Or, set to 'warn' to show a warning instead of an error
    // '@typescript-eslint/no-explicit-any': 'warn',
  },
});
