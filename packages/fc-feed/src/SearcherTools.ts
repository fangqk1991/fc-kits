import { SearchBuilder, SQLSearcher } from 'fc-sql'
import { FilterOptions } from './FeedBase'

const _buildLimitInfo = (params: any) => {
  let { _offset = -1, _length = -1 } = params
  _offset = Number(_offset)
  _length = Number(_length)
  return {
    offset: _offset,
    length: _length,
  }
}

const _buildSortRule = (params: any) => {
  let sortDirection = params._sortDirection || 'ASC'
  if (!['ASC', 'DESC'].includes(sortDirection)) {
    if (sortDirection === 'ascending') {
      sortDirection = 'ASC'
    } else if (sortDirection === 'descending') {
      sortDirection = 'DESC'
    } else {
      sortDirection = 'ASC'
    }
  }

  return {
    sortKey: params._sortKey || '',
    sortDirection: sortDirection,
  }
}

export class SearcherTools {
  public static injectConditions(
    searcher: SQLSearcher,
    options: {
      colsMapper: { [p: string]: string } | string[]
      params: FilterOptions
      gbkCols?: string[]
      withoutFilterCols?: string[]
      exactSearchCols?: string[]
      fuzzySearchCols?: string[]
      timestampTypeCols?: string[]
    }
  ) {
    const colsMapper = Array.isArray(options.colsMapper)
      ? options.colsMapper.reduce((result, cur) => {
          result[cur] = cur
          return result
        }, {})
      : options.colsMapper
    const filterColsMapper = { ...colsMapper }
    const withoutFilterCols = options.withoutFilterCols || []
    withoutFilterCols.forEach((col) => {
      delete filterColsMapper[col]
    })
    const params = options.params
    const timestampMap = (options.timestampTypeCols || []).reduce((result, cur) => {
      result[cur] = true
      return result
    }, {} as { [p: string]: boolean })
    const paramsKeys = Object.keys(params)
    paramsKeys
      .filter((key: string) => {
        return /^[a-zA-Z_][\w.]+$/.test(key) && key in filterColsMapper && !!params[key]
      })
      .forEach((key) => {
        searcher.addConditionKV(filterColsMapper[key], params[key])
      })
    for (const key of paramsKeys) {
      const matches = key.match(/^([a-zA-Z_][\w.]+)\.(\$\w+)(\.\w+)?$/)
      if (!matches || !(matches[1] in filterColsMapper)) {
        continue
      }
      const columnKey = filterColsMapper[matches[1]]
      const wrappedColumnKey = /^\w+$/.test(columnKey) ? `\`${columnKey}\`` : columnKey
      const symbol = matches[2]
      if (symbol === '$like') {
        searcher.addConditionLikeKeywords(columnKey, params[key])
      } else if (['$in', '$notIn'].includes(symbol) && Array.isArray(params[key])) {
        if (symbol === '$in') {
          searcher.addConditionKeyInArray(columnKey, params[key])
        } else if (symbol === '$notIn') {
          searcher.addConditionKeyNotInArray(columnKey, params[key])
        }
      } else if (['$inStr', '$notInStr'].includes(symbol) && typeof params[key] === 'string') {
        const values = (params[key] as string)
          .split(',')
          .map((item) => item.trim())
          .filter((item) => !!item)
        if (symbol === '$inStr') {
          searcher.addConditionKeyInArray(columnKey, values)
        } else if (symbol === '$notInStr') {
          searcher.addConditionKeyNotInArray(columnKey, values)
        }
      } else if (
        ['$include_any', '$include_all', '$exclude_any', '$exclude_all'].includes(symbol) &&
        typeof params[key] === 'string'
      ) {
        const values = (params[key] as string)
          .split(',')
          .map((item) => item.trim())
          .filter((item) => !!item)
        if (symbol === '$include_any') {
          const builder = new SearchBuilder()
          builder.setLogic('OR')
          builder.addCondition(`1 = 0`)
          for (const val of values) {
            builder.addCondition(`FIND_IN_SET(?, ${wrappedColumnKey})`, val)
          }
          builder.injectToSearcher(searcher)
        } else if (symbol === '$include_all') {
          for (const val of values) {
            searcher.addSpecialCondition(`FIND_IN_SET(?, ${wrappedColumnKey})`, val)
          }
        } else if (symbol === '$exclude_any') {
          const builder = new SearchBuilder()
          builder.setLogic('OR')
          builder.addCondition(`1 = 0`)
          for (const val of values) {
            builder.addCondition(`NOT FIND_IN_SET(?, ${wrappedColumnKey})`, val)
          }
          builder.injectToSearcher(searcher)
        } else if (symbol === '$exclude_all') {
          for (const val of values) {
            searcher.addSpecialCondition(`NOT FIND_IN_SET(?, ${wrappedColumnKey})`, val)
          }
        }
      } else if (['$eq', '$ne'].includes(symbol) && typeof params[key] === 'string') {
        const value = params[key]
        if (symbol === '$eq') {
          searcher.addSpecialCondition(`${wrappedColumnKey} = ?`, value)
        } else if (symbol === '$ne') {
          searcher.addSpecialCondition(`${wrappedColumnKey} != ?`, value)
        }
      } else if (
        ['$lt', '$le', '$gt', '$ge', '$eq', '$ne'].includes(symbol) &&
        ((typeof params[key] === 'string' && /^(-?\d+)$|^(-?\d+\.\d+)$/.test(params[key])) ||
          typeof params[key] === 'number')
      ) {
        const isTimestamp = !!timestampMap[columnKey]
        const placeholder = isTimestamp ? 'FROM_UNIXTIME(?)' : '?'
        const value = Number(params[key])
        if (symbol === '$lt') {
          searcher.addSpecialCondition(`${wrappedColumnKey} < ${placeholder}`, value)
        } else if (symbol === '$le') {
          searcher.addSpecialCondition(`${wrappedColumnKey} <= ${placeholder}`, value)
        } else if (symbol === '$gt') {
          searcher.addSpecialCondition(`${wrappedColumnKey} > ${placeholder}`, value)
        } else if (symbol === '$ge') {
          searcher.addSpecialCondition(`${wrappedColumnKey} >= ${placeholder}`, value)
        } else if (symbol === '$eq') {
          searcher.addSpecialCondition(`${wrappedColumnKey} = ${placeholder}`, value)
        } else if (symbol === '$ne') {
          searcher.addSpecialCondition(`${wrappedColumnKey} != ${placeholder}`, value)
        }
      }
    }
    if (params['$keywords'] && `${params['$keywords']}`.trim()) {
      const keywords = `${params['$keywords']}`.trim()
      const exactSearchCols = options.exactSearchCols || []
      const fuzzySearchCols = options.fuzzySearchCols || []
      const conditionList: string[] = []
      const stmtValues: any[] = []
      for (let col of exactSearchCols) {
        if (/^\w+$/.test(col)) {
          col = `\`${col}\``
        }
        conditionList.push(`${col} = ? COLLATE utf8mb4_general_ci`)
        stmtValues.push(keywords)
      }
      for (let col of fuzzySearchCols) {
        if (/^\w+$/.test(col)) {
          col = `\`${col}\``
        }
        conditionList.push(`${col} LIKE ? COLLATE utf8mb4_general_ci`)
        stmtValues.push(`%${keywords}%`)
      }
      if (conditionList.length > 0) {
        searcher.addSpecialCondition(conditionList.join(' OR '), ...stmtValues)
      }
    }
    const { sortKey, sortDirection } = _buildSortRule(params)
    if (sortKey && colsMapper[sortKey]) {
      const gbkCols = options.gbkCols || []
      searcher.addOrderRule(
        gbkCols.includes(colsMapper[sortKey]) ? `CONVERT(\`${colsMapper[sortKey]}\` USING gbk)` : colsMapper[sortKey],
        sortDirection
      )
    }
    const limitInfo = _buildLimitInfo(params)
    if (limitInfo.offset >= 0 && limitInfo.length > 0) {
      searcher.setLimitInfo(limitInfo.offset, limitInfo.length)
    }
    return searcher
  }
}
