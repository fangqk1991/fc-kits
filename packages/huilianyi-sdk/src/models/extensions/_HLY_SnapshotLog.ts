import __HLY_SnapshotLog from '../auto-build/__HLY_SnapshotLog'
import { AllowanceSnapshotLogModel } from '../../core'

export class _HLY_SnapshotLog extends __HLY_SnapshotLog {
  public constructor() {
    super()
  }

  public static async findWithMonth(month: string) {
    return (await this.findWithUid(month))!
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    return this.fc_pureModel() as AllowanceSnapshotLogModel
  }
}
