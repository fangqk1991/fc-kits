const { WebpackBuilder } = require('@fangcha/webpack')

module.exports = new WebpackBuilder()
  .setDevMode(false)
  .setPublicPath('/')
  .setEntry('./tests/index.tsx')
  .setHtmlTitle('Fangcha Test')
  .setExtras({
    optimization: {
      minimize: false,
    },
  })
  .build()
