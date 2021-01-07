const {
  override,
  addBabelPreset,
} = require('customize-cra');

module.exports = override(
  addBabelPreset([
    '@babel/preset-typescript', {
      allowDeclareFields: true,
    }
  ]),
);