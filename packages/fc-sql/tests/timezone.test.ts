import { FCDatabase } from '../src'
import * as assert from 'assert'

describe('Test Timezone', (): void => {
  it(`Test Timezone`, async () => {
    const timezones = ['+00:00', '+08:00']
    for (const timezone of timezones) {
      console.info(`Timezone: ${timezone}`)
      const database = new FCDatabase()
      database.init({
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        database: 'demo_db',
        username: 'root',
        password: '',
        timezone: timezone,
        dialectOptions: {
          dateStrings: true,
        },
      })
      assert.ok((await database.timezone()) === timezone)
    }
  })
})
