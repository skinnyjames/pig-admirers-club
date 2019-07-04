import { Router } from 'express'
import { ISessionRequest } from './../interfaces/session'
import { ArtistModel } from './../models/artist'
import { ValidationError } from '../lib/errors'
import { AuthMiddleware } from '../middleware/auth'

const router = Router()

router.get('/me', AuthMiddleware.authArtist(), async (req: ISessionRequest, res: any) => {
  res.send(req.user)
})

router.post('/login', async (req, res) => {
  const data = req.body
  try {
    let sessionId = await ArtistModel.authenticate(data)
    res.cookie('pigs', JSON.stringify({ sessionId: sessionId }))
    res.statusCode = 200
    res.send('Login succeeded')
  } catch (err) {
    if (err instanceof ValidationError) {
      res.statusCode = 401
      res.send(err)
    } else {
      res.statusCode = 500
      res.send(err)
    }
  }
})

export = router