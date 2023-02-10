const { BackpackBuilder } = require('./src')

const builder = new BackpackBuilder()
builder.entry = {
  backend: './tests/backend-app.ts'
}

module.exports = builder.build()
