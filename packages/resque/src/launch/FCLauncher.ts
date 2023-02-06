import { FCMaster } from './FCMaster'
import * as shell from 'shelljs'
import * as fs from 'fs'

const println = (msg: any) => {
  console.log(msg)
}

export class FCLauncher {
  public logFile: string
  public pidFile: string
  private _curPID: number = 0

  private readonly _launchFile: string
  private _master: FCMaster

  public constructor(
    launchFile: string,
    options: { redisBackend: string; logFile: string; pidFile: string; queues: string[]; moduleMapFile: string }
  ) {
    if (!options['logFile']) {
      throw new Error(`logFile error`)
    }
    if (!options['pidFile']) {
      throw new Error(`pidFile error`)
    }
    this.logFile = options['logFile']
    this.pidFile = options['pidFile']
    this._launchFile = launchFile
    this._master = new FCMaster(options)
    this._loadPIDInfo()
  }

  public curPID() {
    return this._curPID
  }

  private _loadPIDInfo() {
    this._curPID = 0

    if (fs.existsSync(this.pidFile)) {
      this._curPID = Number(fs.readFileSync(this.pidFile, 'utf8'))
    }
  }

  async _savePIDInfo() {
    fs.writeFileSync(this.pidFile, `${this._curPID}`)
  }

  killProgress() {
    try {
      process.kill(this._curPID, 'SIGKILL')
    } catch (e: any) {
      console.error(e.message)
    }

    fs.unlinkSync(this.pidFile)
    this._loadPIDInfo()
  }

  async _checkLaunchAble() {
    const pid = this.curPID()
    if (pid > 0) {
      try {
        process.kill(pid, 'SIGUSR1')
        console.log(`The application is running. PID: ${pid}`)
        process.exit()
      } catch (e: any) {
        // return e.code === 'EPERM'
      }
    }
  }

  public start() {
    const pid = this.curPID()
    if (pid > 0) {
      println(`node-resque(${pid}) is running.`)
      println(`You should stop it before you start.`)
      return
    }

    println(`Starting node-resque...`)
    shell.exec(`nohup node "${this._launchFile}" --launch >> "${this.logFile}" 2>&1 &`)
  }

  public stop() {
    if (this.curPID() === 0) {
      println(`node-resque is not running.`)
      return
    }

    println(`Stopping node-resque...`)
    this.killProgress()
  }

  public checkStatus() {
    const pid = this.curPID()
    if (pid > 0) {
      println(`node-resque(${pid}) is running.`)
    } else {
      println(`node-resque is not running.`)
    }
  }

  public async launchMaster() {
    await this._checkLaunchAble()
    this._curPID = process.pid
    await this._savePIDInfo()
    await this._master.run()
  }

  public handle(cmd: string) {
    switch (cmd) {
      case 'start':
        this.start()
        break
      case 'stop':
        this.stop()
        break
      case 'restart':
        this.stop()
        this.start()
        break
      case 'status':
        this.checkStatus()
        break
      case '--launch':
        this.launchMaster()
        break
      default:
        println('Usage: {start|stop|restart|status}')
        break
    }
  }
}
