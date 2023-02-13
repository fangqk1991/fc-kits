const webpack = require('webpack')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackOptionsFactory } = require('./WebpackOptionsFactory')

class WebpackBuilder {
  constructor() {
    this.forVue = true
    this.isDev = true
    this.port = 8080
    this.entry = {
      app: './src/app',
    }
    this.extras = {}
    this.aliasMap = {}
  }

  useReact() {
    this.forVue = false
    return this
  }

  useVue() {
    this.forVue = true
    return this
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
        rules: [...WebpackOptionsFactory.cssDevRules(this.forVue), ...WebpackOptionsFactory.fileDevRules()],
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
      optimization: WebpackOptionsFactory.optimizationOptions(),
      resolve: {
        alias: this.aliasMap,
      },
      module: {
        rules: [...WebpackOptionsFactory.cssProdRules(), ...WebpackOptionsFactory.fileProdRules(publicPath)],
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
    return merge(
      this.forVue ? WebpackOptionsFactory.vueOptionsBase() : WebpackOptionsFactory.reactOptionsBase(),
      retainParams,
      this.extras
    )
  }
}

module.exports = WebpackBuilder
