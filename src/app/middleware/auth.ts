import sessionModel from './../models/session'
import artistModel from './../models/artist'
import { SessionError } from './../lib/errors'

export = async (req: any, res: any, next: any) => {
  console.log(req.cookies)
  if (req.cookies.pigs) {
    let cookie = JSON.parse(req.cookies.pigs)
    let sessionId = cookie.sessionId
    try {
      req.session = await sessionModel.getSession(sessionId)
      if (req.session.user_type == 'artist') {
        req.user = await artistModel.get(req.session.user_id)
      }
      await sessionModel.updateSession(sessionId)
      next()
    } catch (err) {
      if (err instanceof SessionError) {
        next()
      } else {
        next(new Error('bad session'))
      }
    }
  } else {
    next()
  }
}