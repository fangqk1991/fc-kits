const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const merge = require('webpack-merge')
const tsImportPluginFactory = require('ts-import-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: [require('postcss-import'), require('postcss-url'), require('autoprefixer')],
  },
}

const generateConfigBase = () => {
  return {
    stats: 'normal',
    output: {
      filename: '[name].js',
      publicPath: '/',
      pathinfo: false,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            happyPackMode: true,
            appendTsSuffixTo: [/\.vue$/],
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory([
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                  },
                  {
                    style: false,
                    libraryName: 'lodash',
                    libraryDirectory: null,
                    camel2DashComponentName: false,
                  },
                ]),
              ],
            }),
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          include: /node_modules\/@fangcha\/vue/,
          options: {
            happyPackMode: true,
            appendTsSuffixTo: [/\.vue$/],
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory([
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                  },
                  {
                    style: false,
                    libraryName: 'lodash',
                    libraryDirectory: null,
                    camel2DashComponentName: false,
                  },
                ]),
              ],
            }),
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          include: /node_modules\/@fangcha\/.*-(frontend|vue)/,
          options: {
            happyPackMode: true,
            appendTsSuffixTo: [/\.vue$/],
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory([
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                  },
                  {
                    style: false,
                    libraryName: 'lodash',
                    libraryDirectory: null,
                    camel2DashComponentName: false,
                  },
                ]),
              ],
            }),
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
            cacheCompression: false,
            cacheDirectory: true,
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          extensions: {
            vue: true,
          },
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      new VueLoaderPlugin(),
      // eslint-disable-next-line
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh/),
      new NodePolyfillPlugin(),
    ],
  }
}

class WebpackBuilder {
  constructor() {
    this.configBase = generateConfigBase()
    this.isDev = true
    this.port = 8080
    this.entry = {
      app: './src/app',
    }
    this.extras = {}
    this.antdCustomVarsFile = ''
    this.aliasMap = {}
  }

  _templateFilePath = `${__dirname}/index.ejs`
  _templateParameters = {
    htmlTitle: 'App',
  }
  setTemplateInfo(filePath, params) {
    this._templateFilePath = filePath
    this._templateParameters = params || {}
    return this
  }

  setHtmlTitle(title) {
    this._templateParameters.htmlTitle = title
    return this
  }

  setAntdCustomVarsFile(filePath) {
    this.antdCustomVarsFile = filePath
    return this
  }

  setAlias(alias, path) {
    this.aliasMap[alias] = path
    return this
  }

  /**
   * @param isDev { boolean }
   * @returns {WebpackBuilder}
   */
  setDevMode(isDev) {
    this.isDev = isDev
    return this
  }

  /**
   * @param port { number }
   * @returns {WebpackBuilder}
   */
  setPort(port) {
    this.port = port
    return this
  }

  /**
   * @param extras { object }
   * @returns {WebpackBuilder}
   */
  setExtras(extras) {
    this.extras = extras
    return this
  }

  /**
   * @param publicPath { string }
   * @returns {WebpackBuilder}
   */
  setPublicPath(publicPath) {
    this.publicPath = publicPath
    return this
  }

  _multiPages = false
  useMultiPages() {
    this._multiPages = true
    return this
  }

  htmlPlugins() {
    if (this._multiPages) {
      return Object.keys(this.entry).map((pageName) => {
        return new HtmlWebpackPlugin({
          template: this._templateFilePath,
          templateParameters: this._templateParameters,
          filename: `${pageName}.html`,
          chunks: ['styles', 'vendors', pageName],
        })
      })
    }
    return [
      new HtmlWebpackPlugin({
        template: this._templateFilePath,
        templateParameters: this._templateParameters,
      }),
    ]
  }

  /**
   * @param entry { object }
   * @returns {WebpackBuilder}
   */
  setEntry(entry) {
    this.entry = entry
    return this
  }

  _getDevRetainParams() {
    return {
      cache: {
        type: 'filesystem',
      },
      mode: 'development',
      devtool: 'eval-cheap-module-source-map',
      entry: this.entry,
      stats: 'errors-only',
      devServer: {
        compress: true,
        host: '127.0.0.1',
        port: this.port,
        // disableHostCheck: true,
        // stats: this.configBase.stats,
        // progress: true,
        allowedHosts: 'all',
        historyApiFallback: true,
      },
      resolve: {
        alias: this.aliasMap,
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader', postcss],
          },
          {
            test: /\.s[ac]ss$/i,
            use: ['vue-style-loader', 'css-loader', postcss, 'sass-loader'],
          },
          {
            test: /\.less$/,
            exclude: /node_modules/,
            use: ['vue-style-loader', 'css-loader', postcss, 'less-loader'],
          },
          {
            test: /\.less$/,
            include: /node_modules\/antd/,
            use: [
              'style-loader',
              'css-loader',
              postcss,
              {
                loader: 'less-loader',
                options: {
                  modifyVars: {
                    hack: `true; @import "${this.antdCustomVarsFile}";`,
                  },
                  javascriptEnabled: true,
                },
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              name: 'static/img/[name].[ext]',
            },
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[ext]',
            },
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name].[ext]',
            },
          },
        ],
      },
      plugins: [new webpack.HotModuleReplacementPlugin(), ...this.htmlPlugins()],
    }
  }

  _getProductionRetainParams() {
    const publicPath = this.publicPath

    return {
      mode: 'production',
      entry: this.entry,
      output: {
        path: path.resolve(process.cwd(), './dist'),
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[id].[contenthash:8].js',
        publicPath: publicPath,
      },
      stats: 'errors-only',
      optimization: {
        minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin()],
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: false,
          cacheGroups: {
            icons: {
              name: 'icons',
              test: /ant-design[\\/]icons/,
              priority: 0,
            },
            vendors: {
              name: 'vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
            },
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      },
      resolve: {
        alias: this.aliasMap,
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', postcss],
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', postcss, 'sass-loader'],
          },
          {
            test: /\.less$/,
            exclude: /node_modules/,
            use: ['vue-style-loader', 'css-loader', postcss, 'less-loader'],
          },
          {
            test: /\.less$/,
            include: /node_modules\/antd/,
            use: [
              'style-loader',
              'css-loader',
              postcss,
              {
                loader: 'less-loader',
                options: {
                  modifyVars: {
                    hack: `true; @import "${this.antdCustomVarsFile}";`,
                  },
                  javascriptEnabled: true,
                },
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              emitFile: true,
              publicPath: publicPath,
              name: 'static/img/[name].[ext]',
            },
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              emitFile: true,
              publicPath: publicPath,
              name: 'static/media/[name].[ext]',
            },
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              emitFile: true,
              publicPath: publicPath,
              name: 'static/fonts/[name].[ext]',
            },
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin({
          experimentalUseImportModule: true,
          filename: 'static/css/[name].[contenthash].css',
        }),
        ...this.htmlPlugins(),
      ],
    }
  }

  build() {
    const retainParams = this.isDev ? this._getDevRetainParams() : this._getProductionRetainParams()
    return merge(this.configBase, retainParams, this.extras)
  }
}

module.exports = WebpackBuilder
