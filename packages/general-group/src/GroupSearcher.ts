import assert from '@fangcha/assert'
import { FilterOptions } from 'fc-feed'
import { GroupSpace } from './common/models'
import { GeneralGroupApp } from './GeneralGroupApp'

export class GroupSearcher {
  public readonly groupApp: GeneralGroupApp
  spaces: GroupSpace[]

  constructor(groupApp: GeneralGroupApp, space: GroupSpace | GroupSpace[]) {
    this.groupApp = groupApp
    if (Array.isArray(space)) {
      assert.ok(space.length > 0, '必须指定空间')
      this.spaces = space
    } else {
      this.spaces = [space]
    }
  }

  public makeSearcher(filterOptions: FilterOptions = {}) {
    const spaces = this.spaces
    const searcher = new this.groupApp.CommonGroup().fc_searcher(filterOptions)
    if (spaces.length === 1) {
      searcher.processor().addConditionKV('space', spaces[0])
    } else {
      searcher.processor().addConditionKeyInArray(`space`, spaces)
    }
    return searcher
  }
}
