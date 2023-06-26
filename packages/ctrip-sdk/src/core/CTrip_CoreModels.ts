export interface CTripResponseDTO {
  Status: {
    Success: boolean
    ErrorCode: number
    Message: string
  }
  Ticket: string
}
