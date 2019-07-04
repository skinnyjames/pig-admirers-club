import util from 'util'

export interface iValidationError {
  message: string
  type: string
  errors: Array<Object>
}

export interface iSystemError  {
  message: string,
  type: string
}

export interface iSessionError {
  message: string
}

export class ValidationError extends Error implements iValidationError {
  errors: Array<Object>
  type: string 

  constructor(message: string, errors?: Array<Object>) {
    super(message)
    this.message = message
    this.type = 'ValidationError'
    this.errors = errors
  }
}

export class SystemError extends Error implements iSystemError {
  type: string 

  constructor(message: string, errors?: Array<Object>) {
    super(message)
    this.message = message
    this.type = 'SystemError'
  }
}

export class SessionError extends Error implements iSessionError {}