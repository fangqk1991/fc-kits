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
  OssDemo: {
    demoDB: {
      host: '127.0.0.1',
      port: 3306,
      database: 'demo_db',
      username: 'root',
      password: '',
      dialect: 'mysql',
      timezone: '+08:00',
      logging: false,
    },
    downloadDir: `${__dirname}/../zones/demo-zone/downloads`,
    ossOptions: {
      Default: {
        visitor: {
          region: 'oss-cn-shanghai',
          accessKeyId: '__accessKeyId__',
          accessKeySecret: '<OSS accessKeySecret>',
          bucket: '__bucket__',
          secure: true,
        },
        uploader: {
          region: 'oss-cn-shanghai',
          accessKeyId: '__accessKeyId__',
          accessKeySecret: '<OSS accessKeySecret>',
          bucket: '__bucket__',
          secure: true,
        },
        uploadSignature: {
          accessKeyId: '__accessKeyId__',
          accessKeySecret: '<OSS accessKeySecret>',
          bucketURL: '<bucketURL>',
          timeout: 3000,
        },
        remoteRootDir: 'datawich-staging',
        downloadRootDir: '/data/datawich-zone/downloads',
      },
    },
  },
}
