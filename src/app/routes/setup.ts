import express from 'express'
import { SetupModel } from './../models/setup'
import { ArtistModel } from './../models/artist'
import { ValidationError } from '../lib/errors'

const router = express.Router()

router.post('/', (req, res) => {
  const host: string = req.get('host')
  //only allow setup if database isn't set up
  SetupModel.setupRequired()
  .then((bool: boolean) => {
    if (bool) {
      // handle logic here
      const data = req.body
      data.host = host
      addInvite(data) 

    } else {
      res.statusCode = 401
      res.send('Unauthorized')
    }
  })

  function addInvite(data: any) {
    ArtistModel.addInitialArist(data)
    .then((_: any) => {
      res.render('setup', {success: true})
    })
    .catch((err: ValidationError) => {
      if (err instanceof ValidationError) {
        data.errors = err.errors
        data.message = err.message
        res.render('setup', data)
      } else {
        res.statusCode = 500
        res.send('whoops')
      }
    })
  }

})

export = router