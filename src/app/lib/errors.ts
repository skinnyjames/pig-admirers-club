import util from 'util'

export interface iValidationError {
  message: string
  errors: Array<Object>
}

export interface iSessionError {
  message: string
}

export class ValidationError extends Error implements iValidationError {
  errors: Array<Object>

  constructor(message: string, errors?: Array<Object>) {
    super(message)
    this.errors = errors
  }
}

export class SessionError extends Error implements iSessionError {}