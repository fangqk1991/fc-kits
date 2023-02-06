export interface IResqueTask {
  perform(params: Record<string, unknown>): Promise<void>
}
