module.exports = {
  Env: 'It will be rewritten by process.env.NODE_CONFIG_ENV or process.env.NODE_ENV',
  Tags: [],
  HuilianyiSDK: {
    urlBase: 'https://apistage.huilianyi.com',
    username: '<username>',
    password: '<password>',
  },
  HuilianyiDB: {
    host: '127.0.0.1',
    port: 3306,
    database: 'demo_db',
    username: 'root',
    password: '',
    dialect: 'mysql',
    timezone: '+08:00',
    logging: false,
  },
  CTripSDK: {
    urlBase: 'https://ct.ctrip.com',
    appKey: '<username>',
    appSecurity: '<password>',
  },
}
