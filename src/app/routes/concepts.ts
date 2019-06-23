import multer from 'multer'
import { Request, Router } from 'express'
import conceptModel from './../models/concept'
import { ValidationError } from '../lib/errors'
const upload = multer({ dest: 'public/temp/'})


const router =  Router()
router.post('/upload', upload.single('file'), (req, res) => {
  res.send({
    ...req.file,
    status: 'success'
  })
})

router.post('/new', async (req, res) => {
  let conceptData = req.body
  try {
    let id = await conceptModel.create(conceptData)
  } catch (err) {
    if (err instanceof ValidationError) {
      res.statusCode = 401
      res.send(err)
    } else {
      res.statusCode = 500
      res.send('Error occurred')
    }
  }
})


export = router