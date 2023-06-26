export type CTripResponseDTO<T = any> = {
  Status: {
    Success: boolean
    ErrorCode: number
    Message: string
  }
} & T

export interface CTripSimpleOrder {
  OrderId: number
  OrderType: number
}

export interface CTripDatetimeRange {
  from: string
  to: string
}
