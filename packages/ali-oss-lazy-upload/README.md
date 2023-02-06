# ali-oss-lazy-upload
## Installation
```
npm install -g ali-oss-lazy-upload
```

## Configuration file
You should create a configuration file. Example: 

```
// YOUR-CONFIG-FILE.js
module.exports = {
  visitor: {
    region: '<OSS region>',
    accessKeyId: '<OSS accessKeyId>',
    accessKeySecret: '<OSS accessKeySecret>',
    bucket: '<OSS bucket name>',
    secure: true,
  },
  uploader: {
    region: '<OSS region>',
    accessKeyId: '<OSS accessKeyId>',
    accessKeySecret: '<OSS accessKeySecret>',
    bucket: '<OSS bucket name>',
    secure: true,
  },
}
```

## Usage
```
ali-oss-lazy-upload CONFIG-JS-FILE LOCAL-FILE REMOTE-PATH [FORCE-UPLOAD]
```
