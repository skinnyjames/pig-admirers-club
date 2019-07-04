import db from './../lib/db'
import { ValidationError } from '../lib/errors'
import { loginSchema, artistSchema } from '../validations/artist'
import { Check } from '../interfaces/artist'
import mailer from './../lib/mailer'
import session from './session'
import moment from 'moment'
import bcrypt from 'bcrypt'
import generator from 'generate-password'

export namespace ArtistModel {

  export async function validateLogin(loginData: any): Promise<void> {
    let errors = loginSchema.validate(loginData)
    if (errors.length > 0) {
      throw new ValidationError('Please correct the following errors', errors)
    }
  }
  export async function authenticate(loginData: any): Promise<String> {
    await validateLogin(loginData)
    let check = await this.checkLogin(loginData)
    if (!check.authenticated) {
      let errors = [{
        field: 'email',
        message: 'incorrect'
      },{
        field: 'password',
        message: 'incorrect'
      }]
      throw new ValidationError('Login failed', errors)
    } else {
      let sessionId = await session.createArtistSession(check)
      return sessionId.toString()
    }
  }

  export function get(id: Number) {
    return db.one('select id, first_name, last_name, email, bio, born, image_url from artists where id = ${id}', {id: id})
  }

  export async function addInitialArist(artistData: Object) {
    await validateArtist(artistData)
    artistData = await inflatePassword(artistData, false)
    let mailerData = await inviteArtist(artistData, true)
    await emailConfirmation(mailerData)
  }

  export async function validateArtist(artistData: Object): Promise<void> {
    let errors = artistSchema.validate(artistData)
    if (errors.length > 0) {
      throw new ValidationError('Please check the following errors', errors)
    }
  }

  export async function inflatePassword(artistData: any, random: boolean = false) {
    let password = random ? generatePassword() : artistData.password
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(password, salt)
    return {
      password_salt: salt,
      password_hash: hash,
      ...artistData
    }
  }

  export function generatePassword(): string{
    return generator.generate({
      length: 10, 
      numbers: true
    })
  }

  export async function inviteArtist(artistData: any, verified: boolean = false): Promise<Object> {
    let data = {
      ...artistData,
      verified: verified,
      born: moment(artistData.born, 'MM/DD/YYYY').format('YYYY-MM-DD HH:mm:ss'),
      expires: moment().add(1, 'day').format()
    }

    let sql = 'with new_artist as (' + 
      'insert into artists(owner, first_name, last_name, bio, born, email, password_hash, password_salt, verified)' +
      'values(true, ${first_name}, ${last_name}, ${bio}, ${born}, ${email}, ${password_hash}, ${password_salt}, ${verified}) returning id' + 
    ') insert into invites(artist_id, expires) values ((select id from new_artist), ${expires}) returning guid'

    let record = await db.one(sql, data)
    return {
      artist: artistData,
      guid: record.guid
    }
  }

  export async function emailConfirmation(emailData: any) : Promise<Object> {
    emailData.url = emailData.artist.host
    return mailer.sendInvite(emailData)
  }

  export async function checkLogin(loginData: any): Promise<Object> {
    let check: Check = { authenticated: false, artist: null }
    let sql = 'select * from artists where email = ${email}'
    let artist = await db.oneOrNone(sql, loginData)
    if (!artist) {
      return check
    } else {
      try {
        let match = await bcrypt.compare(loginData.password, artist.password_hash)
        if (!match) {
          return check
        } else {
          check.authenticated = true
          check.artist = artist
          return check
        } 
      } catch(err) {
        return check
      }
    }
  }
}