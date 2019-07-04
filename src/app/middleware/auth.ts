import sessionModel from './../models/session'
import { Session, AuthType } from './../interfaces/session'
import { ArtistModel } from './../models/artist'

export namespace AuthMiddleware {

  export function authPatron() {
    return auth(AuthType.PATRON)
  }

  export function authArtist() {
    return auth(AuthType.ARTIST)
  }

  function auth(type: AuthType) {
    return async (req: any, res: any, next: any) => {
      if (req.cookies.pigs) {
        let cookie = JSON.parse(req.cookies.pigs) 
        let sessionId = cookie.sessionId
        try {
          let session: Session = await sessionModel.getSession(sessionId) 
          if (session.user_type == type) {
            req.user = await ArtistModel.get(session.user_id)
            await sessionModel.updateSession(sessionId)
            next()
          } else {
            sendRedirect(res)
          }
        } catch (err) {
          sendRedirect(res)
        }
      } else {
        sendRedirect(res)
      }
    }
  }

  function sendRedirect(res: any) {
    res.statusCode = 302
    res.send("You are not authorized to access this page")
  }
}

