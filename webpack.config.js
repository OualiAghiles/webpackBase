const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dev = process.env.NODE_ENV === 'dev'

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
  // entry: ['./src/template/index.pug', './src/assets/sass/main.scss', './src/assets/js/main.js'],
  entry: ['./src/template/index.pug', './src/assets/sass/main.scss', './src/assets/js/main.js'],
  // surveille les modification des fichier
  watch: dev,
  // les fichier génerer (les sorties)
  output: {
    // dossier de distribution
    path: path.resolve('/dist/'),
    // fichier avec toutes les fonction combiner
    filename: dev ? '[name].js' : '[name].[chunkhash:8].js'
  },
  // Activation du devtool (sourceMap Line)
  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
  devServer: {
    // Pour afficher les erreurs sur la page
    overlay: true,
    // Fichiers à distribuer
    port: 9090,
    contentBase: '/dist/'
  },
  // les modules
  module: {
    // les regles
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['eslint-loader']
      },
      {
        // test les extention des fichier *.js
        test: /\.js$/,
        // fichier a exlure
        exclude: /(node_modules|bower_components)/,
        // loader a utiliser
        use: {
          loader: 'babel-loader'
        }
      },
      {
        // css reading
        test: /\.css$/,
        use: ['cssLoader']
      },
      {
        // sass reading
        test: /\.(sass|scss)$$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoader, 'sass-loader']
        }))
      },
      {
        test: /\.pug/,
        loaders: ['html-loader', 'pug-html-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[hash:7].[ext]',
              mozjpeg: {
                progressive: true,
                arithmetic: false
              },
              optipng: false, // disabled
              pngquant: {
                floyd: 0.5,
                speed: 2
              },
              svgo: {
                plugins: [
                  { removeTitle: true },
                  { convertPathData: false }
                ]
              }
            }
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !dev
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: dev ? '[name].css' : '[name].[contenthash:8].css'
      // disable: dev
    }),
    new HtmlWebpackPlugin({
      title: 'Home',
      hash: true,
      template: 'src/template/index.pug',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Contact',
      hash: true,
      template: 'src/template/contact.pug',
      filename: 'contact.html'
    })
  ]
}
if (!dev) {
  config.plugins.push(new UglifyJsPlugin ({
    sourceMap: false
  })
  )
  config.plugins.push(new ManifestPlugin()),    
  config.plugins.push(new CleanWebpackPlugin (['dist'],{
    root: path.resolve('./'),
    verbose: true,
    dry: false,
  })
  )
}
module.exports = config
