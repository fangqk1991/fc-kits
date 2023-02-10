const { WebpackBuilder } = require('./src')

module.exports = new WebpackBuilder()
  .setDevMode(true)
  .setEntry('./tests/app.ts')
  .setHtmlTitle('Fangcha Test')
  .build()
