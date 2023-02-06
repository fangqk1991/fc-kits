class _TaskCenter {
  public moduleMap: { [p: string]: any } = {}

  public initForModuleMapFile(moduleMapFile: string) {
    this.moduleMap = require(moduleMapFile)
  }

  public initForModuleMapData(moduleMap: { [p: string]: any }) {
    this.moduleMap = moduleMap
  }

  public findTask(className: string) {
    if (this.moduleMap[className]) {
      return this.moduleMap[className]
    }
    return null
  }
}

export const TaskCenter = new _TaskCenter()
