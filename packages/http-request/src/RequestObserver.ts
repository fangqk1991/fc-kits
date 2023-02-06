import { AxiosBuilder } from './AxiosBuilder'
import AppError from '@fangcha/app-error'

export interface RequestObserver {
  onRequestStart: (client: AxiosBuilder) => void | Promise<void>
  onRequestSuccess: (client: AxiosBuilder, responseData?: any) => void | Promise<void>
  onRequestFailure: (client: AxiosBuilder, error: AppError, responseData?: any) => void | Promise<void>
}
