# node-resque
### 一些设计
* 这是一个轻量级的任务处理模块，基本设定与 [resque/resque](https://github.com/resque/resque) 一致，可通过 [resque-web](https://github.com/resque/resque#standalone) 进行任务管理
* 采用 redis blpop 的方式等待任务而非轮询
* 目前单个程序只支持串行处理任务，可通过多个程序达到并发效果；后续将直接支持任务并发

### 运行要求
* node
* redis

## 安装
```
npm install @fangcha/resque
```

## 使用
#### 配置示例
```
const config = {
  logFile: `${__dirname}/run.local/resque.log`,
  pidFile: `${__dirname}/run.local/resque.pid`,
  redisBackend: '127.0.0.1:6379',
  moduleMapFile: `${__dirname}/task-map.js`,
  queues: [
    'TaskQueueDemo',
  ]
}

module.exports = config
```

#### 定义启动脚本
脚本示例，参考 `launcher-demo`，可保存为 `./node-resque`

```
#!/usr/bin/env node

const { FCLauncher } = require('@fangcha/resque')

const launchFile = process.argv[1]
const cmd = process.argv[2] ? process.argv[2] : ''

const launcher = new FCLauncher(launchFile, config)
launcher.handle(cmd)
```

```
./node-resque start
```

启动后，将根据 config 配置生成 pid 文件及日志文件

> 命令支持: start / stop / restart / status

#### 定义任务
* 任务必须为一个继承于 `IResqueTask` 的类，并实现 `async perform(params)` 方法，参考 `TaskDemo`
* 需要在 config.moduleMapFile 中添加对自定义任务的引用
* config.queues 中定义任务队列监听的 queue 名称

```
// TaskDemo.js
const { IResqueTask } = require('@fangcha/resque')

class TaskDemo extends IResqueTask {
  async perform(params) {
    // do something
  }
}

module.exports = TaskDemo
```

#### moduleMapFile
参考本工程的 `task-map.js`，`TaskDemo` 即代表了任务类

```
module.exports = {
  TaskDemo: require('./TaskDemo')
}
```

#### 异步任务入队
```
const { Resque } = require('@fangcha/resque')

Resque.setBackend(config.redisBackend)

...

await Resque.enqueue('TaskQueueDemo', 'TaskDemo', params)
```

您可以参考 `tests/resque` 中的代码
