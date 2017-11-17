const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const dev = process.env.NODE_ENV === 'dev'

let config = {
  // les fichier a voir (les entrer) 
  entry: './src/assets/js/main.js',
  // surveille les modification des fichier
  watch: true,
  // les fichier génerer (les sorties) 
  output: {
    // dossier de distribution
    path: path.resolve('./dist'),
    // fichier avec toutes les fonction combiner
    filename: 'bundle.js'
  },
  // les modules 
  module: {
    // les regles
    rules: [
      {
        //test les extention des fichier *.js
        test: /\.js/,
        // fichier a exlure
        exclude: /(node_modules|bower_components)/,
        // loader a utiliser
        use:{
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
  ]
}
if (!dev) {
  config.plugins.push(new UglifyJsPlugin())
}
module.exports = config
