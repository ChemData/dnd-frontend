module.exports = {
  extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "vue/max-attributes-per-line": 0,
    "vue/singleline-html-element-content-newline": 0,
  },
  parser: "@typescript-eslint/parser",
};
