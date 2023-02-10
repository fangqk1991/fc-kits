const { WebpackBuilder } = require('./src')

module.exports = new WebpackBuilder()
  .setDevMode(false)
  .setPublicPath('/')
  .setEntry('./tests/app.ts')
  .setHtmlTitle('Fangcha Test')
  .setExtras({
    optimization: {
      minimize: false,
    },
  })
  .build()
