import { IResqueTask } from '../src'
import * as fs from 'fs'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class TaskDemo implements IResqueTask {
  public async perform(params: any) {
    const file = params['file']
    const content = params['content']

    console.log(`TaskDemo: sleep 200ms`)
    await sleep(200)
    fs.writeFileSync(file, content)
  }
}
