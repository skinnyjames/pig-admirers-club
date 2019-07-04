import { Request } from 'express'

export enum AuthType {
  ARTIST = 'artist',
  PATRON = 'patron'
}

export interface Session {
  user_type: AuthType,
  user_id: number,
  id: number,
  expires: any,
  created_at: any,
  payload: any
}

export interface ISessionRequest extends Request {
  user: any
}