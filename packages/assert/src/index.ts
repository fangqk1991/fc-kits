import AppError from '@fangcha/app-error'

export const ok = function (bool: boolean, errMessage: string = '', errorCode: number = 400, extras: any = null) {
  if (!bool) {
    throw new AppError(errMessage, errorCode, extras)
  }
  return true
}

export default {
  ok,
}
