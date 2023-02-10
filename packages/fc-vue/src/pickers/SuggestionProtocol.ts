export interface SuggestionProtocol<T = any> {
  placeholder?: string
  valueKey: keyof T
  describeLabel: (item: T) => string
  loadData: (keywords: string) => Promise<T[]>
}
