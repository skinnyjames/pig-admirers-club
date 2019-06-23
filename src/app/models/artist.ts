import db from './../lib/db'
import { ValidationError } from '../lib/errors'
import Validator from './../lib/validator'
import mailer from './../lib/mailer'
import session from './session'
import moment from 'moment'
import bcrypt from 'bcrypt'
import generator from 'generate-password'

interface Artist {
  id: Number
}

interface Check {
  artist: Artist | null
  authenticated: Boolean
}

const artistSchema = new Validator({
  presence: ['first_name', 'last_name', 'bio', 'born', 'email','password', 'password_confirmation'],
  regex: {
    born: /^\d{2}\/\d{2}\/\d{4}$/
  },
  custom: [
    (artistData: any) => {
      return {
        condition: artistData.password == artistData.password_confirmation, 
        message: "passwords don't match", 
        fields: ['password', 'password_confirmation']
      }
    },
  ]
})

const loginSchema = new Validator({
  presence: ['email', 'password']
})

const passwordReset = new Validator({
  presence: ['password', 'password_confirmation'],
  custom: [
    (artistData: any) => {
      return {
        condition: artistData.password === artistData.password_confimration, 
        error: "passwords don't match", 
        fields: ['password', 'password_confirmation']
      }
    },
  ]
})

const $artist = {
  get(id: Number) {
    return db.one('select id, first_name, last_name, email, bio, born, image_url from artists where id = ${id}', {id: id})
  },
  addInitialArist(artistData: Object) {
    return this.validateArtist(artistData)
    .then((artistData: Object) => {
      return this.inflatePassword(artistData)
    })
    .then((artistData: Object) => {
      return this.inviteSean(artistData)
    })
    .then((emailData: Object) => {
      return this.emailArtist(emailData)
    })
  },
  async authenticate(loginData: any): Promise<String> {
    let errors = loginSchema.validate(loginData)
    if (errors.length > 0) {
      throw new ValidationError('Please correct the following errors', errors)
    }
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
      console.log('SESSION ID:', sessionId)
      return sessionId.toString()
    }
  },
  async checkLogin(loginData: any): Promise<Object> {
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
        console.log('matcherror', err)
      }
    }
  },

  validateArtist(artistData: Object): Promise<Object> {
    return new Promise((resolve, reject) => {
      let errors = artistSchema.validate(artistData)
      if (errors.length > 0) {
        return reject(new ValidationError('Please check the following errors', errors))
      } else {
        return resolve(artistData)
      }
    })
  },
  inflatePassword(artistData: any, random: false): Promise<Object> {
    let password: string
    if (random) {
      password = generator.generate({
        length: 10,
        numbers: true
      })
    } else {
      password = artistData.password
    }

    return bcrypt.genSalt(10)
    .then(salt => {
      return bcrypt.hash(password, salt)
      .then(hash => {
        return Object.assign({
          password_salt: salt,
          password_hash: hash
        }, artistData)
      })
    })
  },

  async inviteSean(artistData: any): Promise<Object> {
    return this.inviteArtist(artistData, true)
  },
  async inviteArtist(artistData: any, verified: boolean = false): Promise<Object> {
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

    return db.one(sql, data)
    .then((data: any) => {
      return Promise.resolve({ artist: artistData, guid: data.guid });
    })
  },

  emailArtist(emailData: any) : Promise<Object> {
    emailData.url = emailData.artist.host
    return mailer.sendInvite(emailData)
  }

}
export = $artist