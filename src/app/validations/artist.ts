import Validator from './../lib/validator'

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

export { passwordReset, loginSchema, artistSchema }