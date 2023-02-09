const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const generateConfigBase = (nodeExternalsAllowList) => {
  return {
    mode: 'production',

    target: 'node',

    node: {
      __dirname: false,
      __filename: false,
    },

    optimization: {
      minimize: false,
      nodeEnv: false, // 不要替换掉 process.env
    },

    stats: 'errors-only',

    entry: {
      app: './src/app.ts',
    },

    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },

    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },

    module: {
      rules: [
        {
          test: /\.(t|j)s$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'global.GENTLY': false,
        'process.env.COMMIT_SHA': 'Unknown',
      }),
    ],

    externals: [
      nodeExternals({
        modulesDir: path.resolve(process.cwd(), '../../node_modules'),
        allowlist: nodeExternalsAllowList || [/^@web/],
      }),
      nodeExternals({
        modulesDir: path.resolve(process.cwd(), './node_modules'),
        allowlist: nodeExternalsAllowList || [/^@web/],
      }),
    ],
  }
}

class BackpackBuilder {
  constructor() {
    this.entry = undefined
    this.nodeExternalsAllowList = [/^@web/]
  }

  build() {
    const options = generateConfigBase(this.nodeExternalsAllowList)
    if (this.entry) {
      options.entry = this.entry
    }
    options.plugins = []
    return options
  }
}

module.exports = BackpackBuilder
