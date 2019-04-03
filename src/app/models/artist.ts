import db from './../lib/db'
import { ValidationError } from '../lib/errors'
import Validator from './../lib/validator'
import mailer from './../lib/mailer'
import moment from 'moment'
import bcrypt from 'bcrypt'
import generator from 'generate-password'

const artistSchema = new Validator({
  presence: ['first_name', 'last_name', 'bio', 'born', 'email'],
  regex: {
    born: /^\d{2}\/\d{2}\/\d{4}$/
  }
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
  addNewArist(artistData: Object) {
    return this.validateArtist(artistData)
    .then((artistData: Object) => {
      return this.inflateRandomPassword(artistData)
    })
    .then((artistData: Object) => {
      return this.inviteArtist(artistData)
    })
    .then((emailData: Object) => {
      return this.emailArtist(emailData)
    })
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

  inflateRandomPassword(artistData: Object): Promise<Object> {
    let password = generator.generate({
      length: 10,
      numbers: true
    })

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

  async inviteArtist(artistData: any): Promise<Object> {
    let data = Object.assign({
      born: moment(artistData.born, 'MM/DD/YYYY').format('YYYY-MM-DD HH:mm:ss'),
      expires: moment().add(1, 'day').format()
    }, artistData)

    let sql = 'with new_artist as (' + 
      'insert into artists(owner, first_name, last_name, bio, born, email, password_hash, password_salt)' +
      'values(true, ${first_name}, ${last_name}, ${bio}, ${born}, ${email}, ${password_hash}, ${password_salt}) returning id' + 
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