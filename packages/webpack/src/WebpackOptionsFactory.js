const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: [require('postcss-import'), require('postcss-url'), require('autoprefixer')],
  },
}

class WebpackOptionsFactory {
  static vueOptionsBase() {
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
        new NodePolyfillPlugin(),
      ],
    }
  }

  static reactOptionsBase() {
    return {
      stats: 'normal',
      output: {
        filename: '[name].js',
        publicPath: '/',
        pathinfo: false,
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          vue$: 'vue/dist/vue.esm.js',
        },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
              happyPackMode: true,
            },
          },
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            include: /node_modules\/@fangcha\/(.*-)?react(-.*)?/,
            options: {
              happyPackMode: true,
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
            diagnosticOptions: {
              semantic: true,
              syntactic: true,
            },
          },
        }),
        new NodePolyfillPlugin(),
      ],
    }
  }

  static cssDevRules(forVue) {
    const cssLoaders = [forVue ? 'vue-style-loader' : 'style-loader', 'css-loader', postcss]
    return [
      {
        test: /\.css$/,
        use: cssLoaders,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [...cssLoaders, 'sass-loader'],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [...cssLoaders, 'less-loader'],
      },
      {
        test: /\.less$/,
        include: /node_modules\/antd/,
        use: [
          ...cssLoaders,
          // {
          //   loader: 'less-loader',
          //   options: {
          //     modifyVars: {
          //       hack: `true; @import "${this.antdCustomVarsFile}";`,
          //     },
          //     javascriptEnabled: true,
          //   },
          // },
        ],
      },
    ]
  }

  static fileDevRules() {
    return [
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
    ]
  }

  static cssProdRules() {
    return [
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', postcss, 'less-loader'],
      },
      {
        test: /\.less$/,
        include: /node_modules\/antd/,
        use: [
          'style-loader',
          'css-loader',
          postcss,
          // {
          //   loader: 'less-loader',
          //   options: {
          //     modifyVars: {
          //       hack: `true; @import "${this.antdCustomVarsFile}";`,
          //     },
          //     javascriptEnabled: true,
          //   },
          // },
        ],
      },
    ]
  }

  static fileProdRules(publicPath) {
    return [
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
    ]
  }

  static optimizationOptions() {
    return {
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
    }
  }
}

module.exports = {
  WebpackOptionsFactory: WebpackOptionsFactory,
}
