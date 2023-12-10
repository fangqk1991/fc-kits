import { Descriptor } from '@fangcha/tools'

export enum TextSymbol {
  $eq = '$eq',
  $ne = '$ne',
  $ge = '$ge',
  $gt = '$gt',
  $le = '$le',
  $lt = '$lt',
  $includeAll = '$includeAll',
  $includeAny = '$includeAny',
  $excludeAll = '$excludeAll',
  $excludeAny = '$excludeAny',
  $in = '$in',
  $inStr = '$inStr',
  $notIn = '$notIn',
  $notInStr = '$notInStr',
  $between = '$between',
  $betweenStr = '$betweenStr',
  $like = '$like',
  $boolEQ = '$boolEQ',
  $isNull = '$isNull',
  $isNotNull = '$isNotNull',
}

const values = [
  TextSymbol.$eq,
  TextSymbol.$ne,
  TextSymbol.$ge,
  TextSymbol.$gt,
  TextSymbol.$le,
  TextSymbol.$lt,
  TextSymbol.$includeAll,
  TextSymbol.$includeAny,
  TextSymbol.$excludeAll,
  TextSymbol.$excludeAny,
  TextSymbol.$in,
  TextSymbol.$inStr,
  TextSymbol.$notIn,
  TextSymbol.$notInStr,
  TextSymbol.$between,
  TextSymbol.$betweenStr,
  TextSymbol.$like,
  TextSymbol.$boolEQ,
  TextSymbol.$isNull,
  TextSymbol.$isNotNull,
]

const describe = (code: TextSymbol) => {
  switch (code) {
    case TextSymbol.$eq:
      return '='
    case TextSymbol.$ne:
      return '!='
    case TextSymbol.$ge:
      return '>='
    case TextSymbol.$gt:
      return '>'
    case TextSymbol.$le:
      return '<='
    case TextSymbol.$lt:
      return '<'
    case TextSymbol.$includeAll:
      return 'includeAll'
    case TextSymbol.$includeAny:
      return 'includeAny'
    case TextSymbol.$excludeAll:
      return 'excludeAll'
    case TextSymbol.$excludeAny:
      return 'excludeAny'
    case TextSymbol.$in:
      return 'in'
    case TextSymbol.$inStr:
      return 'inStr'
    case TextSymbol.$notIn:
      return 'notIn'
    case TextSymbol.$notInStr:
      return 'notInStr'
    case TextSymbol.$between:
      return 'between'
    case TextSymbol.$betweenStr:
      return 'betweenStr'
    case TextSymbol.$like:
      return 'like'
    case TextSymbol.$boolEQ:
      return 'bool eq'
    case TextSymbol.$isNull:
      return 'is null'
    case TextSymbol.$isNotNull:
      return 'is not null'
  }
  return code
}

export const TextSymbolDescriptor = new Descriptor(values, describe)
