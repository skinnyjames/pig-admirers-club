import { Request, Router } from 'express'
import artistModel from './../models/artist'
import { ValidationError } from '../lib/errors'

const router = Router()
interface ISessionRequest extends Request {
  session: any
  user: any
}
router.get('/me', async (req: ISessionRequest, res: any) => {
  if (req.session && req.session.user_type == 'artist') {
    // get user
    let artist = req.user
    res.statusCode = 200
    res.send(artist)
  } else {
    // redirect to login
    res.statusCode = 302
    res.send(null)
  }
})


router.post('/login', async (req, res) => {
  const data = req.body
  try {
    let sessionId = await artistModel.authenticate(data)
    res.cookie('pigs', JSON.stringify({ sessionId: sessionId }))
    res.statusCode = 200
    res.send('Login succeeded')
  } catch (err) {
    if (err instanceof ValidationError) {
      res.statusCode = 401
      res.send(err)
    } else {
      console.log("LOGIN ERROR", err)
      res.statusCode = 500
      res.send('An error occured')
    }
  }
})

export = router