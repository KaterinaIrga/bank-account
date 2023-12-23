const path = require('path')
const webpack = require('webpack')
/*
module.exports = {
  entry: './src/scripts/index.js',
  output: {
    // Путь до директории (важно использовать path.resolve):
    path: path.resolve(__dirname, 'dist'),
    // Имя файла со сборкой:
    filename: 'bundle.js'
  }
} */

module.exports = {
  mode: 'development',
  devtool:"source-map",
  devtool: 'eval-cheap-source-map',
  output: {
      filename: 'bundle.js',
      sourceMapFilename: "dist/js/bundle.js.map",
      pathinfo: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
  ]
}