import { Descriptor, I18nLanguage } from '@fangcha/tools'

export enum TextSymbol {
  $eq = '$eq',
  $ne = '$ne',
  $ge = '$ge',
  $gt = '$gt',
  $le = '$le',
  $lt = '$lt',
  $includeAll = '$includeAll',
  $includeAny = '$includeAny',
  /**
   * @deprecated
   */
  $excludeAll = '$excludeAll',
  /**
   * @deprecated
   */
  $excludeAny = '$excludeAny',
  $in = '$in',
  /**
   * @deprecated
   */
  $notIn = '$notIn',
  $between = '$between',
  $like = '$like',
  $startsWith = '$startsWith',
  $endsWith = '$endsWith',
  $boolEQ = '$boolEQ',
  $isTrue = '$isTrue',
  $isNull = '$isNull',
  /**
   * @deprecated
   */
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
  TextSymbol.$notIn,
  TextSymbol.$between,
  TextSymbol.$like,
  TextSymbol.$startsWith,
  TextSymbol.$endsWith,
  TextSymbol.$boolEQ,
  TextSymbol.$isTrue,
  TextSymbol.$isNull,
  TextSymbol.$isNotNull,
]

const describe = (code: TextSymbol) => {
  switch (code) {
    case TextSymbol.$eq:
      return '='
    case TextSymbol.$ne:
      return '≠'
    case TextSymbol.$ge:
      return '≥'
    case TextSymbol.$gt:
      return '>'
    case TextSymbol.$le:
      return '≤'
    case TextSymbol.$lt:
      return '<'
    case TextSymbol.$includeAll:
      return 'include all'
    case TextSymbol.$includeAny:
      return 'include any'
    case TextSymbol.$excludeAll:
      return 'exclude all'
    case TextSymbol.$excludeAny:
      return 'exclude any'
    case TextSymbol.$in:
      return 'in'
    case TextSymbol.$notIn:
      return 'not in'
    case TextSymbol.$between:
      return 'between'
    case TextSymbol.$like:
      return 'like'
    case TextSymbol.$startsWith:
      return 'prefix'
    case TextSymbol.$endsWith:
      return 'suffix'
    case TextSymbol.$boolEQ:
      return 'bool eq'
    case TextSymbol.$isTrue:
      return 'is true'
    case TextSymbol.$isNull:
      return 'is null'
    case TextSymbol.$isNotNull:
      return 'is not null'
  }
  return code
}

export const TextSymbolDescriptor = new Descriptor(values, describe)
TextSymbolDescriptor.setI18nData(
  {
    'include all': {
      en: `include all`,
      zh: `包含全部`,
    },
    'include any': {
      en: `include any`,
      zh: `包含任一`,
    },
    'exclude all': {
      en: `exclude all`,
      zh: `不包含全部`,
    },
    'exclude any': {
      en: `include any`,
      zh: `不包含任一`,
    },
    in: {
      en: `in`,
      zh: `属于`,
    },
    'not in': {
      en: `not in`,
      zh: `不属于`,
    },
    like: {
      en: `like`,
      zh: `部分匹配`,
    },
    prefix: {
      en: `prefix`,
      zh: `前缀匹配`,
    },
    suffix: {
      en: `suffix`,
      zh: `后缀匹配`,
    },
    between: {
      en: `between`,
      zh: `位于区间`,
    },
    'is true': {
      en: `is true`,
      zh: `为真`,
    },
    'is null': {
      en: `is null`,
      zh: `为空`,
    },
    'is not null': {
      en: `is not null`,
      zh: `不为空`,
    },
  },
  I18nLanguage.zh
)
