module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    'vue/max-attributes-per-line': 0,
    'vue/singleline-html-element-content-newline': 0
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
  "parser": "@typescript-eslint/parser"
}