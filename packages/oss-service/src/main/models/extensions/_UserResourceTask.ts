import __UserResourceTask from '../auto-build/__UserResourceTask'

export class _UserResourceTask extends __UserResourceTask {
  public constructor() {
    super()
  }

  public static async checkBelongs(userEmail: string, taskKey: string) {
    const searcher = new _UserResourceTask().fc_searcher()
    searcher.processor().addConditionKV('task_key', taskKey)
    searcher.processor().addConditionKV('user_email', userEmail)
    return (await searcher.queryCount()) > 0
  }
}
