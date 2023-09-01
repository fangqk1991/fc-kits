import __HLY_SnapshotLog from '../auto-build/__HLY_SnapshotLog'

export class _HLY_SnapshotLog extends __HLY_SnapshotLog {
  public constructor() {
    super()
  }

  public static async findWithMonth(month: string) {
    return (await this.findWithUid(month))!
  }
}
