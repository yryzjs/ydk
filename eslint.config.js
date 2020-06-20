const path = require('path')
const reactAppPath = path.join(process.cwd(), 'node_modules', 'eslint-config-react-app')
const reactAppConfig = require(reactAppPath)

const {overrides} = reactAppConfig
overrides[0].rules = {
  ...overrides[0].rules,
  '@typescript-eslint/no-unused-vars': 'off',
  'no-unused-vars': 'off',
  'no-script-url': 'off',
  'jsx-a11y/anchor-is-valid': 'off',
}
module.exports = reactAppConfig
