import db from './../lib/db'
import { Session } from './../interfaces/session'
import { SessionError } from './../lib/errors'
import moment from 'moment'

interface Artist {
  id: Number
}
interface Check {
  artist: Artist | null
  authenticated: Boolean
}

const session$ = {

  async getSession(id: String): Promise<Session> {
    let sql = 'select * from sessions where id = ${id}'
    let session: Session = await db.oneOrNone(sql, {id: id})
    if (!session) {
      throw new SessionError('no session')
    } else {
      // check expiration
      let expires = moment(session.expires)
      let now = moment()
      if (now.isAfter(expires)) {
        // clear session
        await this.deleteSessionById(id)
        throw new SessionError('session expired')
      } else {
        return session
      }
    }
  },
  async updateSession(id: String): Promise<void> {
    let session = await this.getSession(id)
    let expires = moment().add(1, 'day').format()
    let sql = 'update sessions set expires = ${expires} where id = ${id}'
    await db.none(sql, {id: id, expires: expires})
  },
  async createPatronSession(checkData: Check): Promise<String> {
    return this.createSesion(checkData, 'patron')
  },
  async createArtistSession(checkData: Check): Promise<String>{
    return this.createSession(checkData, 'artist')
  },
  async createSession(checkData: Check, userType: String = 'patron'): Promise<String> {
    await this.deleteSessionByArtist(checkData)
    let sql = 'insert into sessions (user_id, user_type, expires) values (${id}, ${type}, ${expires}) returning id'
    let data = await db.one(sql, {
      id: checkData.artist.id,
      type: userType,
      expires: moment().add(1, 'day').format()
    })
    return data.id
  },
  async deleteSessionById(id: string): Promise<void> {
    let sql = 'delete from sessions where id = ${id}'
    await db.none(sql, {id: id})
  },
  async deleteSessionByArtist(checkData: Check): Promise<void> {
    let sql = 'delete from sessions where user_id = ${id} and user_type = ${type}'
    await db.none(sql, {id: checkData.artist.id, type: 'artist' })
  },
}

export = session$