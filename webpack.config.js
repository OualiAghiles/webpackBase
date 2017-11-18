const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
let cssLoader = [
  { loader: 'css-loader', options: { importLoaders: 1 } },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: (loader) => [
        require('autoprefixer')({
          browsers: ['last 2 versions', 'ie > 8']
        })
      ]
    }
  }
]
let config = {
  // les fichier a voir (les entrer) 
  entry: './src/assets/js/main.js',
  // surveille les modification des fichier
  watch: true,
  // les fichier génerer (les sorties) 
  output: {
    // dossier de distribution
    path: path.resolve(__dirname, 'dist'),
    // fichier avec toutes les fonction combiner
    filename: 'bundle.js'
  },
  // Activation du devtool (sourceMap Line)
  devtool: 'cheap-module-eval-source-map',
  // les modules 
  module: {
    // les regles
    rules: 
          [
            {
              //test les extention des fichier *.js
              test: /\.js$/,
              // fichier a exlure
              exclude: /(node_modules|bower_components)/,
              // loader a utiliser
              use:{
                loader: 'babel-loader'
              }
            },
            {
              // css reading
              test: /\.css$/,
              use: ['style-loader','css-loader']
            },
            {
              // sass reading
              test: /\.(sass|scss)$$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use:[
                  { loader: 'css-loader', options: { importLoaders: 1 } },
                  {
                    loader: 'postcss-loader',
                    options: {
                      ident: 'postcss',
                      plugins: (loader) => [
                        require('autoprefixer')({
                          browsers: ['last 2 versions', 'ie > 8']
                        })
                      ]
                    }
                  },
                  'sass-loader'
                ]
              })
            },
      ] 
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      //disable: dev
    }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
}
// if (!dev) {
//   config.plugins.push(new UglifyJsPlugin())
// }
module.exports = config
