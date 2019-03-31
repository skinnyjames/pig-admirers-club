import db from './../lib/db'
import e from './../lib/errors'
import Validator from './../lib/validator'
import moment from 'moment'

const artistSchema = new Validator({
  presence: ['first_name', 'last_name', 'bio', 'born', 'email']
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
  validateArtist(artistData: Object): Promise<Object> {
    let errors = artistSchema.validate(artistData)
    if (errors) {
      return Promise.reject(new e.ValidationError('Please check the following errors', errors))
    } else {
      return this.inviteArtist(artistData)
    }
  },

  inviteArtist(artistData: any): Promise<Object> {
    artistData.expires = moment().add(1, 'day').format()
    artistData.born = moment(artistData.born).format()
    let sql = 'with new_artist as (' + 
      'insert into artists(first_name, last_name, bio, born, email)' +
      'values(${first_name}, ${last_name}, ${bio}, ${born}, ${email} returning id' + 
    ') insert into invites(artist_id, expires) values ((select id from new_artist), ${expires}) returning guid'

    return db.one(sql, artistData)
    .then((data: any) => {
      return this.emailArtist({guid: data.guid, email: artistData.email})
    })
  },

  emailArtist(data: any) : Promise<Object> {
    return Promise.resolve({})
  }

}
export = $artist