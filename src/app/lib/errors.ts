import util from 'util'

interface ValidationError{
  name: string
  message: string
  payload?: Array<Object>
}
let e$ValidationError = function ValidationError(this: ValidationError, message: string, payload?: Array<Object>) {
  Error.captureStackTrace(this, ValidationError)
  this.name = ValidationError.name
  this.message = message
  this.payload = payload
} as any as { new(message: string, payload: Array<Object>): ValidationError}
util.inherits(e$ValidationError, Error)


export = {
  ValidationError: e$ValidationError
}