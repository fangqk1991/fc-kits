import { FCDatabase } from 'fc-sql'
import { _CommonJob } from './models/extensions/_CommonJob'

class _GeneralJobService {
  public getClass_CommonJob(database: FCDatabase): typeof _CommonJob {
    class CommonJob extends _CommonJob {}
    CommonJob.setDatabase(database)
    return CommonJob
  }
}

export const GeneralJobService = new _GeneralJobService()
