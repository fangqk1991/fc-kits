const { WebpackBuilder } = require('@fangcha/webpack')

module.exports = new WebpackBuilder()
  .setPort(8090)
  .setDevMode(true)
  .setEntry('./tests/app.ts')
  .build()
