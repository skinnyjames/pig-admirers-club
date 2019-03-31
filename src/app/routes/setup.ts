import express from 'express'
import setup from './../models/setup'
import e from './../lib/errors'

const router = express.Router()

router.post('/', (req, res) => {
  //only allow setup if database isn't set up
  setup.setupRequired()
  .then((bool: boolean) => {
    if (bool) {
      // handle logic here
    } else {
      res.statusCode = 401
      res.send('Unauthorized')
    }
  })
})