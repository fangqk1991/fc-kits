import { Descriptor } from '@fangcha/tools'

export enum CommonJobState {
  Pending = 'Pending',
  Running = 'Running',
  Done = 'Done',
  Fail = 'Fail',
}

const values = [CommonJobState.Pending, CommonJobState.Running, CommonJobState.Done, CommonJobState.Fail]

const describe = (code: CommonJobState) => {
  return code
}

export const CommonJobStateDescriptor = new Descriptor(values, describe)
