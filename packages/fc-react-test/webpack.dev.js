const { WebpackBuilder } = require('@fangcha/webpack')

module.exports = new WebpackBuilder()
  .useReact()
  .setDevMode(true)
  .setPort(2399)
  .setEntry('./src/index.tsx')
  .setExtras({
    devServer: {
      proxy: {
        '/api': `http://localhost:2400`,
      },
    },
  })
  .build()
