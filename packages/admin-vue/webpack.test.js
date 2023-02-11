const { WebpackBuilder } = require('@fangcha/webpack')

module.exports = new WebpackBuilder()
  .setDevMode(false)
  .setPublicPath('/')
  .setEntry('./tests/app-admin.ts')
  .setHtmlTitle('Fangcha Test')
  .setExtras({
    optimization: {
      minimize: false,
    },
  })
  .build()
