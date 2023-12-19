import { SearchBuilder, SQLSearcher } from 'fc-sql'
import { FilterOptions } from './FeedBase'
import { TextSymbol } from '@fangcha/logic'

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
    const checkValNumber = (val: string | number | any[]) => {
      if (Array.isArray(val)) {
        for (const subVal of val) {
          if (!checkValNumber(subVal)) {
            return false
          }
        }
        return val.length > 0
      }
      return (typeof val === 'string' && /^(-?\d+)$|^(-?\d+\.\d+)$/.test(val)) || typeof val === 'number'
    }
    const makeArrayValues = (value: any) => {
      return Array.isArray(value)
        ? value
        : (value as string)
            .split(',')
            .map((item) => item.trim())
            .filter((item) => !!item)
    }
    for (const key of paramsKeys) {
      const matches = key.match(/^([a-zA-Z_][\w.]+)\.(\$not\.)?(\$\w+)(\.\w+)?$/)
      if (!matches || !(matches[1] in filterColsMapper)) {
        continue
      }
      const columnKey = filterColsMapper[matches[1]]
      const wrappedColumnKey = /^\w+$/.test(columnKey) ? `\`${columnKey}\`` : columnKey
      const isTrue = matches[2] !== '$not.'
      const symbol = matches[3] as TextSymbol
      const extensions = matches[4]
      if (extensions === '.disabled') {
        continue
      }
      switch (symbol) {
        case TextSymbol.$eq:
        case TextSymbol.$ne:
        case TextSymbol.$ge:
        case TextSymbol.$gt:
        case TextSymbol.$le:
        case TextSymbol.$lt:
          {
            const placeholder = checkValNumber(params[key]) && !!timestampMap[columnKey] ? 'FROM_UNIXTIME(?)' : '?'
            const value = params[key]
            if (symbol === TextSymbol.$lt) {
              searcher.addCondition(`${wrappedColumnKey} < ${placeholder}`, [value], isTrue)
            } else if (symbol === TextSymbol.$le) {
              searcher.addCondition(`${wrappedColumnKey} <= ${placeholder}`, [value], isTrue)
            } else if (symbol === TextSymbol.$gt) {
              searcher.addCondition(`${wrappedColumnKey} > ${placeholder}`, [value], isTrue)
            } else if (symbol === TextSymbol.$ge) {
              searcher.addCondition(`${wrappedColumnKey} >= ${placeholder}`, [value], isTrue)
            } else if (symbol === TextSymbol.$eq) {
              searcher.addCondition(`${wrappedColumnKey} = ${placeholder}`, [value], isTrue)
            } else if (symbol === TextSymbol.$ne) {
              searcher.addCondition(`${wrappedColumnKey} != ${placeholder}`, [value], isTrue)
            }
          }
          break
        case TextSymbol.$includeAll:
        case TextSymbol.$includeAny:
        case TextSymbol.$excludeAll:
        case TextSymbol.$excludeAny:
          {
            const values = makeArrayValues(params[key])
            if (symbol === TextSymbol.$includeAny || symbol === TextSymbol.$excludeAny) {
              const builder = new SearchBuilder()
              builder.setLogic('OR')
              builder.addCondition(`1 = 0`)
              for (const val of values) {
                builder.addCondition(`FIND_IN_SET(?, ${wrappedColumnKey})`, val)
              }
              builder.injectToSearcher(searcher, symbol === TextSymbol.$includeAny ? isTrue : !isTrue)
            } else if (symbol === TextSymbol.$includeAll || symbol === TextSymbol.$excludeAll) {
              const builder = new SearchBuilder()
              builder.setLogic('AND')
              for (const val of values) {
                builder.addCondition(`FIND_IN_SET(?, ${wrappedColumnKey})`, val)
              }
              builder.injectToSearcher(searcher, symbol === TextSymbol.$includeAll ? isTrue : !isTrue)
            }
          }
          break
        case TextSymbol.$in:
          searcher.addConditionKeyInArray(columnKey, makeArrayValues(params[key]), isTrue)
          break
        case TextSymbol.$notIn:
          isTrue
            ? searcher.addConditionKeyNotInArray(columnKey, makeArrayValues(params[key]))
            : searcher.addConditionKeyInArray(columnKey, makeArrayValues(params[key]))
          break
        case TextSymbol.$between:
          {
            const values = makeArrayValues(params[key])
            if (Array.isArray(values) && values.length === 2) {
              const placeholder = checkValNumber(values) && !!timestampMap[columnKey] ? 'FROM_UNIXTIME(?)' : '?'
              searcher.addCondition(
                `${wrappedColumnKey} BETWEEN ${placeholder} AND ${placeholder}`,
                [values[0], values[1]],
                isTrue
              )
            }
          }
          break
        case TextSymbol.$like:
          searcher.addConditionLikeKeywords(columnKey, params[key], isTrue)
          break
        case TextSymbol.$startsWith:
          searcher.addConditionStartsWithKeywords(columnKey, params[key], isTrue)
          break
        case TextSymbol.$endsWith:
          searcher.addConditionEndsWithKeywords(columnKey, params[key], isTrue)
          break
        case TextSymbol.$boolEQ:
          {
            const value = params[key]
            if (value === 'true') {
              searcher.addCondition(`${wrappedColumnKey} IS NOT NULL AND ${wrappedColumnKey} != ''`, [], isTrue)
            } else if (value === 'false') {
              searcher.addCondition(`${wrappedColumnKey} IS NULL OR ${wrappedColumnKey} = ''`, [], isTrue)
            }
          }
          break
        case TextSymbol.$isTrue:
          searcher.addCondition(`${wrappedColumnKey} IS NOT NULL AND ${wrappedColumnKey} != ''`, [], isTrue)
          break
        case TextSymbol.$isNull:
          searcher.addCondition(`${wrappedColumnKey} IS NULL`, [], isTrue)
          break
        case TextSymbol.$isNotNull:
          searcher.addCondition(`${wrappedColumnKey} IS NOT NULL`, [], isTrue)
          break
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
