const { WebpackBuilder } = require('@fangcha/webpack')

module.exports = new WebpackBuilder()
  .useReact()
  .setDevMode(false)
  .setPublicPath('/')
  .setEntry('./tests/index.tsx')
  // .setExtras({
  //   optimization: {
  //     minimize: false,
  //   },
  // })
  .build()
